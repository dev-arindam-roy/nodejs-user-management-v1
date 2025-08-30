const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // ensure nested dirs if needed
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // prevent spaces in filename
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(safeName)
    );
  },
});

// multer instance with basic file filter (optional, restrict image types)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// wrap multer in a Promise so we can call it inside service
const singleFileUpload = (fieldName) => {
  return (req) =>
    new Promise((resolve, reject) => {
      upload.single(fieldName)(req, null, (err) => {
        if (err) return reject(err);
        if (!req.file) return reject(new Error("No file uploaded"));
        resolve(req.file);
      });
    });
};

module.exports = { singleFileUpload };
