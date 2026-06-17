import { defineCliConfig } from "sanity/cli";

const projectId = "gnzt2t90";
const dataset = "production";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "sahaj-gallery",
});
