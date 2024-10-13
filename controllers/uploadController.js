const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Configure Multer for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

const uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const requestId = uuidv4(); // Generate unique request ID
  res.status(200).json({ requestId });
};

module.exports = { upload, uploadCSV };
