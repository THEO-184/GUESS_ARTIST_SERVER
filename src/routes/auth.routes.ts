import { Router } from "express";
import { loginHandler, registerUser } from "../controllers/auth.controller";
import { createUserAlbum } from "../controllers/album.controller";

const router = Router();

router.route("/register").post(registerUser, createUserAlbum);
router.route("/login").post(loginHandler);

export default router;
