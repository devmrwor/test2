import { NextApiResponse } from "next";
import { Roles } from "../../common/enums/roles";
import { IRequest } from "../../common/types/request";

export default function rolesMiddleware(requiredRoles: Roles[]) {
  return async (req: IRequest, res: NextApiResponse, next: () => void) => {
    const token = req.token;
    if (!token || !requiredRoles.includes(token?.role)) {
      res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
