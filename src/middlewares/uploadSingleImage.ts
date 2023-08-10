import { multerStorage } from "@lib/multer-storage";
import multer from "multer";

export const uploadSingleImage = (fieldName: string) => {
  const upload = multer({ storage: multerStorage }).single(fieldName);
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ message: "Error uploading file." });
      }
      next();
    });
  };
};
