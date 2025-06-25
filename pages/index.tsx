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

      // Fetch Cases
      const { data: casesData, error: casesError } = await supabase
        .from("Cases")
        .select("*");
      setCasesError(casesError);
      if (!casesError) setCases(casesData || []);

      // Fetch Intoxications
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
          {/* CASES TABLE */}
          <h2>Cases</h2>
          {casesError && (
            <div style={{ color: "red" }}>Cases Error: {casesError.message}</div>
          )}
          {cases.length ? (
            <table border="1" cellPadding={5}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Created At</th>
                  <th>Category</th>
                  <th>Species</th>
                  <th>Symptoms</th>
                  <th>Triage Level</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{item.id}</td>
                    <td>{item.created_at}</td>
                    <td>{item.category}</td>
                    <td>{item.species}</td>
                    <td>{item.symptoms}</td>
                    <td>{item.triage_level}</td>
                    <td>{item.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No cases found.</p>
          )}

          {/* INTOXICATIONS TABLE */}
          <h2>Intoxications</h2>
          {intoxError && (
            <div style={{ color: "red" }}>
              Intoxications Error: {intoxError.message}
            </div>
          )}
          {intoxications.length ? (
            <table border="1" cellPadding={5}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Created At</th>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Toxin</th>
                  <th>Symptoms</th>
                  <th>Treatment</th>
                  <th>Prognosis</th>
                </tr>
              </thead>
              <tbody>
                {intoxications.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{item.id}</td>
                    <td>{item.created_at}</td>
                    <td>{item.name}</td>
                    <td>{item.species}</td>
                    <td>{item.toxin}</td>
                    <td>{item.symptoms}</td>
                    <td>{item.treatment}</td>
                    <td>{item.prognosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No intoxications found.</p>
          )}
        </>
      )}
    </div>
  );
}
