import { multerStorage } from "@lib/multer-storage";
import multer from "multer";

export const uploadImagesFields = (fields: multer.Field[]) => {
  const upload = multer({ storage: multerStorage }).fields(fields);
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
