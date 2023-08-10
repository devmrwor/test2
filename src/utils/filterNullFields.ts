import { IRequest } from "../../common/types/request";

export const filterNullFields = (obj: IRequest) => {
  Object.keys(obj.body).forEach((key) => {
    if (
      obj.body[key] === "" ||
      obj.body[key] === "null"
      // ||
      // obj.body[key] === "undefined" ||
      // obj.body[key] === undefined
    ) {
      obj.body[key] = null;
    }
  });
};
