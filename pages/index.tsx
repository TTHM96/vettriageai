import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

// Set your admin secret here!
const ADMIN_SECRET = "MTTH1996"

// ---- Types ----
type CaseType = {
  id: number;
  category: string;
  species: string;
  symptoms: string;
  triage_level: string;
  recommendation: string;
};

type IntoxType = {
  id: number;
  created_at?: string;
  species?: string;
  example_breed?: string;
  weight_kg?: string;
  toxin?: string;
  type?: string;
  amount_ingested?: string;
  mg_per_kg?: string;
  clinical_threshold?: string;
  symptoms?: string;
  triage_level?: string;
  recommendation?: string;
};

export default function Home() {
  // --- ADMIN DETECTION ---
  const [adminMode, setAdminMode] = useState(false);
  const [adminCases, setAdminCases] = useState<CaseType[]>([]);
  const [adminIntox, setAdminIntox] = useState<IntoxType[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // --- PUBLIC FORM STATE ---
  const [problem, setProblem] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<CaseType | IntoxType | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for admin query param on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === ADMIN_SECRET) {
      setAdminMode(true);
      setAdminLoading(true);
      Promise.all([
        supabase.from("Cases").select("*"),
        supabase.from("Intoxications").select("*")
      ]).then(([casesRes, intoxRes]) => {
        setAdminCases(casesRes.data || []);
        setAdminIntox(intoxRes.data || []);
        setAdminLoading(false);
      });
    }
  }, []);

  // ---- PUBLIC TRIAGE HANDLER ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // 1. Try Intoxications table first
    let { data: intoxMatch } = await supabase
      .from("Intoxications")
      .select("*")
      .ilike("toxin", `%${problem}%`)
      .eq("species", species);

    if (intoxMatch && intoxMatch.length > 0) {
      setResult(intoxMatch[0]);
      setLoading(false);
      return;
    }

    // 2. Try Cases table (symptoms or category)
    let { data: caseMatch } = await supabase
      .from("Cases")
      .select("*")
      .or([
        `symptoms.ilike.%${problem}%`,
        `category.ilike.%${problem}%`
      ].join(','))
      .eq("species", species);

    setResult(caseMatch && caseMatch.length > 0 ? caseMatch[0] : null);
    setLoading(false);
  };

  // ---- UI ----
  if (adminMode) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1 style={{ fontWeight: 900, color: "#444" }}>VetTriageAI Admin Panel</h1>
        {adminLoading ? <p>Loading data...</p> : (
          <>
            <h2>Cases Table</h2>
            <div style={{ overflowX: "auto" }}>
              <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", marginBottom: 40 }}>
                <thead>
                  <tr>
                    <th>ID</th><th>Category</th><th>Species</th><th>Symptoms</th>
                    <th>Triage Level</th><th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCases.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.category}</td>
                      <td>{row.species}</td>
                      <td>{row.symptoms}</td>
                      <td>{row.triage_level}</td>
                      <td>{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2>Intoxications Table</h2>
            <div style={{ overflowX: "auto" }}>
              <table border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th><th>Created</th><th>Species</th><th>Breed</th><th>Weight</th>
                    <th>Toxin</th><th>Type</th><th>Amount</th><th>mg/kg</th>
                    <th>Threshold</th><th>Symptoms</th><th>Triage Level</th><th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {adminIntox.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.created_at}</td>
                      <td>{row.species}</td>
                      <td>{row.example_breed}</td>
                      <td>{row.weight_kg}</td>
                      <td>{row.toxin}</td>
                      <td>{row.type}</td>
                      <td>{row.amount_ingested}</td>
                      <td>{row.mg_per_kg}</td>
                      <td>{row.clinical_threshold}</td>
                      <td>{row.symptoms}</td>
                      <td>{row.triage_level}</td>
                      <td>{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 40 }}>
              <a href="/" style={{ color: "#333" }}>Return to Public Site</a>
            </div>
          </>
        )}
      </div>
    );
  }

  // ----------- PUBLIC UI -----------
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: 900 }}>VetTriageAI</h1>
      <form onSubmit={handleSubmit} style={{ margin: "24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          <b>Describe your pet's problem:</b>
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="eg. vomiting, chocolate, snake bite"
            required
            style={{ width: "100%", padding: 8, fontSize: 16, marginTop: 4 }}
          />
        </label>
        <label>
          <b>Species:</b>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
            style={{ width: "100%", padding: 8, fontSize: 16, marginTop: 4 }}
          >
            <option value="">Select species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </label>
        <label>
          <b>Breed (optional):</b>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="e.g. Labrador"
            style={{ width: "100%", padding: 8, fontSize: 16, marginTop: 4 }}
          />
        </label>
        <label>
          <b>Weight (kg, optional):</b>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 22"
            style={{ width: "100%", padding: 8, fontSize: 16, marginTop: 4 }}
          />
        </label>
        <button type="submit" style={{ padding: "12px 0", fontSize: 18, fontWeight: 700 }}>Check Triage</button>
      </form>

      {loading && <p>Checking your pet's symptoms...</p>}

      {result && (
        <div style={{
          marginTop: 32,
          border: "2px solid #4c9",
          background: "#f9fff9",
          padding: 24,
          borderRadius: 16
        }}>
          <h2>Triage Result</h2>
          <p><b>Category:</b> {"category" in result ? result.category : result.toxin}</p>
          {("example_breed" in result || "weight_kg" in result) && (
            <p>
              {result.example_breed && <span><b>Breed:</b> {result.example_breed} </span>}
              {result.weight_kg && <span><b>Weight:</b> {result.weight_kg} kg</span>}
            </p>
          )}
          <p><b>Symptoms:</b> {result.symptoms}</p>
          <p><b>Triage Level:</b>{" "}
            <span style={{
              color:
                result.triage_level === "emergency" ? "red" :
                result.triage_level === "urgent" ? "orange" : "green"
            }}>{result.triage_level}</span>
          </p>
          <p><b>Recommendation:</b> {result.recommendation}</p>
        </div>
      )}

      {result === null && !loading && (
        <div style={{ color: "#999", marginTop: 32 }}>
          <p>No matching case found. Please call your local vet for urgent advice.</p>
        </div>
      )}
    </div>
  );
}
