import express, { Router } from "express";
import Course from "./course.controller";

const router: Router = express.Router();
const course = new Course();

router.post("/create", course.create);

router.get("/course/:id", course.course);
router.get("/courses", course.courses);
router.get("/instructor-courses/:instructorId", course.courses);
router.get("/approved-courses", course.approvedCourses);

router.put("/update-course/:id", course.update);
router.put("/update-status/:id", course.updateStatus);

router.delete("/delete-course/:id", course.deleteCourse);

export default router;
