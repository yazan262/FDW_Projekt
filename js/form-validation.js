(() => {
  const form = document.getElementById("exp-form");
  if (!form) return;

  const globalBox = document.getElementById("form-feedback");

  // Feldregeln zentral definieren
  const rules = {
    name: (v) => (v.trim() ? "" : "Name darf nicht leer sein."),
    email: (v) => {
      if (!v.trim()) return "E-Mail darf nicht leer sein.";
      // einfache, robuste E-Mail-Prüfung
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ""
        : "Bitte eine gültige E-Mail angeben.";
    },
    // optional: weitere Felder validieren
    // studiengang: (v) => v ? '' : 'Bitte Studiengang wählen.',
  };

  // Helfer: Feldmeldung setzen/entfernen
  function setFieldMsg(inputEl, msg, type = "error") {
    // Existiert bereits eine Meldung direkt nach dem Element?
    let hint = inputEl.nextElementSibling;
    if (!hint || !hint.classList.contains("form-msg")) {
      hint = document.createElement("p");
      hint.className = "form-msg";
      inputEl.insertAdjacentElement("afterend", hint);
    }
    hint.textContent = msg || "";

    // Klassen pflegen
    hint.classList.toggle("form-msg--error", !!msg && type === "error");
    hint.classList.toggle("form-msg--ok", !!msg && type === "ok");

    inputEl.classList.toggle("is-invalid", !!msg && type === "error");
    inputEl.classList.toggle("is-valid", !msg && type === "error"); // valid wenn kein Fehler
  }

  // Einzelnes Feld prüfen
  function validateField(name) {
    const el = form.elements[name];
    if (!el) return true;
    const val = el.value || "";
    const rule = rules[name];
    const error = rule ? rule(val) : "";
    setFieldMsg(el, error, "error");
    return !error;
  }

  // Live-Validierung bei Eingabe/Blur (besseres UX)
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t.name in rules) validateField(t.name);
  });
  form.addEventListener(
    "blur",
    (e) => {
      const t = e.target;
      if (t.name in rules) validateField(t.name);
    },
    true
  );

  // Submit-Handling
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // alle relevanten Felder prüfen
    const fields = Object.keys(rules);
    const results = fields.map(validateField);
    const ok = results.every(Boolean);

    // globale Meldungsbox anzeigen
    if (globalBox) globalBox.classList.remove("visually-hidden");

    if (!ok) {
      // Fehlerfall
      if (globalBox) {
        globalBox.setAttribute("role", "alert");
        globalBox.textContent = "Bitte korrigiere die markierten Eingaben.";
      }
      // Fokus auf erstes fehlerhaftes Feld setzen
      const firstInvalid = fields.find((n) => {
        const el = form.elements[n];
        return el && el.classList.contains("is-invalid");
      });
      if (firstInvalid) form.elements[firstInvalid].focus();
      return;
    }

    // Erfolgfall
    // (hier könntest du fetch() verwenden; für die Aufgabe reicht Feedback im DOM)
    if (globalBox) {
      globalBox.removeAttribute("role"); // kein alert-Ton bei Erfolg
      globalBox.textContent = "Danke! Deine Erfahrungen wurden gesendet.";
      globalBox.classList.add("form-msg", "form-msg--ok");
    }

    // Felder optisch als valid markieren
    Object.keys(rules).forEach((name) => {
      const el = form.elements[name];
      if (el) {
        el.classList.remove("is-invalid");
        el.classList.add("is-valid");
        // Feldnahe Erfolgsmeldung optional:
        setFieldMsg(el, "✓ OK", "ok");
      }
    });

    // Optional: Formular zurücksetzen (wenn gewünscht)
    // form.reset();
  });
})();
