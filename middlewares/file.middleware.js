const multer = require("multer");
const path = require("path");
const firebaseConfig = require("../config/firebase.config");

const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

const { initializeApp } = require("firebase/app");
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

//set storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, //1 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("cover");

// อัปโหลดรูปสัตว์เลี้ยง (field name = "image") - รูปไม่บังคับ
const uploadPetImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // 1 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size too large. Max 1MB" });
    }
    if (err.code === "UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ message: "File field name should be 'cover'" });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

const handlePetMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "ขนาดไฟล์ใหญ่เกิน 1MB" });
    }
    if (err.code === "UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Field name สำหรับรูปควรเป็น 'image'" });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Image Only (jpeg, jpg, png, gif, webp)!!"));
  }
}

//upload to firebase storage
async function uploadToFirebase(req, res, next) {
  if (!req.file) {
    next();
    return;
  }
  // save location (ใส่ timestamp ป้องกันชื่อซ้ำ)
  const uniqueName = `${Date.now()}-${path.basename(req.file.originalname)}`;
  const storageRef = ref(firebaseStorage, `uploads/${uniqueName}`);

  const metadata = {
    contentType: req.file.mimetype,
  };
  try {
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //get url from firebase
    req.file.firebaseURL = await getDownloadURL(snapshot.ref);
    next();
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "something went wrong while uploading to firebase!",
    });
  }
}

module.exports = {
  upload,
  uploadPetImage,
  uploadToFirebase,
  handleMulterError,
  handlePetMulterError,
};