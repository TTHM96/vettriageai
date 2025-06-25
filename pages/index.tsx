import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [cases, setCases] = useState<any[]>([]);
  const [intoxications, setIntoxications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [casesError, setCasesError] = useState<any>(null);
  const [intoxError, setIntoxError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch from Cases table
      const { data: casesData, error: casesError } = await supabase
        .from("Cases")
        .select("*");
      setCasesError(casesError);
      if (!casesError) setCases(casesData || []);

      // Fetch from Intoxications table
      const { data: intoxData, error: intoxError } = await supabase
        .from("Intoxications")
        .select("*");
      setIntoxError(intoxError);
      if (!intoxError) setIntoxications(intoxData || []);

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
          <h2>Cases</h2>
          {casesError && (
            <div style={{ color: "red" }}>
              Cases Error: {casesError.message}
            </div>
          )}
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
          {intoxError && (
            <div style={{ color: "red" }}>
              Intoxications Error: {intoxError.message}
            </div>
          )}
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
}
