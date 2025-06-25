import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const ADMIN_SECRET = "MTTH1996";

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
  // --- ADMIN ---
  const [adminMode, setAdminMode] = useState(false);
  const [adminCases, setAdminCases] = useState<CaseType[]>([]);
  const [adminIntox, setAdminIntox] = useState<IntoxType[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // --- PUBLIC FORM STATE ---
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 99>(1);
  const [isIntox, setIsIntox] = useState(false);
  const [problem, setProblem] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [elapsed, setElapsed] = useState("");
  const [result, setResult] = useState<CaseType | IntoxType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin backdoor detection
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

  // ---- Step 1: User describes problem ----
  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // Check if the problem matches any toxin in Intoxications
    const { data: matchIntox } = await supabase
      .from("Intoxications")
      .select("*")
      .ilike("toxin", `%${problem}%`);

    if (matchIntox && matchIntox.length > 0) {
      setIsIntox(true);
      setLoading(false);
      setStep(2); // Start step-by-step for intoxication
    } else {
      setIsIntox(false);
      setStep(2); // Go to basic info
      setLoading(false);
    }
  };

  // ---- Step-by-Step Handler for Intox ----
  const handleIntoxStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step < 5) setStep((s) => (s + 1) as typeof step);
    else handleIntoxFinalSubmit();
  };

  // ---- Final Step: Submit for Triage ----
  const handleIntoxFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    // Look for a toxin match (ignores breed/weight for now)
    let { data: toxMatches } = await supabase
      .from("Intoxications")
      .select("*")
      .ilike("toxin", `%${problem}%`)
      .eq("species", species);

    // Fallback to non-species match
    if (!toxMatches || toxMatches.length === 0) {
      ({ data: toxMatches } = await supabase
        .from("Intoxications")
        .select("*")
        .ilike("toxin", `%${problem}%`));
    }

    if (toxMatches && toxMatches.length > 0) {
      // (Optional: add logic to filter further by mg_per_kg if all data available)
      setResult({
        ...toxMatches[0],
        example_breed: breed,
        weight_kg: weight,
        amount_ingested: amount,
        time_since_ingestion: elapsed,
      });
      setLoading(false);
      setStep(99); // Results
    } else {
      setResult(null);
      setError("No matching toxin found in our database.");
      setLoading(false);
      setStep(99);
    }
  };

  // ---- Non-intox (standard case) ----
  const handleCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let { data: cases } = await supabase
      .from("Cases")
      .select("*")
      .or([
        `symptoms.ilike.%${problem}%`,
        `category.ilike.%${problem}%`
      ].join(','))
      .eq("species", species);

    setResult(cases && cases.length > 0 ? cases[0] : null);
    setStep(99);
    setLoading(false);
  };

  // ---- UI RENDERING ----
  if (adminMode) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>VetTriageAI Admin Panel</h1>
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

  // --- Step-by-step logic for public users ---
  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: 900 }}>VetTriageAI</h1>
      {step === 1 && (
        <form onSubmit={handleProblemSubmit} style={{ margin: "24px 0" }}>
          <label style={{ fontWeight: 700, fontSize: 20 }}>
            Describe your pet's problem:
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. chocolate, snail bait, vomiting"
              required
              style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
            />
          </label>
          <button
            type="submit"
            style={{ width: "100%", padding: 16, fontWeight: 700, fontSize: 20, marginTop: 24 }}
            disabled={!problem}
          >Next</button>
        </form>
      )}

      {/* Step-by-step for intoxications */}
      {isIntox && step >= 2 && step < 99 && (
        <form onSubmit={handleIntoxStep} style={{ margin: "24px 0" }}>
          {step === 2 && (
            <label style={{ fontWeight: 700, fontSize: 20 }}>
              Species:
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
                style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </label>
          )}
          {step === 3 && (
            <label style={{ fontWeight: 700, fontSize: 20 }}>
              Breed (optional):
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Labrador"
                style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
              />
            </label>
          )}
          {step === 4 && (
            <label style={{ fontWeight: 700, fontSize: 20 }}>
              Weight (kg):
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 20"
                required
                min={1}
                style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
              />
            </label>
          )}
          {step === 5 && (
            <>
              <label style={{ fontWeight: 700, fontSize: 20 }}>
                Amount ingested (g or ml, estimate ok):
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 60g, half a block"
                  required
                  style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
                />
              </label>
              <label style={{ fontWeight: 700, fontSize: 20, marginTop: 16, display: "block" }}>
                Time since ingestion (minutes or hours):
                <input
                  type="text"
                  value={elapsed}
                  onChange={(e) => setElapsed(e.target.value)}
                  placeholder="e.g. 1 hour, 30 min"
                  required
                  style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
                />
              </label>
            </>
          )}
          <button
            type="submit"
            style={{ width: "100%", padding: 16, fontWeight: 700, fontSize: 20, marginTop: 24 }}
            disabled={
              (step === 2 && !species) ||
              (step === 4 && !weight) ||
              (step === 5 && (!amount || !elapsed))
            }
          >{step === 5 ? "Check Triage" : "Next"}</button>
        </form>
      )}

      {/* Non-intox case info */}
      {!isIntox && step === 2 && (
        <form onSubmit={handleCaseSubmit} style={{ margin: "24px 0" }}>
          <label style={{ fontWeight: 700, fontSize: 20 }}>
            Species:
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
              style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
            >
              <option value="">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </label>
          <label style={{ fontWeight: 700, fontSize: 20, marginTop: 16 }}>
            Breed (optional):
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Labrador"
              style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
            />
          </label>
          <label style={{ fontWeight: 700, fontSize: 20, marginTop: 16 }}>
            Weight (kg, optional):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 20"
              style={{ width: "100%", padding: 12, fontSize: 18, marginTop: 8 }}
            />
          </label>
          <button
            type="submit"
            style={{ width: "100%", padding: 16, fontWeight: 700, fontSize: 20, marginTop: 24 }}
            disabled={!species}
          >Check Triage</button>
        </form>
      )}

      {loading && <p>Checking your pet's symptoms...</p>}

      {(result || error) && step === 99 && (
        <div style={{
          marginTop: 32,
          border: result ? "2px solid #4c9" : "2px solid #f99",
          background: result ? "#f9fff9" : "#fff9f9",
          padding: 24,
          borderRadius: 16
        }}>
          {result ? (
            <>
              <h2>Triage Result</h2>
              <p><b>Category:</b> {"category" in result ? result.category : result.toxin}</p>
              {"example_breed" in result && result.example_breed && <p><b>Breed:</b> {result.example_breed}</p>}
              {"weight_kg" in result && result.weight_kg && <p><b>Weight:</b> {result.weight_kg} kg</p>}
              {"amount_ingested" in result && result.amount_ingested && <p><b>Amount Ingested:</b> {result.amount_ingested}</p>}
              {"time_since_ingestion" in result && (result as any).time_since_ingestion && <p><b>Time Since Ingestion:</b> {(result as any).time_since_ingestion}</p>}
              <p><b>Symptoms:</b> {result.symptoms}</p>
              <p><b>Triage Level:</b>{" "}
                <span style={{
                  color:
                    result.triage_level === "emergency" ? "red" :
                    result.triage_level === "urgent" ? "orange" : "green"
                }}>{result.triage_level}</span>
              </p>
              <p><b>Recommendation:</b> {result.recommendation}</p>
            </>
          ) : (
            <p>{error || "No matching case found. Please call your local vet for urgent advice."}</p>
          )}
        </div>
      )}
    </div>
  );
}
