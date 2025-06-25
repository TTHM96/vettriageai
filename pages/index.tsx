import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [cases, setCases] = useState<any[]>([]);
  useEffect(() => {
    const fetchCases = async () => {
      let { data, error } = await supabase.from('cases').select('*');
      if (!error) setCases(data || []);
    };
    fetchCases();
  }, []);
  return (
    <main>
      <h1>VetTriageAI Case List</h1>
      <ul>
        {cases.map((item, i) => (
          <li key={i}>
            <strong>Category:</strong> {item.category} | <strong>Species:</strong> {item.species} | <strong>Symptoms:</strong> {item.symptoms} | <strong>Triage:</strong> {item.triage_level} | <strong>Recommendation:</strong> {item.recommendation}
          </li>
        ))}
      </ul>
    </main>
  );
}
