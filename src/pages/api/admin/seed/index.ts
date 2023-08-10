import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextApiResponse } from "next";
import nc from "next-connect";
import { IRequest } from "../../../../../common/types/request";
import { syncDb } from "@lib/sync";

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
    try {
        await syncDb();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json(getErrorMessage(err));
    }
});

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
