export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    return res.status(200).json([
      { id: "HALAS", name: "Hałas testowy", description: "TEST OK" },
      { id: "PYLY", name: "Pyły testowe", description: "TEST OK" }
    ]);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
