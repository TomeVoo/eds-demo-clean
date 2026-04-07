document.addEventListener("DOMContentLoaded", () => {
  console.log("EDS frontend start");

  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  if (!listEl || !detailsEl) {
    console.error("Brak elementów DOM");
    return;
  }

  let activeItem = null;

  // =========================
  // ŁADOWANIE LISTY NARAŻEŃ
  // =========================
  async function loadExposures() {
    try {
      const res = await fetch("/api/exposures");
      const exposures = await res.json();

      listEl.innerHTML = "";

      exposures.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = exp.name;
        li.style.cursor = "pointer";

        li.onclick = () => selectExposure(exp.id, li);
        listEl.appendChild(li);
      });

      console.log("Załadowano narażenia:", exposures.length);
    } catch (err) {
      console.error("Błąd ładowania narażeń", err);
      listEl.innerHTML = "<li>Błąd ładowania danych</li>";
    }
  }

  // =========================
  // WYBÓR NARAŻENIA
  // =========================
  async function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    activeItem.classList.add("active");

    try {
      const res = await fetch(`/api/exposures/full?id=${id}`);
      const data = await res.json();
      renderDetails(data);
    } catch (err) {
      console.error("Błąd ładowania szczegółów", err);
    }
  }


