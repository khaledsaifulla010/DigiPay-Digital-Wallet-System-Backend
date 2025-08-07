import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getUserById);
export const UserRoutes = router;
