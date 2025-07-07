import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return <RouterProvider router={router} />;
}

export default App;
