import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'campus-marketplace',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
});

export default router;
