import { IUser } from "../../common/types/user";

export const getFullName = (user: IUser) => {
  return `${user.surname || ""} ${user.name || ""} ${user.patronymic || ""}`;
};
