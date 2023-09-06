import express, { Router } from "express";
import Instructor from "./instructor.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const istructor = new Instructor();

router.post("/register", upload.single("resume"), istructor.register);
router.post("/login", istructor.login);
router.post("/forgot-password", istructor.forgotPassword);

router.get("/istructor/:id", istructor.instructor);
router.get("/istructors", istructor.instructors);

router.put("/update-user/:id", istructor.update);
router.put("/update-password/:id", istructor.updatePassword);
router.put("/new-password/:id", istructor.newPassword);

router.delete("/delete-istructor/:id", istructor.deleteInstructor);
router.put("/update-status/:id", istructor.updateStatus);

export default router;
