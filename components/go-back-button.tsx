"use client";

export default function GoBackButton() {
  return (
    <button
      id="not-found-go-back"
      type="button"
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-muted active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Go Previous Page
    </button>
  );
}
