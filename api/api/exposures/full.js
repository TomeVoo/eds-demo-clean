export default function handler(req, res) {
  const { id } = req.query;

  const mock = {
    HALAS: {
      id: "HALAS",
      name: "Hałas",
      tests: ["Audiometria", "Badanie laryngologiczne"]
    },
    DRGANIA: {
      id: "DRGANIA",
      name: "Drgania mechaniczne",
      tests: ["Badanie neurologiczne"]
    },
    PYLY: {
      id: "PYLY",
      name: "Pyły przemysłowe",
      tests: ["Spirometria", "RTG płuc"]
    }
  };

  res.status(200).json(mock[id] || { error: "Not found" });
}
