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

// Service worker – automatické aktualizácie (proti starej cache na mobile).
if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    // nová verzia prevzala kontrolu → načítaj čerstvý obsah
    window.location.reload();
  });
  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        // pri návrate do appky skontroluj, či nie je novšia verzia
        reg.update();
        setInterval(() => reg.update(), 60 * 60 * 1000);
      })
      .catch(() => {
        /* SW nedostupný – appka funguje aj bez neho */
      });
  });
}
