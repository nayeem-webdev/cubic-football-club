import { createBrowserRouter } from "react-router-dom";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import NotFound from "../pages/NotFound";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Players from "../pages/Players";
import Schedule from "../pages/Schedule";
import Score from "../pages/Score";
import RegisterPlayer from "../pages/RegisterPlayer";
import AddSchedule from "../pages/AddSchedule";
import RegisterTeam from "../pages/RegisterTeam";
import LiveScore from "../pages/liveScore";
import UpdatePlayer from "../pages/UpdatePlayer";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import Teams from "../pages/Teams";
import Matches from "../pages/Matches";
import MatchDetails from "../pages/MatchDetails";
import AddMatch from "../pages/AddMatch";
import EditMatch from "../pages/EditMatch";
import UpdateMatch from "../pages/UpdateMatch";
import UpdateSchedule from "../pages/UpdateSchedule";
import AddOpponent from "../pages/AddOpponent";
import UpdateOpponentPlayer from "../pages/UpdateOpponentPlayer";
import EditScore from "../pages/EditScore";
import UpdateScore from "../pages/UpdateScore";
import UpdatePlayersBulk from "../pages/UpdatePlayerBulk";

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
        path: "/score",
        element: <Score />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/matches",
        element: <Matches />,
      },
      {
        path: "/upcoming-matches/:id",
        element: <MatchDetails />,
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
            path: "/update-player-bulk",
            element: <UpdatePlayersBulk />,
          },
          {
            path: "/register-team",
            element: <RegisterTeam />,
          },
          {
            path: "/add-opponent",
            element: <AddOpponent />,
          },
          {
            path: "/update-opponent-player",
            element: <UpdateOpponentPlayer />,
          },

          {
            path: "/add-schedule",
            element: <AddSchedule />,
          },

          {
            path: "/new-match",
            element: <AddMatch />,
          },
          {
            path: "/live-match",
            element: <LiveScore />,
          },
          {
            path: "/update-match",
            element: <UpdateMatch />,
          },
          {
            path: "/edit-match/:id",
            element: <EditMatch />,
          },
          {
            path: "/update-schedule",
            element: <UpdateSchedule />,
          },
          {
            path: "/update-score",
            element: <UpdateScore />,
          },
          {
            path: "/update-score/:id",
            element: <EditScore />,
          },
        ],
      },
    ],
  },
]);

export default router;
