import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Configure storage factory function to handle different upload types
const createStorage = (type: 'experiences' | 'products') => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `public/uploads/${type}`;
      fs.ensureDirSync(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename with original extension
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uniqueId}${ext}`);
    }
  });
};

// File filter to only accept image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WebP image files are allowed'));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

export const experienceImageUpload = multer({
  storage: createStorage('experiences'),
  fileFilter,
  limits
});

export const productImageUpload = multer({
  storage: createStorage('products'),
  fileFilter,
  limits
});

// Helper function to remove old image when updating
export const removeImage = async (imageUrl: string) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  
  const imagePath = path.join('public', imageUrl);
  try {
    await fs.remove(imagePath);
    console.log(`Removed old image: ${imagePath}`);
  } catch (error) {
    console.error(`Error removing image: ${imagePath}`, error);
  }
};