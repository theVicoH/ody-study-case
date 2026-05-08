import path from "path";

import { config } from "dotenv";

config({ path: path.resolve(import.meta.dir, "../../../.env") });

