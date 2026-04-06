async function loadExposures() {
  const res = await fetch("/api/exposures");
  const data = await res.json();

  const select = document.getElementById("exposureSelect");
  select.innerHTML = "";

  data.forEach(x => {
    const opt = document.createElement("option");
    opt.value = x.id;
    opt.textContent = `${x.id} — ${x.name}`;
    select.appendChild(opt);
  });
}

async function loadExposure() {
  const id = document.getElementById("exposureSelect").value;
  const res = await fetch(`/api/exposures/full?id=${id}`);
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

// Load list on start
loadExposures();
