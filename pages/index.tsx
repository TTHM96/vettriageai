import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleSearch = async () => {
    setResult('You entered: ' + input)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>VetTriageAI</h1>
      <textarea
        rows={5}
        cols={60}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter pet symptoms..."
      />
      <br />
      <button onClick={handleSearch}>Submit</button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div>
  )
}
