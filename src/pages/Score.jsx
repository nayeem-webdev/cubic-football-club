import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import ScoreCard from "../components/ScoreCard";
import Loader from "../components/Loader";
import { AlertCircle } from "lucide-react";

export default function Score() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch(`${API_URL}/scores`);

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = await response.json();

        console.log("Schedules response:", data);

        setMatches(
          [...data.scores].sort(
            (a, b) => new Date(b.finishedAt) - new Date(a.finishedAt),
          ),
        );
      } catch (err) {
        console.error("Match loading error:", err);
        setError("Unable to load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      {loading && <Loader />}
      {error && (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 text-text-muted p-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
          <h2 className="text-lg font-semibold">Unable to load score</h2>
          <p className="mt-2 text-sm text-text-muted">{error}</p>
        </div>
      )}
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="Matches"
          heading="Match Center"
          subheading="View upcoming fixtures, recent results, and every match played by Cubic FC."
        />

        <div className="mx-auto grid grid-cols-1 max-w-7xl gap-6">
          {matches.length > 0 ? (
            matches.map((match) => <ScoreCard key={match._id} match={match} />)
          ) : (
            <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-border text-text-muted text-center">
              <p className="text-xl font-bold text-text">No Matches Found</p>

              <p className="mt-2 text-sm text-text-muted">
                No match results are available yet.
              </p>
            </div>
          )}
          {error && (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 text-text-muted p-8 text-center">
              <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
              <h2 className="text-lg font-semibold">Unable to load score</h2>
              <p className="mt-2 text-sm text-text-muted">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
