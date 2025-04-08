const express = require("express");
const { upload, uploadCSV } = require("./controllers/uploadController");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (req, res) => {
  res.send("Image Processing System API");
});

// Upload Route (CSV Upload and Image Compression)
app.post("/upload", upload.single("file"), uploadCSV);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
