import express, { Express } from "express";
import dotenv from "dotenv";
import { createAppRoutes } from "./routes";
import { Config, errorHandler } from "./core";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Load the configuration
Config.getInstance();
// Test the connection to the database
Config.getInstance().testConnection();

app.use(express.json());

app.use("/api", createAppRoutes());

// ! The error handler must be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
