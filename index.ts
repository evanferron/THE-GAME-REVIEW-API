// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./src/shared/middleware/error";
import { Config } from "./src/config/config";
import { Routes as AuthRoutes } from "./src/modules/auth/routes";
import { Routes as UserRoutes } from "./src/modules/user/routes";
import { Routes as ReviewRoutes } from "./src/modules/review/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const config = new Config();

app.use("/auth", AuthRoutes(config));
app.use("/user", UserRoutes(config));
app.use("/review", ReviewRoutes(config));

// ! The error handler must be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});