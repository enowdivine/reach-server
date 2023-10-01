import { Request, Response } from "express";
import Transaction from "./transaction.model";
import userModel from "../user/user.model";
import courseModel from "../courses/course.model";
import _ from "lodash";

class TransactionController {
  async create(req: Request, res: Response) {
    try {
      const transaction = new Transaction({
        courseId: req.body.courseId,
        userId: req.body.userId,
        instructorId: req.body.instructorId,
        amount: req.body.amount,
        paymentMethod: req.body.paymentMethod,
        status: req.body.status,
      });
      await transaction
        .save()
        .then(async () => {
          let course = await courseModel.findOne({ _id: req.body.courseId });
          if (course) {
            const saleCountIncrement = {
              saleCount: course.saleCount + 1,
            };
            course = _.extend(course, saleCountIncrement);
            course.save().then(async () => {
              const user = await userModel.updateOne(
                { _id: req.body.userId },
                { $push: { purchasedCourses: req.body.courseId } }
              );
              if (user.acknowledged) {
                res.status(201).json({
                  message: "Successful",
                });
              }
            });
          } else {
            res.status(404).json({
              message: "course not found",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "error purchasing course",
            error: err,
          });
        });
    } catch (error) {
      console.error("error creating transaction", error);
    }
  }

  async transaction(req: Request, res: Response) {
    try {
      const transaction = await Transaction.findOne({ _id: req.params.id });
      if (transaction) {
        return res.status(200).json({
          transaction,
        });
      } else {
        return res.status(404).json({
          message: "transaction not found",
        });
      }
    } catch (error) {
      console.error("error fetching transaction", error);
    }
  }

  async instructorTransaction(req: Request, res: Response) {
    try {
      const transaction = await Transaction.find({
        instructorId: req.params.instructorId,
      }).sort({ createdAt: -1 });
      if (transaction) {
        return res.status(200).json({
          transaction,
        });
      } else {
        return res.status(404).json({
          message: "No transaction found",
        });
      }
    } catch (error) {
      console.error("error fetching transactions", error);
    }
  }

  async transactions(req: Request, res: Response) {
    try {
      const transactions = await Transaction.find().sort({ createdAt: -1 });
      if (transactions) {
        return res.status(200).json({
          transactions,
        });
      } else {
        return res.status(404).json({
          message: "no transaction found",
        });
      }
    } catch (error) {
      console.error("error fetching transaction", error);
    }
  }
}

export default TransactionController;
