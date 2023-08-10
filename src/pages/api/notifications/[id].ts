import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import rolesMiddleware from "@/middlewares/checkRolesMiddleware";
import checkAuth from "@/middlewares/checkAuth";
import { Roles } from "../../../../common/enums/roles";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  deleteNotifications,
  getNotificationById,
  updateNotifications,
} from "@/controllers/notification";
import { INotification } from "../../../../common/types/notification";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.delete(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Id is required.");
    const message = await deleteNotifications(id as string);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, "Internal server error."));
  }
});

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Id is required.");
    const notification = await updateNotifications(id as string, req.body as INotification);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json(getErrorMessage(error, "Internal server error."));
  }
});

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Id is required.");
    const notification = await getNotificationById(id as string);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json(getErrorMessage(error, "Internal server error."));
  }
});

export default handler;
