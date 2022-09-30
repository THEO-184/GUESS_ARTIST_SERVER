"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const album_controller_1 = require("../user/controllers/album.controller");
const auth_controller_1 = require("../auth/controllers/auth.controller");
const router = (0, express_1.Router)();
router.route("/register").post(auth_controller_1.registerUser, album_controller_1.createUserAlbum);
router.route("/login").post(auth_controller_1.loginHandler);
exports.default = router;
