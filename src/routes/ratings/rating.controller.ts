import { Request, Response } from "express";
import Rating from "./rating.model";
import courseModel from "../courses/course.model";

class RatingController {
  async create(req: Request, res: Response) {
    try {
      const rating = new Rating({
        courseId: req.body.courseId,
        userId: req.body.userId,
        rating: req.body.rating,
        comment: req.body.comment,
      });
      await rating
        .save()
        .then(async () => {
          const courseRatings = await Rating.find({
            courseId: req.body.courseId,
          });

          // calculate rating
          if (courseRatings && courseRatings.length > 0) {
            let count = 0;
            let sum = 0;
            courseRatings.forEach((item: any, index) => {
              count += item.rating;
              sum += item.rating * (index + 1);
            });
            const newRate = sum / count;

            // course update
            const course = await courseModel.updateOne(
              {
                _id: req.body.courseId,
              },
              {
                $set: {
                  rating: newRate,
                },
              }
            );
            if (course.acknowledged) {
              res.status(201).json({
                message: "Thank you for rating this course",
              });
            }
          } else {
            res.status(400).json({
              message: "an error occured",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "error rating course",
            error: err,
          });
        });
    } catch (error) {
      console.error("error rating course", error);
    }
  }

  async ratings(req: Request, res: Response) {
    try {
      const ratings = await Rating.find({
        courseId: req.params.courseId,
      });
      if (ratings) {
        return res.status(200).json(ratings);
      } else {
        return res.status(404).json({
          message: "no ratings found",
        });
      }
    } catch (error) {
      console.error("error fetching ratings", error);
    }
  }
}

export default RatingController;
