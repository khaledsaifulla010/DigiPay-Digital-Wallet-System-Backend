import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = express.Router();

router.post("/register", validateRequest(createUserZodSchema));
export const UserRoutes = router;
