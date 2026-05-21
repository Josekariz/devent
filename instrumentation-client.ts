import posthog from "posthog-js";
const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();

if (!projectToken) {
  console.error(
    "PostHog initialization skipped: NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is missing or empty.",
  );
} else {
  posthog.init(projectToken, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
