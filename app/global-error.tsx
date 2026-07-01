"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    error?.message && error.message !== "[object Event]"
      ? error.message
      : "Something went wrong. Please refresh the page.";

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui", padding: "2rem", background: "#f5f2f3" }}>
        <h1 style={{ fontSize: "1.25rem" }}>Something went wrong</h1>
        <p style={{ color: "#5f6876", marginTop: "0.5rem" }}>{message}</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "9999px",
            border: "2px solid #e85d6f",
            background: "#fce4e8",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
