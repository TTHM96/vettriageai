import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Case = {
  id: number;
  created_at: string;
  species?: string;
  symptoms?: string;
  triage_level?: string;
  recommendation?: string;
  // Add any other columns you have!
};

export default function Home() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Cases").select("*").order("id", { ascending: false });
      if (error) {
        console.error("Error fetching cases:", error.message);
        setCases([]);
      } else {
        setCases(data || []);
      }
      setLoading(false);
    };

    fetchCases();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>VetTriageAI Cases</h1>
      {loading ? (
        <p>Loading cases...</p>
      ) : cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created</th>
              <th>Species</th>
              <th>Symptoms</th>
              <th>Triage Level</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
                <td>{c.species}</td>
                <td>{c.symptoms}</td>
                <td>{c.triage_level}</td>
                <td>{c.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
