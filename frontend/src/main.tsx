import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import { rootStore } from "./store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <Provider store={rootStore}>
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" duration={2000} richColors />
    </TooltipProvider>
  </Provider>,
);
