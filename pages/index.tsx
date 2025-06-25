import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [cases, setCases] = useState<any[]>([]);
  const [intoxications, setIntoxications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch from Cases table
      const { data: casesData, error: casesError } = await supabase
        .from("Cases")
        .select("*");
      if (casesError) console.error("Cases error:", casesError);

      // Fetch from Intoxications table
      const { data: intoxData, error: intoxError } = await supabase
        .from("Intoxications")
        .select("*");
      if (intoxError) console.error("Intoxications error:", intoxError);

      setCases(casesData || []);
      setIntoxications(intoxData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
  <div style={{ padding: 32 }}>
    <h1>VetTriageAI Data</h1>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        {casesError && <div style={{color: "red"}}>Cases Error: {casesError.message}</div>}
        <h2>Cases</h2>
        {cases.length ? (
          <ul>
            {cases.map((item, idx) => (
              <li key={idx}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        ) : (
          <p>No cases found.</p>
        )}
        <h2>Intoxications</h2>
        {intoxications.length ? (
          <ul>
            {intoxications.map((item, idx) => (
              <li key={idx}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        ) : (
          <p>No intoxications found.</p>
        )}
      </>
    )}
  </div>
);
