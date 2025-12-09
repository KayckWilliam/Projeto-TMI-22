import express from "express";
const app = express();

app.use(express.static("public")); 

app.get("/api/criancas", (req, res) => {
  res.json([
    { id: 1, nome: "Maria", data_nascimento: "2015-03-12" }
  ]);
});

app.listen(3000, () =>
  console.log("Rodando em http://localhost:3000")
);
