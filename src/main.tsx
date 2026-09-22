import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Tmavý režim podľa nastavenia systému.
if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
}
window
  .matchMedia?.("(prefers-color-scheme: dark)")
  .addEventListener?.("change", (e) => {
    document.documentElement.classList.toggle("dark", e.matches);
  });

createRoot(document.getElementById("root")!).render(<App />);
