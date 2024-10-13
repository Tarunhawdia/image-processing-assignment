const express = require("express");
const app = express();
const port = 3000;

const { upload, uploadCSV } = require("./controllers/uploadController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (req, res) => {
  res.send("Image Processing System API");
});

// Upload Route
app.post(
  "/upload",
  upload.single("file"),
  (req, res, next) => {
    console.log("Upload route hit");
    next();
  },
  uploadCSV
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
