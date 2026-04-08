document.addEventListener("DOMContentLoaded", function () {
  console.log("APP JS STARTED");

  var listEl = document.getElementById("exposuresList");
  var detailsEl = document.getElementById("detailsContent");

  if (!listEl || !detailsEl) {
    console.error("Brak elementów DOM");
    return;
  }

  var API_BASE = "https://eds-demo-clean.vercel.app/api";
  var activeItem = null;

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
          var li = document.createElement("li");
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
  // WYBÓR NARAŻENIA
  // =========================
  function selectExposure(id, element) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = element;
    activeItem.classList.add("active");

    fetch(API_BASE + "/exposures/full?id=" + id)
      .then(function (res) {
        if (!res.ok) throw new Error("Błąd API /exposures/full");
        return res.json();
      })
      .then(function (data) {
        renderDetails(data);
      })
      .catch(function (err) {
        console.error("Błąd ładowania szczegółów", err);
        detailsEl.textContent = "Błąd ładowania danych";
      });
  }

  // =========================
  // RENDER SZCZEGÓŁÓW + WARUNKI
  // =========================
  function renderDetails(data) {
    if (!data) {
      detailsEl.textContent = "Brak danych";
      return;
    }

    var html = "<h2>" + data.name + "</h2>";
    html += "<p>" + (data.description || "") + "</p>";

    html += "<h3>Badania</h3>";

    if (!data.examinations || data.examinations.length === 0) {
      html += "<p>Brak badań</p>";
    } else {
      html += "<ul>";
      data.examinations.forEach(function (ex) {
        html += "<li><strong>" + ex.name + "</strong></li>";
      });
      html += "</ul>";
    }

    detailsEl.innerHTML = html;
  }

  // =========================
  // START
  // =========================
  loadExposures();
});
