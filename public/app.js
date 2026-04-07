const exposuresList = document.getElementById("exposures");
const detailsDiv = document.getElementById("details");

async function loadExposures() {
  const res = await fetch("/api/exposures");
  const data = await res.json();

  exposuresList.innerHTML = "";

  data.forEach(exp => {
    const li = document.createElement("li");
    li.textContent = `${exp.id} – ${exp.name}`;
    li.style.cursor = "pointer";

    li.onclick = () => loadExposureDetails(exp.id);

    exposuresList.appendChild(li);
  });
}

async function loadExposureDetails(id) {
  const res = await fetch(`/api/exposures/full?id=${id}`);
  const data = await res.json();

  let html = `
    <h3>${data.name} (${data.id})</h3>
    <p>${data.description || "<em>Brak opisu</em>"}</p>
    <h4>Badania</h4>
  `;

  if (!data.examinations || data.examinations.length === 0) {
    html += "<em>Brak badań</em>";
  } else {
    html += "<ul>";
    data.examinations.forEach(ex => {
      html += `<li>${ex.code} – ${ex.name} (${ex.required ? "wymagane" : "opcjonalne"})</li>`;
    });
    html += "</ul>";
  }

  detailsDiv.innerHTML = html;
}

loadExposures();
