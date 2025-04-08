const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Compress Image Function
const compressImage = async (inputImagePath, outputImagePath) => {
  try {
    await sharp(inputImagePath)
      .resize(500) // Resize to width 500px while keeping aspect ratio
      .jpeg({ quality: 50 }) // Compress the image to 50% quality
      .toFile(outputImagePath);
    return outputImagePath;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

// Compress Images API
const compressImages = async (req, res) => {
  const { images } = req.body;

  if (!images || images.length === 0) {
    return res
      .status(400)
      .json({ error: "No images provided for compression" });
  }

  const compressedImages = [];

  try {
    for (let imageUrl of images) {
      const imageName = path.basename(imageUrl);
      const outputImagePath = path.join(__dirname, "../compressed", imageName);

      // Simulate image download (you can use axios to download images)
      const downloadedImagePath = path.join(
        __dirname,
        "../downloads",
        imageName
      );
      fs.copyFileSync(downloadedImagePath, outputImagePath); // Mock downloading

      // Compress the image
      await compressImage(outputImagePath, outputImagePath);

      compressedImages.push(outputImagePath);
    }

    // Return the compressed image paths
    return res.status(200).json({ compressedImages });
  } catch (error) {
    console.error("Error compressing images:", error);
    res.status(500).json({ error: "Failed to compress images" });
  }
};

module.exports = { compressImages };
