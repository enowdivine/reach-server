import { Request, Response } from "express";
import Lesson from "./lesson.model";

class CourseController {
  async create(req: Request, res: Response) {
    try {
      const course = new Lesson({
        chapterId: req.body.chapterId,
        title: req.body.title,
        duration: req.body.duration,
        content: req.body.content,
      });
      await course
        .save()
        .then(() => {
          res.status(201).json({
            message: "lesson created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating lesson",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating lesson", error);
    }
  }

  async lesson(req: Request, res: Response) {
    try {
      const lesson = await Lesson.findOne({ _id: req.params.id });
      if (lesson) {
        return res.status(200).json({
          lesson,
        });
      } else {
        return res.status(404).json({
          message: "lesson not found",
        });
      }
    } catch (error) {
      console.error("error fetching lesson", error);
    }
  }

  async lessons(req: Request, res: Response) {
    try {
      const lessons = await Lesson.find({ chapterId: req.params.chapId });
      if (lessons) {
        return res.status(200).json({
          lessons,
        });
      } else {
        return res.status(404).json({
          message: "no lesson found",
        });
      }
    } catch (error) {
      console.error("error fetching course", error);
    }
  }

  async update(req: Request, res: Response) {
    const lesson = await Lesson.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
          duration: req.body.duration,
          content: req.body.content,
        },
      }
    );
    if (lesson.acknowledged) {
      res.status(200).json({
        message: "update successful",
      });
    } else {
      res.status(404).json({
        message: "lesson not found",
      });
    }
  }

  async deleteLesson(req: Request, res: Response) {
    try {
      const response = await Lesson.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "lesson deleted",
        });
      } else {
        res.status(404).json({
          message: "lesson not found",
        });
      }
    } catch (error) {
      console.error("error deleting lesson", error);
    }
  }
}

export default CourseController;
