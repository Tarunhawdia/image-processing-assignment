const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

// Configure Multer for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for CSV files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueSuffix); // Generate unique file name
  },
});

const upload = multer({ storage });

// Helper function to parse CSV
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// Upload CSV API
const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const csvFilePath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    // Step 1: Parse the CSV file
    const csvData = await parseCSV(csvFilePath);

    const requestId = uuidv4(); // Generate unique request ID

    // Step 2: Prepare image URLs for compression
    const imagesToCompress = [];

    csvData.forEach((row) => {
      const imageUrls = row["Input Image Urls"]
        .split(",")
        .map((url) => url.trim());
      imagesToCompress.push(...imageUrls);
    });

    // Step 3: Send image URLs to the image compression service
    const compressionResponse = await axios.post(
      "http://localhost:4000/api/compress",
      {
        images: imagesToCompress,
      }
    );

    // Step 4: Return response with compressed image URLs and request ID
    return res.status(200).json({
      requestId,
      compressedImages: compressionResponse.data.compressedImages,
    });
  } catch (error) {
    console.error("Error processing CSV upload:", error);
    res.status(500).json({ error: "Failed to process CSV" });
  }
};

module.exports = { upload, uploadCSV };
