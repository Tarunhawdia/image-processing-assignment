const express = require("express");
const { compressImages } = require("./controllers/compressController");

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compress Images Route
app.post("/api/compress", compressImages);

app.listen(port, () => {
  console.log(`Compression service running on port ${port}`);
});
