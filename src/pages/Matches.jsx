import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import ScoreCard from "../components/ScoreCard";
import Loader from "../components/Loader";

export default function Matches() {
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="Matches"
          heading="Match Center"
          subheading="View upcoming fixtures, recent results, and every match played by Cubic FC."
        />

        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {matches.length > 0 ? (
            matches.map((match) => <ScoreCard key={match._id} match={match} />)
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#28466B] bg-[#0E1D34] text-center">
              <p className="text-xl font-bold text-[#F8FAFC]">
                No Matches Found
              </p>

              <p className="mt-2 text-sm text-[#B8C2D1]">
                No match results are available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
