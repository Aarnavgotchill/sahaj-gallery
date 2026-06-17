import { useRef, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;
  panX?: number;
  panY?: number;
}

const vsSource = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

const fsSource = `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 outColor;
uniform sampler2D u_texture;
void main() {
  outColor = texture(u_texture, v_texCoord);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

let sharedProgram: WebGLProgram | null = null;
let sharedVao: WebGLVertexArrayObject | null = null;

function initShared(gl: WebGL2RenderingContext) {
  if (sharedProgram) return;
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  sharedProgram = gl.createProgram()!;
  gl.attachShader(sharedProgram, vs);
  gl.attachShader(sharedProgram, fs);
  gl.linkProgram(sharedProgram);

  const positions = new Float32Array([
    -1, -1, 0, 0,
     1, -1, 1, 0,
    -1,  1, 0, 1,
     1,  1, 1, 1,
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  sharedVao = gl.createVertexArray();
  gl.bindVertexArray(sharedVao);
  const posLoc = gl.getAttribLocation(sharedProgram, "a_position");
  const texLoc = gl.getAttribLocation(sharedProgram, "a_texCoord");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 16, 8);
  gl.bindVertexArray(null);
}

export function ProtectedImage({ src, alt, className = "", zoom = 1, panX = 0, panY = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const drawRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true, alpha: false, antialias: true });
    if (!gl) return;
    glRef.current = gl;
    initShared(gl);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (textureRef.current) gl.deleteTexture(textureRef.current);
      const tex = gl.createTexture();
      textureRef.current = tex;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const draw = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(sharedProgram);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.bindVertexArray(sharedVao);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindVertexArray(null);
        drawRef.current = requestAnimationFrame(draw);
      };
      draw();
    };

    return () => {
      cancelAnimationFrame(drawRef.current);
      if (textureRef.current && gl) gl.deleteTexture(textureRef.current);
    };
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl || !textureRef.current) return;

    canvas.style.transform = `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`;

    if (zoom > 1) {
      const iw = imgRef.current?.naturalWidth || canvas.width;
      const ih = imgRef.current?.naturalHeight || canvas.height;
      canvas.style.width = `${iw * zoom}px`;
      canvas.style.height = `${ih * zoom}px`;
    } else {
      canvas.style.width = "";
      canvas.style.height = "";
    }
  }, [zoom, panX, panY]);

  return (
    <div className="relative inline-block" style={{ lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 select-none" />
    </div>
  );
}
