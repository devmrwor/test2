import {
  addMessengersToProfile,
  toggleProfileMessenger,
} from "@/controllers/profile";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextApiResponse } from "next";
import { CustomerTypes } from "../../../../../common/enums/customer-type";
import { IRequest } from "../../../../../common/types/request";
import nc from "next-connect";
import { ProfileLanguages } from "../../../../../common/enums/profile-languages";

const handler = nc<IRequest, NextApiResponse>();

handler.patch(async (req, res) => {
  try {
    const { id, messengerId, nickname } = req.query;
    if (!id) throw new Error("id is required");
    if (!messengerId) throw new Error("messengerId is required");

    const data = await toggleProfileMessenger(
      parseInt(id as string),
      parseInt(messengerId as string),
      nickname as string
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(getErrorMessage(err));
  }
});

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("id is required");
    const data = req.body;
    console.log(data);

    const messengers = await addMessengersToProfile(parseInt(id as string), data);
    res.json(messengers);
  } catch (err) {
    console.log(err);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
