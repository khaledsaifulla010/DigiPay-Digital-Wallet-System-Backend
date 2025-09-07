import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createUserZodSchema,
  updateMyProfileZodSchema,
} from "./user.validation";
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
  "/me",
  checkAuth(...Object.values(UserRole)),
  UserControllers.getMyProfile
);

router.patch(
  "/me",
  checkAuth(...Object.values(UserRole)),
  validateRequest(updateMyProfileZodSchema),
  UserControllers.updateMyProfile
);

router.get(
  "/all-users",
  checkAuth(UserRole.ADMIN),
  UserControllers.getAllUsers
);

router.get("/:id", checkAuth(UserRole.ADMIN), UserControllers.getUserById);

router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  UserControllers.changeAgentStatus
);

export const UserRoutes = router;
