const listEl = document.getElementById("exposuresList");
const detailsEl = document.getElementById("detailsContent");

let activeItem = null;

/**
 * Pobiera listę narażeń i buduje lewą listę
 */
async function loadExposures() {
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
}

/**
 * Obsługa kliknięcia w narażenie
 */
async function selectExposure(id, element) {
  if (activeItem) activeItem.classList.remove("active");
  activeItem = element;
  activeItem.classList.add("active");

  const res = await fetch(`/api/exposures/full?id=${id}`);
  const data = await res.json();

  renderDetails(data);
}

/**
 * Renderuje szczegóły narażenia + WARUNKI EDS
 */
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

  html += `
    <div class="section exams">
      <h3>Wymagane badania</h3>
  `;

  if (!data.examinations || data.examinations.length === 0) {
    html += `<p>Brak zdefiniowanych badań dla tego narażenia.</p>`;
  } else {
    html += `<ul>`;

    data.examinations.forEach(ex => {
      html += `
        <li style="margin-bottom: 14px;">
          <strong>${ex.name}</strong>
          <span class="${ex.required ? "required" : "optional"}">
            (${ex.required ? "wymagane" : "opcjonalne"})
          </span>

