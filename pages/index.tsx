import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "../utils/supabaseClient";

type CaseType = {
  id: number;
  category?: string;
  species?: string;
  symptoms?: string;
  triage_level?: string;
  recommendation?: string;
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

const PAGE_SIZE = 10;

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <input
      style={{
        marginBottom: 20,
        padding: 8,
        width: 320,
        fontSize: 16,
        borderRadius: 6,
        border: "1px solid #bbb",
      }}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Search..."}
    />
  );
}

export default function Home() {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [intoxications, setIntoxications] = useState<IntoxType[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination and search state
  const [casePage, setCasePage] = useState(1);
  const [intoxPage, setIntoxPage] = useState(1);
  const [caseSearch, setCaseSearch] = useState("");
  const [intoxSearch, setIntoxSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: casesData, error: casesError } = await supabase
        .from("Cases")
        .select("*");
      if (casesError) console.error("Cases error:", casesError);

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

  // Search and pagination filtering
  const filteredCases = cases.filter(
    (c) =>
      !caseSearch ||
      Object.values(c)
        .join(" ")
        .toLowerCase()
        .includes(caseSearch.toLowerCase())
  );
  const paginatedCases = filteredCases.slice(
    (casePage - 1) * PAGE_SIZE,
    casePage * PAGE_SIZE
  );
  const totalCasePages = Math.ceil(filteredCases.length / PAGE_SIZE);

  const filteredIntox = intoxications.filter(
    (i) =>
      !intoxSearch ||
      Object.values(i)
        .join(" ")
        .toLowerCase()
        .includes(intoxSearch.toLowerCase())
  );
  const paginatedIntox = filteredIntox.slice(
    (intoxPage - 1) * PAGE_SIZE,
    intoxPage * PAGE_SIZE
  );
  const totalIntoxPages = Math.ceil(filteredIntox.length / PAGE_SIZE);

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 40, marginBottom: 32 }}>VetTriageAI Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* CASES */}
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: 32 }}>Cases</h2>
            <SearchBar
              value={caseSearch}
              onChange={(e) => {
                setCaseSearch(e.target.value);
                setCasePage(1);
              }}
              placeholder="Search all cases"
            />
            {paginatedCases.length ? (
              <>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 16,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f4f4f4" }}>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Species</th>
                      <th>Symptoms</th>
                      <th>Triage Level</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCases.map((c) => (
                      <tr key={c.id}>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.id}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.category}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.species}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.symptoms}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.triage_level}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{c.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div style={{ marginBottom: 20 }}>
                  <button
                    disabled={casePage === 1}
                    onClick={() => setCasePage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    Page {casePage} / {totalCasePages}
                  </span>
                  <button
                    disabled={casePage === totalCasePages}
                    onClick={() => setCasePage((p) => Math.min(totalCasePages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No cases found.</p>
            )}
          </section>

          {/* INTOXICATIONS */}
          <section>
            <h2 style={{ fontSize: 32 }}>Intoxications</h2>
            <SearchBar
              value={intoxSearch}
              onChange={(e) => {
                setIntoxSearch(e.target.value);
                setIntoxPage(1);
              }}
              placeholder="Search all intoxications"
            />
            {paginatedIntox.length ? (
              <>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 16,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f4f4f4" }}>
                      <th>ID</th>
                      <th>Created</th>
                      <th>Species</th>
                      <th>Breed</th>
                      <th>Weight (kg)</th>
                      <th>Toxin</th>
                      <th>Type</th>
                      <th>Amount Ingested</th>
                      <th>mg/kg</th>
                      <th>Clinical Threshold</th>
                      <th>Symptoms</th>
                      <th>Triage Level</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIntox.map((i) => (
                      <tr key={i.id}>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.id}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.created_at}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.species}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.example_breed}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.weight_kg}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.toxin}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.type}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.amount_ingested}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.mg_per_kg}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.clinical_threshold}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.symptoms}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.triage_level}</td>
                        <td style={{ border: "1px solid #ddd", padding: 8 }}>{i.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div>
                  <button
                    disabled={intoxPage === 1}
                    onClick={() => setIntoxPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    Page {intoxPage} / {totalIntoxPages}
                  </span>
                  <button
                    disabled={intoxPage === totalIntoxPages}
                    onClick={() => setIntoxPage((p) => Math.min(totalIntoxPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No intoxications found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
