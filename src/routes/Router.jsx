import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Players from "../pages/Players";
import Schedule from "../pages/Schedule";
import Matches from "../pages/Matches";
import RegisterPlayer from "../pages/RegisterPlayer";
import AddSchedule from "../pages/AddSchedule";
import NewMatch from "../pages/NewMatch";
import RegisterTeam from "../pages/RegisterTeam";
import LiveScore from "../pages/liveScore";
import UpdatePlayer from "../pages/UpdatePlayer";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/players",
        element: <Players />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/matches",
        element: <Matches />,
      },
      {
        path: "/login",
        element: <AdminLogin />,
      },
      {
        element: <AdminProtectedRoute />,
        children: [
          {
            path: "/admin",
            element: <Admin />,
          },
          {
            path: "/register-player",
            element: <RegisterPlayer />,
          },
          {
            path: "/update-player",
            element: <UpdatePlayer />,
          },
          {
            path: "/register-team",
            element: <RegisterTeam />,
          },
          {
            path: "/add-schedule",
            element: <AddSchedule />,
          },
          {
            path: "/new-match",
            element: <NewMatch />,
          },
          {
            path: "/live-match",
            element: <LiveScore />,
          },
        ],
      },
    ],
  },
]);

export default router;
