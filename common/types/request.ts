import { NextApiRequest } from "next";
import { JWT } from "next-auth";

export type IRequest = NextApiRequest & { token: JWT } & { file: File } & { files: File[] };
