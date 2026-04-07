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

  // =========================
  // SZCZEGÓŁY + WARUNKI EDS
  // =========================
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
            <span class="${ex.required ? "required" : "optional"}">
              (${ex.required ? "wymagane" : "opcjonalne"})
            </span>

            <div style="font-size: 13px; color: #555; margin-top: 6px;">
              ${ex.min_age ? `• od <strong>${ex.min_age}</strong> roku życia<br>` : ""}
              ${ex.frequency_years ? `• co <strong>${ex.frequency_years}</strong> rok / lata<br>` : ""}
              ${ex.notes ? `<em>• ${ex.notes}</em>` : ""}
            </div>
          </li>
        `;
      });
      html += `</ul>`;
    }

    html += `</div>`;
    detailsEl.innerHTML = html;
  }

  // START
  loadExposures();
});
``
