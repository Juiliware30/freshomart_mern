import multer from "multer";

// Use memory storage instead of disk storage for Vercel compatibility
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
