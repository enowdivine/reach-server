import { Request, Response } from "express";
import Lesson from "./lesson.model";
import { deleteObject } from "../../middleware/s3/s3";

interface MulterRequest extends Request {
  file: any;
}

class CourseController {
  async create(req: Request, res: Response) {
    try {
      const multerFiles = (req as MulterRequest).file;
      if (multerFiles) {
        const video = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const course = new Lesson({
          chapterId: req.body.chapterId,
          title: req.body.title,
          duration: req.body.duration,
          content: video,
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
      } else {
        return res.status(500).json({
          message: "Video upload failed",
        });
      }
    } catch (error) {
      console.error("error creating lesson", error);
    }
  }

  async createLoomLesson(req: Request, res: Response) {
    try {
      const course = new Lesson({
        chapterId: req.body.chapterId,
        title: req.body.title,
        duration: req.body.duration,
        loomLink: req.body.loomLink,
        loomType: true,
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
      const lessons = await Lesson.find({ chapterId: req.params.chapId }).sort({
        createdAt: -1,
      });
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
    try {
      const multerFiles = (req as MulterRequest).file;
      if (multerFiles) {
        const video = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const lesson = await Lesson.findOne({ _id: req.params.id });
        if (lesson) {
          const imageKey = lesson.content.key;
          const response = await deleteObject(imageKey);
        }
        const updatedLesson = await Lesson.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              title: req.body.title,
              duration: req.body.duration,
              content: video,
            },
          }
        );
        if (updatedLesson.acknowledged) {
          res.status(200).json({
            message: "update successful",
          });
        } else {
          res.status(404).json({
            message: "lesson not found",
          });
        }
      } else {
        const updatedLesson = await Lesson.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: {
              title: req.body.title,
              duration: req.body.duration,
            },
          }
        );
        if (updatedLesson.acknowledged) {
          res.status(200).json({
            message: "update successful",
          });
        } else {
          res.status(404).json({
            message: "lesson not found",
          });
        }
      }
    } catch (error) {
      console.error("error updating lesson", error);
    }
  }

  async deleteLesson(req: Request, res: Response) {
    try {
      const lesson = await Lesson.findOne({ _id: req.params.id });
      if (lesson) {
        const imageKey = lesson.content.key;
        await deleteObject(imageKey);
      }
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
