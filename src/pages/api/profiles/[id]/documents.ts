import nc from "next-connect";
import { IRequest } from "../../../../../common/types/request";
import { NextApiResponse } from "next";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { updateProfileDocument } from "@/controllers/profile";
import checkAuth from "@/middlewares/checkAuth";

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.put(async (req, res) => {
  try {
    const { id: profileId } = req.query;

    if (!profileId) throw new Error("No profile id provided");

    const { id: userId, role } = req.token;

    const updatedProfile = await updateProfileDocument(
      profileId as string,
      userId,
      role,
      req.body
    );
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
