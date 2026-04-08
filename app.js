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
