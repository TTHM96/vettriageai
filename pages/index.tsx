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

// Main form initial state
const initialForm = {
  species: "",
  breed: "",
  age: "",
  gender_and_neuter_status: "",
  symptoms: "",
  time_elapsed: ""
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<null | {
    triage_level: string;
    recommendation: string;
  }>(null);

  // Very simple demo triage function (replace with your data logic/Supabase queries!)
  function triage(form: typeof initialForm) {
    // Emergency keywords: airway/breathing/collapse, etc.
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

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: 16 }}>
      <h1 style={{ fontWeight: "bold", fontSize: 48, marginBottom: 32 }}>
        VetTriageAI
      </h1>

      {step < 7 && (
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
      {step === 7 && result && (
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
    </div>
  );
}
