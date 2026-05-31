export const metadata = { title: "Man in Sight — Neural Cortex" };

export default function ManInSightPage() {
  return (
    <iframe
      src="/man-in-sight.html"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Man in Sight — Neural Cortex Mapping"
    />
  );
}
