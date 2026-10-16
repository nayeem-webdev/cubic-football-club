import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

import MatchCard from "../components/MatchCard";

const API_URL = import.meta.env.VITE_API_URL;

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch matches");
        }

        setMatches(data.matches || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      {loading && <Loader />}
      {error && (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 text-text-muted p-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
          <h2 className="text-lg font-semibold">Unable to load matches</h2>
          <p className="mt-2 text-sm text-text-muted">{error}</p>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <PageHero
          text={"CUBIC FC"}
          heading={"Matches"}
          subheading={
            "Follow upcoming fixtures, friendly matches, and previous games."
          }
        />

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-text-muted">No matches available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <MatchCard match={match} key={match._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
