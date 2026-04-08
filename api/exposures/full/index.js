export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  res.status(200).json({
    id,
    name: "TEST " + id,
    description: "Testowe dane szczegółowe",
    category: "physical",
    examinations: [
      {
        name: "Badanie testowe",
        required: true,
        frequency_years: 1
      }
    ]
  });
}
