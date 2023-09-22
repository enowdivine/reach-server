import express, { Router } from "express";
import Course from "./course.controller";
import { upload } from "../../middleware/s3/s3";

const router: Router = express.Router();
const course = new Course();

router.post("/create", upload.single("coverImage"), course.create);

router.get("/course/:id", course.course);
router.get("/courses", course.courses);
router.get("/instructor-courses/:instructorId", course.instructorCourses);
router.get("/approved-courses", course.approvedCourses);

router.put("/update-course/:id", upload.single("coverImage"), course.update);
router.put("/update-status/:id", course.updateStatus);

router.delete("/delete-course/:id", course.deleteCourse);

export default router;
