import React, { useState } from "react";

const ADMIN_SECRET = "MTTH1996"; // Change as needed

// Example data (replace with real data/Supabase fetch)
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

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_SECRET) {
      setIsAuthed(true);
      setPw("");
      setError("");
    } else {
      setError("Incorrect password.");
    }
  }

  function handleLogout() {
    setIsAuthed(false);
    setPw("");
    setError("");
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 24 }}>
      <h1 style={{ fontWeight: "bold", fontSize: 44, marginBottom: 32 }}>
        VetTriageAI Admin
      </h1>
      {!isAuthed ? (
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{ fontSize: 22, padding: 10, width: 330, marginRight: 12 }}
          />
          <button
            type="submit"
            style={{
              fontSize: 22,
              padding: "10px 26px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 7
            }}
          >
            Login
          </button>
          {error && (
            <div style={{ color: "red", marginTop: 12, fontSize: 18 }}>
              {error}
            </div>
          )}
        </form>
      ) : (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 17 }}>
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
            onClick={handleLogout}
            style={{
              marginTop: 32,
              background: "#222",
              color: "#fff",
              fontSize: 19,
              padding: "10px 30px",
              border: "none",
              borderRadius: 7,
              cursor: "pointer"
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
