import express from "express";
import AdminAuth from "./admin.controller";
import AdminMiddleware from "../../middleware/auth/admin";

const router = express.Router();
const admin = new AdminAuth();

router.post("/register", AdminMiddleware, admin.register);
router.post("/login", admin.login);
router.put("/update/:id", admin.update);
router.put("/update-password/:id", admin.updatePassword);

export default router;
