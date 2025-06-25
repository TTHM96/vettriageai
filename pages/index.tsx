import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const PAGE_SIZE = 10;

function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      style={{
        padding: "8px",
        margin: "8px 0 20px 0",
        borderRadius: "6px",
        border: "1px solid #bbb",
        width: "350px",
        fontSize: "16px"
      }}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Pagination({ page, totalPages, setPage }) {
  return (
    <div style={{ margin: "18px 0" }}>
      <button
        style={{
          marginRight: "12px",
          padding: "6px 16px",
          borderRadius: "4px",
          border: "1px solid #bbb",
          background: page === 1 ? "#eee" : "#fff",
          cursor: page === 1 ? "not-allowed" : "pointer"
        }}
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span style={{ fontWeight: "bold" }}>
        Page {page} of {totalPages}
      </span>
      <button
        style={{
          marginLeft: "12px",
          padding: "6px 16px",
          borderRadius: "4px",
          border: "1px solid #bbb",
          background: page === totalPages ? "#eee" : "#fff",
          cursor: page === totalPages ? "not-allowed" : "pointer"
        }}
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

function FancyTable({ data, columns }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fafbfc",
          marginTop: 10
        }}
      >
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  borderBottom: "2px solid #ccc",
                  padding: "12px 8px",
                  background: "#f2f2f2",
                  textAlign: "left"
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: "10px 8px", borderBottom: "1px solid #eee", fontSize: "15px" }}>
                    {row[col.key] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  // State for Cases
  const [cases, setCases] = useState<any[]>([]);
  const [casesSearch, setCasesSearch] = useState("");
  const [casesPage, setCasesPage] = useState(1);

  // State for Intoxications
  const [intox, setIntox] = useState<any[]>([]);
  const [intoxSearch, setIntoxSearch] = useState("");
  const [intoxPage, setIntoxPage] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from("Cases").select("*"),
      supabase.from("Intoxications").select("*")
    ]).then(([casesRes, intoxRes]) => {
      setCases(casesRes.data || []);
      setIntox(intoxRes.data || []);
      setLoading(false);
    });
  }, []);

  // SEARCH + PAGINATION logic for Cases
  const filteredCases = cases.filter(item =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(casesSearch.toLowerCase())
  );
  const casesTotalPages = Math.ceil(filteredCases.length / PAGE_SIZE);
  const displayedCases = filteredCases.slice((casesPage - 1) * PAGE_SIZE, casesPage * PAGE_SIZE);

  // SEARCH + PAGINATION logic for Intoxications
  const filteredIntox = intox.filter(item =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(intoxSearch.toLowerCase())
  );
  const intoxTotalPages = Math.ceil(filteredIntox.length / PAGE_SIZE);
  const displayedIntox = filteredIntox.slice((intoxPage - 1) * PAGE_SIZE, intoxPage * PAGE_SIZE);

  return (
    <div style={{ padding: 32, fontFamily: "Segoe UI, sans-serif", background: "#fff" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>VetTriageAI Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* CASES */}
          <h2 style={{ marginTop: 34 }}>Cases</h2>
          <SearchBar value={casesSearch} onChange={v => { setCasesSearch(v); setCasesPage(1); }} placeholder="Search cases..." />
          <FancyTable
            data={displayedCases}
            columns={[
              { key: "id", label: "ID" },
              { key: "created_at", label: "Created At" },
              { key: "category", label: "Category" },
              { key: "species", label: "Species" },
              { key: "symptoms", label: "Symptoms" },
              { key: "triage_level", label: "Triage Level" },
              { key: "recommendation", label: "Recommendation" }
            ]}
          />
          <Pagination page={casesPage} totalPages={casesTotalPages || 1} setPage={setCasesPage} />

          {/* INTOXICATIONS */}
          <h2 style={{ marginTop: 48 }}>Intoxications</h2>
          <SearchBar value={intoxSearch} onChange={v => { setIntoxSearch(v); setIntoxPage(1); }} placeholder="Search intoxications..." />
          <FancyTable
            data={displayedIntox}
            columns={[
              { key: "id", label: "ID" },
              { key: "created_at", label: "Created At" },
              { key: "name", label: "Name" },
              { key: "species", label: "Species" },
              { key: "toxin", label: "Toxin" },
              { key: "symptoms", label: "Symptoms" },
              { key: "treatment", label: "Treatment" },
              { key: "prognosis", label: "Prognosis" }
            ]}
          />
          <Pagination page={intoxPage} totalPages={intoxTotalPages || 1} setPage={setIntoxPage} />
        </>
      )}
    </div>
  );
}
