export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "40px" }}>
      <h1>Next.js Backend</h1>
      <p>API is running. Try:</p>
      <ul>
        <li>/api/health</li>
        <li>/api/items</li>
      </ul>
    </main>
  );
}
