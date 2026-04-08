document.addEventListener("DOMContentLoaded", function () {
  console.log("APP JS STARTED");

  var listEl = document.getElementById("exposuresList");

  if (!listEl) {
    console.error("Brak elementu #exposuresList");
    return;
  }

  fetch("https://eds-demo-clean.vercel.app/api/exposures")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      listEl.innerHTML = "";

      data.forEach(function (exp) {
        var li = document.createElement("li");
        li.textContent = exp.name;
        listEl.appendChild(li);
      });
    })
    .catch(function (err) {
      console.error("Błąd fetch exposures:", err);
      listEl.innerHTML = "<li>Błąd ładowania danych</li>";
    });
});
