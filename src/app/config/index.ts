import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_Token_secrete: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expire_in: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
  jwt_refresh_token_secrete: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expire_in: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
};
