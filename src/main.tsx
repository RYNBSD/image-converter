import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./app.tsx";
import Loading from "./loading.tsx";
import ConvertProvider from "./contexts/convert.tsx";
import ProcessProvider from "./contexts/process.tsx";
import ThemeProvider from "./contexts/theme.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<Loading />}>
      <ThemeProvider>
        <ProcessProvider>
          <ConvertProvider>
            <App />
          </ConvertProvider>
        </ProcessProvider>
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>
);
