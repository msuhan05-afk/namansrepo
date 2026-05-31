export const metadata = { title: "Verdana — Digital Oasis" };

export default function TestPage() {
  return (
    <iframe
      src="/verdana.html"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Verdana Digital Oasis"
    />
  );
}
