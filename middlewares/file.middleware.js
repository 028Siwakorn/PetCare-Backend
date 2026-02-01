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
  //save location
  const storageRef = ref(firebaseStorage, `uploads/${req.file.originalname}`);

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

module.exports = { upload, uploadToFirebase, handleMulterError };