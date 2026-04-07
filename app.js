document.addEventListener("DOMContentLoaded", function () {
  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  if (!listEl || !detailsEl) {
    console.error("Brak elementów DOM");
    return;
  }

  const API_BASE = "https://eds-demo-clean.vercel.app/api";
  let activeItem = null;

  async function loadExposures() {
    try {
      const res = await fetch(API_BASE + "/exposures");
      const data = await res.json();

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
    } catch (err) {
      console.error("Błąd ładowania narażeń", err);
      listEl.innerHTML = "<li>Błąd ładowania danych</li>";
    }
  }

  async function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    activeItem.classList.add("active");

    try {
      const res = await fetch(API_BASE + "/exposures/full?id=" + id);
      const data = await res.json();
      renderDetails(data);
    } catch (err) {
      console.error("Błąd ładowania szczegółów", err);
      detailsEl.innerHTML = "Błąd ładowania danych";
    }
  }

  function renderDetails(data) {
    if (!data || !data.id) {
      detailsEl.innerHTML = "Brak danych";
      return;
    }

    let html = "<h2>" + data.name + "</h2>";
    html += "<p>" + (data.description || "Brak opisu narażenia") + "</p>";

    if (data.category) {
      html += '<span class="tag">Kategoria: ' + data.category + "</span>";
    }

    html += "<h3>Badania</h3>";

    if (!data.examinations || data.examinations.length === 0) {
      html += "<p>Brak przypisanych badań.</p>";
    } else {
      html += "<ul>";
      data.examinations.forEach(function (ex) {
        html += "<li><strong>" + ex.name + "</strong> (" +
          (ex.required ? "wymagane" : "opcjonalne") + ")</li>";
      });
      html += "</ul>";
    }

    detailsEl.innerHTML = html;
  }

  loadExposures();
});
``
