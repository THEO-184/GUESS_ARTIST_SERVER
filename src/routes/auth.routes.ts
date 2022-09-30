import { Router } from "express";
import { createUserAlbum } from "../user/controllers/album.controller";
import {
	loginHandler,
	registerUser,
} from "../auth/controllers/auth.controller";

const router = Router();

router.route("/register").post(registerUser, createUserAlbum);
router.route("/login").post(loginHandler);

export default router;
