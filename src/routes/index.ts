import { Router as expressRouter } from "express";
import authRoutes from "./auth";
const appRoutes = expressRouter();

appRoutes.use("/auth", authRoutes);

export default appRoutes;
