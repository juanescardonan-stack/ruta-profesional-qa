(() => {
  "use strict";

  const STORAGE_KEY = "ruta-profesional-qa-theme-v1";
  const THEME_COLOR = { light: "#143A61", dark: "#0b1e33" };
  const root = document.documentElement;
  const toggle = document.querySelector("#theme-toggle");
  const meta = document.querySelector('meta[name="theme-color"]');
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function systemTheme() {
    return systemDark.matches ? "dark" : "light";
  }

  function currentTheme() {
    const applied = root.getAttribute("data-theme");
    return applied === "dark" || applied === "light" ? applied : savedTheme() || systemTheme();
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) toggle.setAttribute("aria-checked", String(theme === "dark"));
    if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
  }

  function chooseTheme(theme) {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Sin almacenamiento: el tema se mantiene solo durante esta sesión. */
    }
  }

  // Sincroniza el estado del interruptor con el tema aplicado por el script inline del <head>.
  applyTheme(currentTheme());

  toggle?.addEventListener("click", () => {
    chooseTheme(currentTheme() === "dark" ? "light" : "dark");
  });

  // Si el usuario no eligió explícitamente, sigue los cambios del sistema operativo.
  systemDark.addEventListener("change", () => {
    if (!savedTheme()) applyTheme(systemTheme());
  });

  // Mantiene varias pestañas en sincronía (mismo patrón que el progreso en app.js).
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    applyTheme(savedTheme() || systemTheme());
  });
})();
