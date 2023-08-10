import { getProfileByUserId } from "@/controllers/profile";
import checkAuth from "@/middlewares/checkAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextApiResponse } from "next";
import nc from "next-connect";
import { IRequest } from "../../../../common/types/request";

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { isMain } = req.query;
    const { id } = req.token;

    const data = await getProfileByUserId(String(id), isMain === `true`);
    res.json(data);
  } catch (err) {
    res.status(404).json(getErrorMessage(err));
  }
});

export default handler;
