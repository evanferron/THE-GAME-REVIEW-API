import express, { Express } from "express";
import dotenv from "dotenv";
import { createAppRoutes } from "./routes";
import { Config, errorHandler, checkOrigin, limiter } from "./core";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./src/doc/swagger.yaml');

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

// Load the configuration
Config.getInstance();
// Test the connection to the database
Config.getInstance().testConnection();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// check the origin of the request
app.use(checkOrigin);
// limit the number of requests by ip
app.use(limiter)

app.use("/api", createAppRoutes());

// ! The error handler must be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log('Documentation Swagger disponible sur http://localhost:3000/api-docs');
});

export default app;