import { NextApiResponse } from "next";
import nextConnect from "next-connect";

import { IRequest } from "../../../../common/types/request";
import { uploadSingleImage } from "@/middlewares/uploadSingleImage";
import { getImagePath } from "@/utils/getImagePath";

const handler = nextConnect<IRequest, NextApiResponse>();

handler.use(uploadSingleImage("image"));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const imageUrl = getImagePath(req.file.filename);

  res.status(200).json({ message: "File uploaded successfully.", imageUrl });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
