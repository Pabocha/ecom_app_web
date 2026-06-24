import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@/context/UIContext";
import { routes } from "@/routes/router";
// import { QueryClient, QueryClientProvider } from 'react-query'

/**
 * Application principale
 * Enveloppe toute l'app avec les Providers de contexte
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
function App() {
  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </QueryClientProvider>
  );
}

export default App;
