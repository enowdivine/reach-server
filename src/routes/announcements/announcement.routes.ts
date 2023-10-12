import express, { Router } from "express";
import Announcement from "./announcement.controller";

const router: Router = express.Router();
const announcement = new Announcement();

router.post("/post-announcement", announcement.create);
router.get("/announcements/:courseId", announcement.announcements);
router.put("/update-announcement/:id", announcement.update);
router.delete("/delete-announcement/:id", announcement.deleteAnnouncement);

export default router;
