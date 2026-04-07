document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("exposuresList");
  const detailsEl = document.getElementById("detailsContent");

  let activeItem = null;

  async function loadExposures() {
    const res = await fetch("/api/exposures");
    const data = await res.json();

    listEl.innerHTML = "";

    data.forEach(exp => {
      const li = document.createElement("li");
      li.textContent = exp.name;

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
    let html = `
      <h2>${data.name}</h2>
      <p>${data.description || "Brak opisu."}</p>
    `;

    if (data.category) {
      html += `<span class="tag">Kategoria: ${data.category}</span>`;
    }

    html += `<div class="section"><h3>Badania</h3><ul>`;

    data.examinations.forEach(ex => {
      html += `
        <li>
          <strong>${ex.name}</strong>
          (${ex.required ? "wymagane" : "opcjonalne"})<br>
          ${ex.frequency_years ? "Co " + ex.frequency_years + " lat<br>" : ""}
          ${ex.notes || ""}
        </li>`;
    });

    html += `</ul></div>`;
    detailsEl.innerHTML = html;
  }

  loadExposures();
});
