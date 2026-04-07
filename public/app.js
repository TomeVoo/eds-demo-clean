document.addEventListener("DOMContentLoaded", () => {
  console.log("APP JS STARTED");

  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  if (!listEl || !detailsEl) {
    console.error("❌ Nie znaleziono elementów DOM");
    return;
  }

  let activeItem = null;

  async function loadExposures() {
    console.log("Loading exposures…");

    try {
      const res = await fetch("/api/exposures");
      const data = await res.json();

      listEl.innerHTML = "";

      data.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = exp.name;
        li.style.cursor = "pointer";

        li.onclick = () => selectExposure(exp.id, li);
        listEl.appendChild(li);
      });

      console.log("✅ Exposures loaded:", data.length);
    } catch (err) {
      console.error("❌ Błąd ładowania exposures", err);
    }
  }

  async function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    activeItem.classList.add("active");

    try {
      const res = await fetch(`/api/exposures/full?id=${id}`);
      const data = await res.json();
      renderDetails(data);
    } catch (err) {
      console.error("❌ Błąd ładowania szczegółów", err);
    }
  }

  function renderDetails(data) {
    if (!data || !data.id) {
      detailsEl.innerHTML = "Brak danych";
      return;
    }

    let html = `
      <h2>${data.name}</h2>
      <p>${data.description || "Brak opisu narażenia."}</p>
    `;

    if (data.category) {
      html += `<span class="tag">Kategoria: ${data.category}</span>`;
    }

    html += `<div class="section exams"><h3>Wymagane badania</h3>`;

    if (!data.examinations || data.examinations.length === 0) {
      html += `<p>Brak zdefiniowanych badań.</p>`;
    } else {
      html += `<ul>`;
      data.examinations.forEach(ex => {
        html += `
          <li style="margin-bottom: 14px;">
            <strong>${ex.name}</strong>
