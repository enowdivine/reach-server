import { Request, Response } from "express";
import Course from "./course.model";

class CourseController {
  async create(req: Request, res: Response) {
    try {
      const course = new Course({
        instructorId: req.body.instructorId,
        title: req.body.title,
        introVideoUrl: req.body.introVideoUrl,
        desc: req.body.desc,
        category: req.body.category,
        price: req.body.price,
        discount: req.body.discount,
        courseLevel: req.body.courseLevel,
        numberOfChapters: req.body.numberOfChapters,
        numberOfLessons: req.body.numberOfLessons,
        duration: req.body.duration,
        language: req.body.language,
        $push: {
          tags: { tags: req.body.tags },
        },
      });
      await course
        .save()
        .then(() => {
          res.status(201).json({
            message: "course created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating course",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating course", error);
    }
  }

  async course(req: Request, res: Response) {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      if (course) {
        return res.status(200).json({
          course,
        });
      } else {
        return res.status(404).json({
          message: "course not found",
        });
      }
    } catch (error) {
      console.error("error fetching course", error);
    }
  }

  async courses(req: Request, res: Response) {
    try {
      const course = await Course.find();
      if (course) {
        return res.status(200).json({
          course,
        });
      } else {
        return res.status(404).json({
          message: "no course found",
        });
      }
    } catch (error) {
      console.error("error fetching course", error);
    }
  }

  async instructorCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({
        instructorId: req.params.instructorId,
      });
      if (courses) {
        return res.status(200).json({
          courses,
        });
      } else {
        return res.status(404).json({
          message: "no course found",
        });
      }
    } catch (error) {
      console.error("error fetching courses", error);
    }
  }

  async approvedCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({ isApproved: true });
      if (courses) {
        return res.status(200).json({
          courses,
        });
      } else {
        return res.status(404).json({
          message: "no course found",
        });
      }
    } catch (error) {
      console.error("error fetching courses", error);
    }
  }

  async update(req: Request, res: Response) {
    const course = await Course.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          title: req.body.title,
          introVideoUrl: req.body.introVideoUrl,
          desc: req.body.desc,
          category: req.body.category,
          price: req.body.price,
          discount: req.body.discount,
          courseLevel: req.body.courseLevel,
          numberOfChapters: req.body.numberOfChapters,
          numberOfLessons: req.body.numberOfLessons,
          duration: req.body.duration,
          language: req.body.language,
        },
        $push: {
          tags: { tags: req.body.tags },
        },
      }
    );
    if (course.acknowledged) {
      res.status(200).json({
        message: "update successful",
      });
    } else {
      res.status(404).json({
        message: "course not found",
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      if (course) {
        course.isApproved = !course.isApproved;
        await course.save().then(() => {
          return res.status(200).json({
            message: "course status updated",
          });
        });
      } else {
        return res.status(404).json({
          message: "course not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const response = await Course.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "course deleted",
        });
      } else {
        res.status(404).json({
          message: "course not found",
        });
      }
    } catch (error) {
      console.error("error deleting course", error);
    }
  }
}

export default CourseController;
