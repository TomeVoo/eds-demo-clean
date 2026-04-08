
console.log("APP.JS STARTED");

document.addEventListener("DOMContentLoaded", function () {
  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  if (!listEl || !detailsEl) {
    console.error("Brak elementów DOM");
    return;
  }

  // ✅ API na Vercelu
  const API_BASE = "https://eds-demo-clean.vercel.app/api";

  let activeItem = null;

  // =========================
  // ŁADOWANIE LISTY NARAŻEŃ
  // =========================
  function loadExposures() {
    fetch(API_BASE + "/exposures")
      .then(function (res) {
        if (!res.ok) throw new Error("Błąd API /exposures");
        return res.json();
      })
      .then(function (data) {
        listEl.innerHTML = "";

        data.forEach(function (exp) {
          const li = document.createElement("li");
          li.textContent = exp.name;
          li.style.cursor = "pointer";

          li.addEventListener("click", function () {
            selectExposure(exp.id, li);
          });

          listEl.appendChild(li);
        });
      })
      .catch(function (err) {
        console.error("Błąd ładowania narażeń", err);
        listEl.innerHTML = "<li>Błąd ładowania danych</li>";
      });
  }

  // =========================
