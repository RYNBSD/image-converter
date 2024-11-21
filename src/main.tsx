import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./app.tsx";
import Loading from "./loading.tsx";
import { ConvertProvider } from "./context/convert.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<Loading />}>
      <ConvertProvider>
        <App />
      </ConvertProvider>
    </React.Suspense>
  </React.StrictMode>
);
