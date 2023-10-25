import { Request, Response } from "express";
import Course from "./course.model";
import UserModel from "../user/user.model";
import { deleteObject } from "../../middleware/s3/s3";

interface MulterRequest extends Request {
  file: any;
}

class CourseController {
  async create(req: Request, res: Response) {
    try {
      const multerFiles = JSON.parse(JSON.stringify(req.file));
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const course = new Course({
          instructorId: req.body.instructorId,
          title: req.body.title,
          introVideoUrl: req.body.introVideoUrl,
          desc: req.body.desc,
          category: req.body.category,
          coverImage: image,
          price: req.body.price,
          courseLevel: req.body.courseLevel,
          duration: req.body.duration,
          language: req.body.language,
          tags: req.body.tags,
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
      } else {
        return res.status(500).json({
          message: "Cover image upload failed",
        });
      }
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
      const courses = await Course.find().sort({ createdAt: -1 });
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
      console.error("error fetching course", error);
    }
  }

  async instructorCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({
        instructorId: req.params.instructorId,
      }).sort({ createdAt: -1 });
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
      const courses = await Course.find({ isApproved: true }).sort({
        createdAt: -1,
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

  async purchasedCourses(req: Request, res: Response) {
    try {
      const user = await UserModel.findOne({ _id: req.params.userId });
      if (user) {
        const purchasedCourses = user.purchasedCourses;
        const courses = await Course.find({ _id: { $in: purchasedCourses } });
        if (courses.length > 0) {
          return res.status(200).json({
            courses,
          });
        } else {
          return res.status(404).json({
            message: "no course found",
          });
        }
      }
    } catch (error) {
      console.error("error fetching courses", error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const multerFiles = (req as MulterRequest).file;
      if (multerFiles) {
        const image = {
          doc: multerFiles?.location,
          key: multerFiles?.key,
        };
        const course = await Course.findOne({ _id: req.params.id });
        if (course) {
          const imageKey = course.coverImage.key;
          const response = await deleteObject(imageKey);
        }
        const updatedCourse = await Course.updateOne(
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
              coverImage: image,
              courseLevel: req.body.courseLevel,
              duration: req.body.duration,
              language: req.body.language,
              tags: req.body.tags,
            },
          }
        );
        if (updatedCourse.acknowledged) {
          res.status(200).json({
            message: "update successful",
          });
        } else {
          res.status(404).json({
            message: "course not found",
          });
        }
      } else {
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
              courseLevel: req.body.courseLevel,
              duration: req.body.duration,
              language: req.body.language,
              tags: req.body.tags,
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
    } catch (error) {
      console.error("error updating course", error);
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

  async searchCourse(req: Request, res: Response) {
    try {
      const data = JSON.parse(req.params.data);
      const title = data.title
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const category = data.category
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const courseLevel = data.courseLevel
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const tags = data.tags
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const language = data.language
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const rating = data.rating
        .toLowerCase()
        .replace(
          /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
          function (letter: string) {
            return letter.toUpperCase();
          }
        );
      const startPrice = data.startPrice;
      const endPrice = data.endPrice;
      const courses = await Course.find({
        $and: [
          {
            isApproved: true,
          },
          {
            title: { $regex: title },
          },
          {
            category: { $regex: category },
          },

          {
            courseLevel: { $regex: courseLevel },
          },
          {
            tags: { $regex: tags },
          },
          {
            language: { $regex: language },
          },
          {
            rating: { $regex: rating },
          },
          {
            price: { $gte: startPrice, $lte: endPrice },
          },
        ],
      });
      if (courses) {
        res.status(200).json(courses);
      } else {
        res.status(404).json({
          message: "No Course Found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default CourseController;
