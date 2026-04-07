document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  let activeItem = null;

  // =========================
  // API BASE (Vercel)
  // =========================
  const API_BASE = "https://eds-demo-clean.vercel.app/api";

  // =========================
  // LOAD EXPOSURES LIST
  // =========================
  async function loadExposures() {
    try {
      const res = await fetch(`${API_BASE}/exposures`);
      const data = await res.json();

      listEl.innerHTML = "";

      data.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = exp.name;
        li.style.cursor = "pointer";

        li.onclick = () => selectExposure(exp.id, li);

        listEl.appendChild(li);
      });
    } catch (err) {
      console.error("Błąd pobierania narażeń", err);
      listEl.innerHTML = "<li>Błąd ładowania danych</li>";
    }
  }

  // =========================
  // SELECT EXPOSURE
  // =========================
  async function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    activeItem.classList.add("active");

    try {
      const res = await fetch(`${API_BASE}/exposures/full?id=${id}`);
      const data = await res.json();
      renderDetails(data);
    } catch (err) {
      console.error("Błąd pobierania szczegółów", err);
      detailsEl.innerHTML = "Błąd ładowania danych";
    }
  }

  // =========================
  // RENDER DETAILS (EDS)
