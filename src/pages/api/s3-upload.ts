import { v4 } from "uuid";
import { APIRoute, sanitizeKey } from "next-s3-upload";
import { s3ImageUploadPath } from "../../../common/constants/s3-image-upload-path";

export default APIRoute.configure({
  key(_, filename) {
    return `${s3ImageUploadPath}/${v4()}-${sanitizeKey(filename)}`;
  },
});
