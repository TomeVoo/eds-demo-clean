document.addEventListener("DOMContentLoaded", function () {
  console.log("APP JS STARTED");

  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");
  const ageInput = document.getElementById("ageInput");

  if (!listEl || !detailsEl || !ageInput) {
    console.error("Brak elementów DOM");
    return;
  }

  const API_BASE = "https://eds-demo-clean.vercel.app/api";
  let activeItem = null;
  let currentAge = null;

  // =========================
  // OBSŁUGA WIEKU
  // =========================
  ageInput.addEventListener("input", function () {
    const val = parseInt(ageInput.value, 10);
    currentAge = isNaN(val) ? null : val;

    if (activeItem && activeItem.dataset.exposureId) {
      selectExposure(activeItem.dataset.exposureId, activeItem);
    }
  });

  // =========================
  // ŁADOWANIE NARAŻEŃ
  // =========================
  function loadExposures() {
    fetch(API_BASE + "/exposures")
      .then(res => res.json())
      .then(data => {
        listEl.innerHTML = "";

        data.forEach(exp => {
          const li = document.createElement("li");
          li.textContent = exp.name;
          li.dataset.exposureId = exp.id;
          li.style.cursor = "pointer";

          li.addEventListener("click", function () {
            selectExposure(exp.id, li);
          });

          listEl.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        listEl.innerHTML = "<li>Błąd ładowania danych</li>";
      });
  }

  // =========================
  // WYBÓR NARAŻENIA
  // =========================
  function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    element.classList.add("active");

    fetch(API_BASE + "/exposures/full?id=" + id)
      .then(res => res.json())
