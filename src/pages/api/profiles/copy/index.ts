import { createProfile } from "@/controllers/profile";
import checkAuth from "@/middlewares/checkAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextApiResponse } from "next";
import nc from "next-connect";
import { IRequest } from "../../../../../common/types/request";
import rolesMiddleware from "@/middlewares/checkRolesMiddleware";
import { Roles } from "../../../../../common/enums/roles";

const handler = nc<IRequest, NextApiResponse>();
handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.post(async (req, res) => {
  try {
    console.log(req.body);
    const data = await createProfile(req.body.user_id || "1", req.body);
    return res.status(201).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
