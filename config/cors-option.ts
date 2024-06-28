import type { CorsOptions } from "cors";
import allowedOrigins from "./allowed-origin";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if ((origin && allowedOrigins.indexOf(origin) !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // Some browsers choke on 204
};

export default corsOptions;
