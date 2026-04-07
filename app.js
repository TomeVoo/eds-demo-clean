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

  async function selectExposure(id, el) {
    if (activeItem) activeItem.classList.remove("active");
    activeItem = el;
    el.classList.add("active");

    const res = await fetch(`/api/exposures/full?id=${id}`);
    const data = await res.json();

    let html = `<h2>${data.name}</h2><p>${data.description || ""}</p>`;
    html += `<ul>`;
    data.examinations.forEach(ex => {
      html += `<li><strong>${ex.name}</strong> (${ex.required ? "wymagane" : "opcjonalne"})</li>`;
    });
    html += `</ul>`;
    detailsEl.innerHTML = html;
  }

  loadExposures();
});
