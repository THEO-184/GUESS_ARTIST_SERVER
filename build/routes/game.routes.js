"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const album_controller_1 = require("../user/controllers/album.controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const attachRandomNumber_1 = require("../middlewares/attachRandomNumber");
const router = (0, express_1.Router)();
router
    .route("/attempts")
    .get(auth_middleware_1.authMiddleware, album_controller_1.getUserAlbum)
    .put(auth_middleware_1.authMiddleware, album_controller_1.nextAttempt, album_controller_1.getUserAlbum);
router
    .route("/rounds")
    .put(auth_middleware_1.authMiddleware, album_controller_1.nextRound, attachRandomNumber_1.attacheRandomNumber, album_controller_1.updateUserAlbumDetails);
router.route("/restart").put(auth_middleware_1.authMiddleware, album_controller_1.restartGame);
router.route("/users/scores").get(album_controller_1.getUsersScores);
exports.default = router;
