import React, { useState } from "react";

// Options for dropdowns
const speciesOptions = ["Dog", "Cat"];
const genderOptions = ["FE", "ME", "FN", "MN"];
const timeElapsedOptions = [
  "<30 minutes ago",
  "1-2 hours ago",
  "less than 4 - 6 hours ago",
  "less than 12 hours ago",
  "less than 24 hours ago",
  "more than 24-48 hours ago"
];

const ADMIN_SECRET = "MTTH1996"; // Change as needed

const initialForm = {
  species: "",
  breed: "",
  age: "",
  gender_and_neuter_status: "",
  symptoms: "",
  time_elapsed: ""
};

// DEMO admin data table for editing/viewing cases
const demoCaseData = [
  {
    species: "Dog",
    breed: "Labrador",
    age: "3 years",
    gender_and_neuter_status: "ME",
    symptoms: "vomiting and lethargy",
    time_elapsed: "<30 minutes ago",
    triage_level: "emergency",
    recommendation: "See a vet immediately."
  },
  {
    species: "Cat",
    breed: "DSH",
    age: "7 years",
    gender_and_neuter_status: "FN",
    symptoms: "coughing",
    time_elapsed: "1-2 hours ago",
    triage_level: "stable",
    recommendation: "Monitor at home. If worsens, see a vet."
  }
];

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<null | {
    triage_level: string;
    recommendation: string;
  }>(null);

  // Backdoor admin panel state
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  function triage(form: typeof initialForm) {
    const EMERGENCY_SIGNS = [
      "collapse", "trouble breathing", "difficulty breathing", "unproductive vomiting",
      "cyanotic", "seizure", "no urine", "straining to urinate", "blue gums", "white gums",
      "unresponsive", "bleeding that won't stop", "distended abdomen", "shock"
    ];
    const URGENT_SIGNS = [
      "vomiting", "diarrhea", "lethargy", "not eating", "weakness", "blood in urine", "shaking",
      "pale gums", "tremors"
    ];

    const text = [form.symptoms, form.time_elapsed].join(" ").toLowerCase();

    let triage_level = "stable";
    let recommendation = "Monitor at home. If symptoms worsen, see a vet within the week. Monitor for signs of deterioration including worsening vomiting or diarrhoea, lethargy, collapse, tremoring, shivering and pale mucous membranes.";

    if (EMERGENCY_SIGNS.some((kw) => text.includes(kw))) {
      triage_level = "emergency";
      recommendation = "Your pet may require urgent veterinary care. Go to a veterinary clinic immediately.";
    } else if (URGENT_SIGNS.some((kw) => text.includes(kw))) {
      triage_level = "urgent";
      recommendation = "See a vet within 24-48 hours. Monitor for signs of deterioration including worsening vomiting or diarrhoea, lethargy, collapse, tremoring, shivering and pale mucous membranes.";
    }
    return { triage_level, recommendation };
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 6) {
      setStep(step + 1);
    } else {
      setResult(triage(form));
      setStep(7);
    }
  }

  function handlePrev() {
    if (step > 1) setStep(step - 1);
  }

  function handleRestart() {
    setForm(initialForm);
    setStep(1);
    setResult(null);
  }

  // Admin backdoor handlers
  function handleAdminLogin() {
    setShowAdminLogin(true);
    setAdminError("");
    setAdminPassword("");
  }
  function handleAdminAuth(e: React.FormEvent) {
    e.preventDefault();
    if (adminPassword === ADMIN_SECRET) {
      setAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Incorrect password.");
    }
  }
  function handleAdminLogout() {
    setAdminMode(false);
    setShowAdminLogin(false);
    setAdminPassword("");
    setAdminError("");
  }

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: 16 }}>
      <h1 style={{ fontWeight: "bold", fontSize: 48, marginBottom: 32 }}>
        VetTriageAI
      </h1>

      {/* MAIN USER FLOW */}
      {!adminMode && step < 7 && (
        <form onSubmit={handleNext}>
          {step === 1 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                Species:
              </label>
              <select
                name="species"
                value={form.species}
                onChange={handleInputChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0"
                }}
              >
                <option value="">Select...</option>
                {speciesOptions.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{ fontSize: 22, width: "100%", padding: "8px" }}
                disabled={!form.species}
              >
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                Breed (optional):
              </label>
              <input
                name="breed"
                value={form.breed}
                onChange={handleInputChange}
                placeholder="e.g. Labrador, DSH"
                style={{
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0",
                  padding: 8
                }}
              />
              <button
                type="button"
                style={{ fontSize: 22, marginRight: 16, padding: "8px 24px" }}
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ fontSize: 22, padding: "8px 24px" }}
              >
                Next
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                Age:
              </label>
              <input
                name="age"
                value={form.age}
                onChange={handleInputChange}
                required
                placeholder="e.g. 5 years, 6 months"
                style={{
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0",
                  padding: 8
                }}
              />
              <button
                type="button"
                style={{ fontSize: 22, marginRight: 16, padding: "8px 24px" }}
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ fontSize: 22, padding: "8px 24px" }}
                disabled={!form.age}
              >
                Next
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                Gender & Neuter Status:
              </label>
              <select
                name="gender_and_neuter_status"
                value={form.gender_and_neuter_status}
                onChange={handleInputChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0"
                }}
              >
                <option value="">Select...</option>
                {genderOptions.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                style={{ fontSize: 22, marginRight: 16, padding: "8px 24px" }}
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ fontSize: 22, padding: "8px 24px" }}
                disabled={!form.gender_and_neuter_status}
              >
                Next
              </button>
            </>
          )}
          {step === 5 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                What symptoms or problems is your pet experiencing?
              </label>
              <input
                name="symptoms"
                value={form.symptoms}
                onChange={handleInputChange}
                required
                placeholder="e.g. vomiting, coughing, collapse"
                style={{
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0",
                  padding: 8
                }}
              />
              <button
                type="button"
                style={{ fontSize: 22, marginRight: 16, padding: "8px 24px" }}
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ fontSize: 22, padding: "8px 24px" }}
                disabled={!form.symptoms}
              >
                Next
              </button>
            </>
          )}
          {step === 6 && (
            <>
              <label style={{ fontWeight: "bold", fontSize: 24 }}>
                When did these symptoms start?
              </label>
              <select
                name="time_elapsed"
                value={form.time_elapsed}
                onChange={handleInputChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  fontSize: 22,
                  margin: "18px 0 32px 0"
                }}
              >
                <option value="">Select...</option>
                {timeElapsedOptions.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                style={{ fontSize: 22, marginRight: 16, padding: "8px 24px" }}
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="submit"
                style={{ fontSize: 22, padding: "8px 24px" }}
                disabled={!form.time_elapsed}
              >
                Check Triage
              </button>
            </>
          )}
        </form>
      )}

      {/* Show triage result and summary */}
      {!adminMode && step === 7 && result && (
        <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: 34, fontWeight: "bold", marginBottom: 16 }}>
            Recommendation Summary
          </h2>
          <div style={{ marginBottom: 8 }}>
            <b>Species:</b> {form.species}
          </div>
          {form.breed && (
            <div style={{ marginBottom: 8 }}>
              <b>Breed:</b> {form.breed}
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <b>Age:</b> {form.age}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Gender & Neuter Status:</b> {form.gender_and_neuter_status}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Symptoms:</b> {form.symptoms}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Time Since Onset:</b> {form.time_elapsed}
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Triage Level:</b> {result.triage_level}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Recommendation:</b> {result.recommendation}
          </div>
          <button
            onClick={handleRestart}
            style={{
              background: "#222",
              color: "#fff",
              padding: "12px 32px",
              fontSize: 20,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              marginTop: 12
            }}
          >
            Return Home
          </button>
        </div>
      )}

      {/* ADMIN LOGIN LINK */}
      {!adminMode && (
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={handleAdminLogin}
            style={{
              fontSize: 14,
              background: "#e6e6e6",
              border: "none",
              padding: "7px 20px",
              borderRadius: 5,
              cursor: "pointer",
              color: "#333"
            }}
          >
            Admin Login
          </button>
        </div>
      )}

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && !adminMode && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.22)",
            zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <form
            onSubmit={handleAdminAuth}
            style={{
              background: "#fff", padding: 36, borderRadius: 12,
              boxShadow: "0 2px 24px #888", minWidth: 300
            }}
          >
            <h3 style={{ fontWeight: "bold" }}>Admin Access</h3>
            <input
              type="password"
              value={adminPassword}
              placeholder="Enter admin passcode"
              style={{ width: "100%", fontSize: 18, padding: 10, margin: "20px 0" }}
              onChange={e => setAdminPassword(e.target.value)}
            />
            {adminError && (
              <div style={{ color: "red", marginBottom: 8 }}>{adminError}</div>
            )}
            <div>
              <button
                style={{ padding: "8px 24px", fontSize: 18, marginRight: 8 }}
                type="submit"
              >
                Login
              </button>
              <button
                style={{ padding: "8px 24px", fontSize: 18 }}
                type="button"
                onClick={() => { setShowAdminLogin(false); setAdminPassword(""); setAdminError(""); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADMIN MODE (replace with actual CRUD Supabase table) */}
      {adminMode && (
        <div style={{ marginTop: 36, background: "#f4f4f4", borderRadius: 8, padding: 24 }}>
          <h2 style={{ fontWeight: "bold", marginBottom: 18 }}>
            ADMIN: Review Raw Case Data
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Gender/Status</th>
                <th>Symptoms</th>
                <th>Time Elapsed</th>
                <th>Triage</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {demoCaseData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.species}</td>
                  <td>{row.breed}</td>
                  <td>{row.age}</td>
                  <td>{row.gender_and_neuter_status}</td>
                  <td>{row.symptoms}</td>
                  <td>{row.time_elapsed}</td>
                  <td>{row.triage_level}</td>
                  <td>{row.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleAdminLogout}
            style={{
              marginTop: 24,
              background: "#222", color: "#fff",
              fontSize: 18, padding: "9px 28px",
              border: "none", borderRadius: 7, cursor: "pointer"
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
