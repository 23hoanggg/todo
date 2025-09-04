import express from "express";
import {
  login,
  loginSchema,
  register,
  registerSchema,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
