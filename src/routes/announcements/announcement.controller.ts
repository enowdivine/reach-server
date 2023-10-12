import { Request, Response } from "express";
import Announcement from "./announcement.model";

class CourseController {
  async create(req: Request, res: Response) {
    try {
      const announcement = new Announcement({
        courseId: req.body.courseId,
        content: req.body.content,
      });
      await announcement
        .save()
        .then(() => {
          res.status(201).json({
            message: "announcement sent",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error sending announcement",
            error: err,
          });
        });
    } catch (error) {
      console.error("error sending announcement", error);
    }
  }

  async announcements(req: Request, res: Response) {
    try {
      const announcements = await Announcement.find({
        courseId: req.params.courseId,
      });
      if (announcements) {
        return res.status(200).json({
          announcements,
        });
      } else {
        return res.status(404).json({
          message: "no announcement found",
        });
      }
    } catch (error) {
      console.error("error fetching announcement", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedAnnouncement = await Announcement.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            content: req.body.content,
          },
        }
      );
      if (updatedAnnouncement.acknowledged) {
        res.status(200).json({
          message: "update successful",
        });
      } else {
        res.status(404).json({
          message: "announcement not found",
        });
      }
    } catch (error) {
      console.error("error updating announcement", error);
    }
  }

  async deleteAnnouncement(req: Request, res: Response) {
    try {
      const response = await Announcement.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "announcement deleted",
        });
      } else {
        res.status(404).json({
          message: "announcement not found",
        });
      }
    } catch (error) {
      console.error("error deleting announcement", error);
    }
  }
}

export default CourseController;
