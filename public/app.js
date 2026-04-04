
async function loadExposure() {
  const id=document.getElementById('input').value;
  const res = await fetch(`/api/exposures/full?id=${id}`);
  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data,null,2);
}
