import express, { Express } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./src/shared/middleware/error";
import { Config } from "./src/config/config";
import { createAppRoutes } from "./src/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const config = new Config();
app.use(createAppRoutes(config));

// ! The error handler must be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
