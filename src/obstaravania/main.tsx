import { createRoot } from "react-dom/client";
import App from "./App";
import "../index.css";
import "./theme.css";

// Tmavý režim podľa nastavenia systému.
const dark = window.matchMedia?.("(prefers-color-scheme: dark)");
document.documentElement.classList.toggle("dark", !!dark?.matches);
dark?.addEventListener?.("change", (e) => document.documentElement.classList.toggle("dark", e.matches));

createRoot(document.getElementById("root")!).render(<App />);
