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

  // reaguj na zmianę wieku
  ageInput.addEventListener("input", function () {
    const val = parseInt(ageInput.value, 10);
    currentAge = isNaN(val) ? null : val;

    // jeżeli coś jest już wybrane – odśwież widok
    if (activeItem && activeItem.dataset.exposureId) {
      selectExposure(activeItem.dataset.exposureId, activeItem);
    }
  });

  // =========================
  // LOAD EXPOSURES
  // =========================
  function loadExposures() {
    fetch(API_BASE + "/exposures")
      .then(r => r.json())
      .then(data => {
        listEl.innerHTML = "";

        data.forEach(exp => {
          const li = document.createElement("li");
          li.textContent = exp.name;
          li.style.cursor = "pointer";
          li.dataset.exposureId = exp.id;

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
  // SELECT EXPOSURE
  // =========================
  function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    element.classList.add("active");

    fetch(API_BASE + "/exposures/full?id=" + id)
      .then(r => r.json())
      .then(data => renderDetails(data))
      .catch(err => {
        console.error(err);
        detailsEl.textContent = "Błąd ładowania danych";
      });
  }

  // =========================
  // RENDER DETAILS + AGE FILTER
  // =========================
  function renderDetails(data) {
    if (!data) {
      detailsEl.textContent = "Brak danych";
      return;
    }

    let html = `<h2>${data.name}</h2>`;
    html += `<p>${data.description || ""}</p>`;

    html += "<h3>Badania</h3>";

    const exams = data.examinations || [];

    if (exams.length === 0) {
      html += "<p>Brak badań</p>";
    } else {
      html += "<ul>";

      exams.forEach(ex => {
        let applicable = true;
        let reason = "";

        if (currentAge !== null) {
          if (ex.min_age !== null && currentAge < ex.min_age) {
            applicable = false;
            reason = `poniżej ${ex.min_age} lat`;
          }
          if (ex.max_age !== null && currentAge > ex.max_age) {
            applicable = false;
            reason = `powyżej ${ex.max_age} lat`;
          }
        }

        if (applicable) {
          html += `<li>
            <strong>${ex.name}</strong> (${ex.required ? "wymagane" : "opcjonalne"})<br>
            ${ex.frequency_years ? `co ${ex.frequency_years} lat<br>` : ""}
            ${ex.rationale ? `<em>${ex.rationale}</em>` : ""}
          </li>`;
        } else {
          html += `<li style="color:#999">
            <strong>${ex.name}</strong> – nie dotyczy (${reason})
          </li>`;
        }
      });

      html += "</ul>";
    }

    detailsEl.innerHTML = html;
  }

  // START
  loadExposures();
});
