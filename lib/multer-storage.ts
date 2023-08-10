import config from "@config";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), config.uploadDir));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = uuidv4();
    console.log(file.originalname);
    cb(null, `${filename}${ext}`);
  },
});
