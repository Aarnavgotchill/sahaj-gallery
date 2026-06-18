import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface ArtworkData {
  title: string;
  sub: string;
  desc: string;
  dim: string;
  svg?: string;
  image?: string;
}

interface Props {
  artworks: ArtworkData[];
  imgIdx: number;
  onNavImg: (dir: 1 | -1) => void;
  onSetImgIdx: (i: number) => void;
  onClose: () => void;
}

function svgToTexture(svg: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size * (img.naturalHeight / img.naturalWidth);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      URL.revokeObjectURL(url);
      resolve(tex);
    };
    img.src = url;
  });
}

const SCRIBBLE_W = 16;
const SCRIBBLE_H = 12;
const SPACING = 3.4;
const OFFSET_X = -(SCRIBBLE_W * SPACING) / 2;
const PLANE_W = 2.8;
const PLANE_H = 3.8;

interface PlaneInfo {
  mesh: THREE.Mesh;
  targetPos: THREE.Vector3;
  targetRot: number;
  index: number;
}

export default function WebGLGallery({ artworks, imgIdx, onNavImg, onSetImgIdx, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planesRef = useRef<PlaneInfo[]>([]);
  const animRef = useRef(0);
  const isFocused = useRef(false);
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 14));
  const targetCamLook = useRef(new THREE.Vector3(0, 0, 0));
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  const setupScene = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f0f0f");

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 2, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xc9a96e, 0.4);
    fill.position.set(-3, 2, -5);
    scene.add(fill);

    // Floor grid (subtle)
    const grid = new THREE.GridHelper(SCRIBBLE_W * SPACING, 16, 0x222222, 0x222222);
    grid.position.y = -PLANE_H / 2 - 0.1;
    scene.add(grid);

    // Load all textures and create planes
    const textures = await Promise.all(
      artworks.map((art) => {
        if (art.image) {
          return new Promise<THREE.Texture>((resolve) => {
            new THREE.TextureLoader().load(art.image!, (tex) => resolve(tex));
          });
        }
        return svgToTexture(art.svg ?? "");
      })
    );

    const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    const planes: PlaneInfo[] = [];

    textures.forEach((tex, i) => {
      const col = i % SCRIBBLE_W;
      const row = Math.floor(i / SCRIBBLE_W);
      const x = col * SPACING + OFFSET_X;
      const z = row * SPACING - 2;
      const rot = (Math.random() - 0.5) * 0.15;

      const material = new THREE.MeshStandardMaterial({
        map: tex,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0, z);
      mesh.rotation.x = -0.05;
      mesh.rotation.z = rot;
      mesh.userData.index = i;
      scene.add(mesh);

      // Border
      const edge = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xc9a96e,
        transparent: true,
        opacity: 0.2,
      });
      const line = new THREE.LineSegments(edge, lineMat);
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      scene.add(line);

      // Shadow plane below
      const shadowGeo = new THREE.PlaneGeometry(PLANE_W * 1.1, PLANE_H * 1.1);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.position.set(x, -PLANE_H / 2 - 0.05, z + 0.1);
      shadow.rotation.x = -Math.PI / 2;
      scene.add(shadow);

      planes.push({ mesh, targetPos: new THREE.Vector3(x, 0, z), targetRot: rot, index: i });
    });

    planesRef.current = planes;

    // Raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (isDragging.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes = planes.map((p) => p.mesh);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.index as number;
        focusPlane(idx);
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging.current = true;
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      if (isDragging.current && !isFocused.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        panOffset.current.x -= dx * 0.005;
        panOffset.current.y += dy * 0.005;
        updateTargetFromPan();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (isFocused.current) return;
      panOffset.current.x -= e.deltaX * 0.003;
      panOffset.current.y -= e.deltaY * 0.003;
      updateTargetFromPan();
    };

    const updateTargetFromPan = () => {
      targetCamPos.current.set(
        panOffset.current.x,
        2 + panOffset.current.y,
        14
      );
      targetCamLook.current.set(panOffset.current.x, panOffset.current.y, 0);
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFocused.current) {
          unfocusPlane();
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowRight") {
        if (isFocused.current) onNavImg(1);
      }
      if (e.key === "ArrowLeft") {
        if (isFocused.current) onNavImg(-1);
      }
    };

    const focusPlane = (idx: number) => {
      isFocused.current = true;
      onSetImgIdx(idx);
      const p = planesRef.current[idx];
      if (!p) return;
      targetCamPos.current.set(p.mesh.position.x, 0.5, 4);
      targetCamLook.current.copy(p.mesh.position);
      // Dim other planes
      planesRef.current.forEach((pl, i) => {
        const mat = pl.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = i === idx ? 1 : 0.15;
        mat.transparent = true;
      });
    };

    const unfocusPlane = () => {
      isFocused.current = false;
      updateTargetFromPan();
      planesRef.current.forEach((pl) => {
        const mat = pl.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 1;
        mat.transparent = false;
      });
    };

    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", keyHandler);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const lerp = 1 - Math.pow(0.001, dt);

      // Smooth camera
      camera.position.lerp(targetCamPos.current, lerp);
      camera.lookAt(
        camera.position.x + (targetCamLook.current.x - camera.position.x) * lerp * 0.5,
        targetCamLook.current.y,
        0
      );

      // Hover animation on non-focused planes
      if (!isFocused.current) {
        const t = clock.elapsedTime;
        planes.forEach((p, i) => {
          p.mesh.position.y = Math.sin(t * 0.6 + i * 1.2) * 0.05;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", keyHandler);
      renderer.dispose();
      geometry.dispose();
      planes.forEach((p) => {
        (p.mesh.material as THREE.Material).dispose();
      });
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [artworks, onNavImg, onSetImgIdx, onClose]);

  useEffect(() => {
    const cleanup = setupScene();
    return () => { cleanup.then((fn) => fn?.()); };
  }, [setupScene]);

  // Sync focused plane when imgIdx changes externally (e.g. nav arrows while focused)
  useEffect(() => {
    if (!isFocused.current || !planesRef.current.length) return;
    const p = planesRef.current[imgIdx];
    if (p) {
      targetCamPos.current.set(p.mesh.position.x, 0.5, 4);
      targetCamLook.current.copy(p.mesh.position);
      planesRef.current.forEach((pl, i) => {
        const mat = pl.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = i === imgIdx ? 1 : 0.15;
        mat.transparent = true;
      });
    }
  }, [imgIdx]);

  return (
    <div
      ref={containerRef}
      className="webgl-gallery"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        overflow: "hidden",
      }}
    />
  );
}
