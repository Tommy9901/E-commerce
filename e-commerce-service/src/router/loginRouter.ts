import express from "express";
import { loginUser } from "../controller/loginController";

export const loginRouter = express.Router();

loginRouter.post("/login", loginUser);
