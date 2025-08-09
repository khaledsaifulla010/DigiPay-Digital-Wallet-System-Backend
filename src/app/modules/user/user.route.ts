import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";

const router = express.Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(UserRole.ADMIN),
  UserControllers.getAllUsers
);
router.get("/:id", checkAuth(UserRole.ADMIN), UserControllers.getUserById);
export const UserRoutes = router;
