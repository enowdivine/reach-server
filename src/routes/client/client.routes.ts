import express, { Router } from "express";
import Client from "./client.controller";

const router: Router = express.Router();
const client = new Client();

router.post("/register", client.register);
router.post("/login", client.login);
router.post("/forgot-password", client.forgotPassword);

router.get("/client/:id", client.user);
router.get("/clients", client.users);

router.put("/update-client/:id", client.update);
router.put("/update-password/:id", client.updatePassword);
router.put("/new-password/:id", client.newPassword);
router.put("/update-client-status/:id", client.updateStatus);

router.delete("/delete-client/:id", client.deleteUser);

export default router;
