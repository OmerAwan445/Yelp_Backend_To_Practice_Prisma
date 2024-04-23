import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import appRoutes from "@routes/index";
import { serverConfig } from "@src/server";
import config from "config";
import { getEnv } from "@utils/getEnv";
import ErrorHandler from "./errors/ErrorHandler";
import { AppError } from "./errors/AppError";
import { CustomError } from "./Types";
console.log(config.get("db"));
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", appRoutes);

app.use(
    (
        err: CustomError | AppError,
        req: Request,
        res: Response,
        next: NextFunction // eslint-disable-line
    ) => {
      const handler = new ErrorHandler(res, err);
      handler.handleError();
    },
);

serverConfig(app, getEnv("server.port") as string);
