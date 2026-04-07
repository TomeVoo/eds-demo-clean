const listEl = document.getElementById("exposuresList");
const detailsEl = document.getElementById("detailsContent");

let activeItem = null;

async function loadExposures() {
  const res = await fetch("/api/exposures");
  const data = await res.json();

  listEl.innerHTML = "";

  data.forEach(exp => {
    const li = document.createElement("li");
    li.textContent = `${exp.name}`;
    li.onclick = () => selectExposure(exp.id, li);

    listEl.appendChild(li);
  });
}

async function selectExposure(id, element) {
  if (activeItem) activeItem.classList.remove("active");
  activeItem = element;
  activeItem.classList.add("active");

  const res = await fetch(`/api/exposures/full?id=${id}`);
  const data = await res.json();

  renderDetails(data);
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
    html += `<p>Brak przypisanych badań.</p>`;
  } else {
    html += `<ul>`;
    data.examinations.forEach(ex => {
      html += `
        <li>
          ${ex.name}
          <span class="${ex.required ? "required" : "optional"}">
            (${ex.required ? "wymagane" : "opcjonalne"})
          </span>
        </li>
      `;
    });
    html += `</ul>`;
  }

  html += `</div>`;
  detailsEl.innerHTML = html;
}

loadExposures();
