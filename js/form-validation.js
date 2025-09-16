/**
 * Formularvalidierung (Client-seitig)
 * - Live-Validierung bei Eingabe/Blur für bessere UX
 * - Fehlermeldungen als neue DOM-Elemente direkt am Feld
 * - Globale Zusammenfassung mit ARIA-Unterstützung
 */
(() => {
  const formEl = document.getElementById("exp-form");
  if (!formEl) return;

  const globalBox = document.getElementById("form-feedback");

  // Validierungsregeln pro Feld
  const rules = {
    name: (v) => (v.trim() ? "" : "Name darf nicht leer sein."),
    email: (v) => {
      if (!v.trim()) return "E-Mail darf nicht leer sein.";
      // bewusst einfache E-Mail-Prüfung (robust für gängige Fälle)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ""
        : "Bitte eine gültige E-Mail angeben.";
    },
    // Beispiel für weitere Felder:
    // studiengang: (v) => (v ? "" : "Bitte Studiengang wählen."),
  };

  // Hilfsfunktion: Meldung für ein Feld setzen/aktualisieren
  function setFieldMsg(inputEl, msg, type = "error") {
    let hint = inputEl.nextElementSibling;
    if (!hint || !hint.classList.contains("form-msg")) {
      hint = document.createElement("p");
      hint.className = "form-msg";
      inputEl.insertAdjacentElement("afterend", hint);
    }

    hint.textContent = msg || "";
    hint.classList.toggle("form-msg--error", !!msg && type === "error");
    hint.classList.toggle("form-msg--ok", !!msg && type === "ok");

    inputEl.classList.toggle("is-invalid", !!msg && type === "error");
    // "valid" nur setzen, wenn keine Fehlermeldung vorliegt
    inputEl.classList.toggle("is-valid", !msg && type === "error");
  }

  // Ein einzelnes Feld prüfen
  function validateField(name) {
    const el = formEl.elements[name];
    if (!el) return true;
    const rule = rules[name];
    const error = rule ? rule(el.value || "") : "";
    setFieldMsg(el, error, "error");
    return !error;
  }

  // Live-Validierung
  formEl.addEventListener("input", (e) => {
    const t = e.target;
    if (t && t.name in rules) validateField(t.name);
  });

  // Auch bei Fokusverlust prüfen
  formEl.addEventListener(
    "blur",
    (e) => {
      const t = e.target;
      if (t && t.name in rules) validateField(t.name);
    },
    true
  );

  // Absenden
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const fieldNames = Object.keys(rules);
    const results = fieldNames.map(validateField);
    const allOk = results.every(Boolean);

    if (globalBox) globalBox.classList.remove("visually-hidden");

    if (!allOk) {
      // Fehler: globale Meldung + Fokus aufs erste fehlerhafte Feld
      if (globalBox) {
        globalBox.setAttribute("role", "alert");
        globalBox.textContent = "Bitte korrigiere die markierten Eingaben.";
      }
      const firstInvalid = fieldNames.find((n) => {
        const el = formEl.elements[n];
        return el && el.classList.contains("is-invalid");
      });
      if (firstInvalid) formEl.elements[firstInvalid].focus();
      return;
    }

    // Erfolg: positive Rückmeldung ohne Alarmton
    if (globalBox) {
      globalBox.setAttribute("role", "status");
      globalBox.textContent = "Danke! Deine Erfahrungen wurden gesendet.";
      globalBox.classList.add("form-msg", "form-msg--ok");
    }

    // Felder als gültig markieren und kurze OK-Hinweise setzen
    fieldNames.forEach((name) => {
      const el = formEl.elements[name];
      if (!el) return;
      el.classList.remove("is-invalid");
      el.classList.add("is-valid");
      setFieldMsg(el, "✓ OK", "ok");
    });

    // Optional: Formular zurücksetzen
    // formEl.reset();
  });
})();
