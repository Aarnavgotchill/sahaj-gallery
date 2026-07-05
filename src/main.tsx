import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { initImageProtection } from "./lib/imageProtection";
import "./styles.css";

initImageProtection();

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: false,
});

/*
 * ─── StrictMode Toggle ───
 *
 * React StrictMode double-renders components in development to detect side-effect
 * bugs. This is valuable during feature work but DOUBLES all render/effect cost
 * during performance profiling.
 *
 *   ENABLE_STRICT_MODE = true   (default) — StrictMode ON, all effects ×2
 *   ENABLE_STRICT_MODE = false            — StrictMode OFF, measure real render cost
 *
 * StrictMode has NO effect in production builds. Toggle this only for local
 * performance measurement (see LOCAL_PERFORMANCE_DIAGNOSIS.md).
 */
const ENABLE_STRICT_MODE = true;
const StrictWrapper = ENABLE_STRICT_MODE ? React.StrictMode : React.Fragment;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictWrapper>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictWrapper>,
);
