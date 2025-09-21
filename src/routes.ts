import { createBrowserRouter } from "react-router";
import MigratePage from "./pages/migrate/page";
import CheckPlaylistPage from "./pages/check-playlist/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MigratePage,
  },
  {
    path: "/check-playlist/:id",
    Component: CheckPlaylistPage,
  },
]);

export default router;
