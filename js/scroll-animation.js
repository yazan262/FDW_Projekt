/**
 * Scroll-Animation für Karten
 * - Sobald eine .card im Viewport erscheint,
 *   wird ihr die Klasse "visible" hinzugefügt.
 * - IntersectionObserver sorgt dafür, dass
 *   jede Karte nur einmal animiert wird.
 */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // nach erster Sichtbarkeit nicht weiter beobachten
        }
      });
    },
    { threshold: 0.1 } // Auslösung, wenn mind. 10% sichtbar sind
  );

  cards.forEach((card) => observer.observe(card));
});
