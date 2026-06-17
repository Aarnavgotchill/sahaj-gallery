import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const projectId = "gnzt2t90";
const dataset = "production";

export default defineConfig({
  name: "default",
  title: "Sahaj Gallery",
  projectId,
  dataset,
  plugins: [structureTool(), media(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
