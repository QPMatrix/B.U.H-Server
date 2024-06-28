import express from "express";

export const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello Man!");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
