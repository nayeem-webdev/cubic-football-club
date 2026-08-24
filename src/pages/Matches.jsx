import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import ScoreCard from "../components/ScoreCard";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = import.meta.env.VITE_JSONBIN_MASTER_KEY;

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch(
          "https://api.jsonbin.io/v3/b/6a7ee08fda38895dfee3c2ae/latest",
          {
            headers: {
              "X-Master-Key": key,
            },
          },
        );

        const data = await response.json();

        console.log("JSONBin response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch matches");
        }

        setMatches(
          [...data.record].sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } catch (err) {
        console.error("Match loading error:", err);
        setError("Unable to load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [key]);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      className="min-h-screen text-text"
      style={{ background: "var(--color-background)" }}
    >
      <PageHero
        text="Matches"
        heading="Match Center"
        subheading="View upcoming fixtures, recent results, and every match played by Cubic FC."
      />

      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
        {matches.map((match) => (
          <ScoreCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
