export const metadata = { title: "Test 3" };

export default function Test3Page() {
  return (
    <iframe
      src="/test3.html"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Test 3"
    />
  );
}
