import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory for easy access
const upload = multer({ storage });

export default upload;