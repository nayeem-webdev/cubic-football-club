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
import LiveMatch from "../pages/LiveMatch";

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
        path: "/register-player",
        element: <RegisterPlayer />,
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
        element: <LiveMatch />,
      },
    ],
  },
]);

export default router;
