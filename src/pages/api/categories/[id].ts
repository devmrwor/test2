import nc from "next-connect";
import type { NextApiResponse } from "next";
import { deleteCategory, getCategoryById, updateCategory } from "../../../controllers/category";
import { Roles } from "../../../../common/enums/roles";
import rolesMiddleware from "@/middlewares/checkRolesMiddleware";
import checkAuth from "@/middlewares/checkAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  CATEGORY_ACTIVE_IMAGE,
  CATEGORY_PASSIVE_IMAGE,
} from "../../../../common/constants/file-fields";
import { IRequest } from "../../../../common/types/request";
import { uploadImagesFields } from "@/middlewares/uploadImagesFields";
import { getImagePath } from "@/utils/getImagePath";
import { filterNullFields } from "@/utils/filterNullFields";

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const data = await getCategoryById(id as string);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.delete(async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json(getErrorMessage(undefined, "Category ID is missing"));
    }

    const message = await deleteCategory(id as string);
    res.status(200).json({ message });
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.use(
  uploadImagesFields([
    { name: CATEGORY_ACTIVE_IMAGE, maxCount: 1 },
    { name: CATEGORY_PASSIVE_IMAGE, maxCount: 1 },
  ])
);

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    const imagesFiles = req.files;

    const active_icon = imagesFiles[CATEGORY_ACTIVE_IMAGE]?.[0]?.filename;
    const passive_icon = imagesFiles[CATEGORY_PASSIVE_IMAGE]?.[0]?.filename;
    if (active_icon) {
      req.body.active_icon = getImagePath(active_icon);
    }
    if (passive_icon) {
      req.body.passive_icon = getImagePath(passive_icon);
    }

    try {
      const translations = Array.isArray(req.body.translations) ? req.body.translations.map(el => JSON.parse(el)) : JSON.parse(req.body.translations);
      req.body.translations = translations;
    } catch (err) {
      req.body.translations = [];
    }
    
    filterNullFields(req);
    if (["null", "undefined"].includes(req.body.parent_id)) {
      req.body.parent_id = null;
    }

    const data = await updateCategory(id as string, req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
