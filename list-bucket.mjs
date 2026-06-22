import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const env = {};
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  let v = t.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
    v = v.slice(1, -1);
  env[t.slice(0, i).trim()] = v;
}

const s3 = new S3Client({
  region: "auto",
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

s3.send(new ListObjectsV2Command({ Bucket: env.R2_BUCKET_NAME, MaxKeys: 50 }))
  .then((r) => {
    if (r.Contents && r.Contents.length > 0) {
      console.log("FILES IN BUCKET (" + r.Contents.length + " shown):");
      for (const o of r.Contents) console.log("  " + o.Key);
    } else {
      console.log("Bucket EMPTY or no objects returned");
    }
  })
  .catch((e) => console.error("S3 ERROR:", e.message));
