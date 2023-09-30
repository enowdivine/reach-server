import { Request, Response } from "express";
import Chapter from "./chapter.model";
import lessonModel from "../lessons/lesson.model";
import { deleteObject } from "../../middleware/s3/s3";

class ChapterController {
  async create(req: Request, res: Response) {
    try {
      const course = new Chapter({
        courseId: req.body.courseId,
        title: req.body.title,
      });
      await course
        .save()
        .then(() => {
          res.status(201).json({
            message: "chapter created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating chapter",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating chapter", error);
    }
  }

  async chapter(req: Request, res: Response) {
    try {
      const chapter = await Chapter.findOne({ _id: req.params.id });
      if (chapter) {
        return res.status(200).json({
          chapter,
        });
      } else {
        return res.status(404).json({
          message: "chapter not found",
        });
      }
    } catch (error) {
      console.error("error fetching chapter", error);
    }
  }

  async chapters(req: Request, res: Response) {
    try {
      const chapters = await Chapter.find({
        courseId: req.params.courseId,
      });
      if (chapters) {
        return res.status(200).json({
          chapters,
        });
      } else {
        return res.status(404).json({
          message: "no chapter found",
        });
      }
    } catch (error) {
      console.error("error fetching chapters", error);
    }
  }

  async update(req: Request, res: Response) {
    const lesson = await Chapter.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
        },
      }
    );
    if (lesson.acknowledged) {
      res.status(200).json({
        message: "update successful",
      });
    } else {
      res.status(404).json({
        message: "chapter not found",
      });
    }
  }

  async deleteChapter(req: Request, res: Response) {
    try {
      const lessons = await lessonModel.find({ chapterId: req.params.id });
      if (lessons.length > 0) {
        lessons.map(async (lesson) => {
          let lessonKey = lesson.content.key;
          await deleteObject(lessonKey);
        });
      }
      const response = await Chapter.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "chater deleted",
        });
      } else {
        res.status(404).json({
          message: "chater not found",
        });
      }
    } catch (error) {
      console.error("error deleting chater", error);
    }
  }
}

export default ChapterController;
