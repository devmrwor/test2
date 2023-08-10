import { multerStorage } from "@lib/multer-storage";
import multer from "multer";

export const uploadMultipleImages = (fieldsName: string) => {
  const upload = multer({ storage: multerStorage }).array(fieldsName);
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
