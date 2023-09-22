import express, { Router } from "express";
import Instructor from "./instructor.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const instructor = new Instructor();

router.post("/register", upload.single("resume"), instructor.register);
router.post("/login", instructor.login);
router.post("/forgot-password", instructor.forgotPassword);

router.get("/instructor/:id", instructor.instructor);
router.get("/instructors", instructor.instructors);
router.get("/course-author/:authorId", instructor.courseAuthor);

router.put("/update-user/:id", instructor.update);
router.put("/update-password/:id", instructor.updatePassword);
router.put("/new-password/:id", instructor.newPassword);

router.delete("/delete-instructor/:id", instructor.deleteInstructor);
router.put("/update-instructor-status/:id", instructor.updateStatus);

export default router;
