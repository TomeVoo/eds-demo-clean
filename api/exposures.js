export default function handler(req, res) {
  res.status(200).json([
    { id: "HALAS", name: "Hałas" },
    { id: "DRGANIA", name: "Drgania mechaniczne" },
    { id: "PYLY", name: "Pyły przemysłowe" }
  ]);
}
