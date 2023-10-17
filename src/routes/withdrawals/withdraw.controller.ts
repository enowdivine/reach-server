import { Request, Response } from "express";
import Withdraw from "./withdraw.model";

class ChapterController {
  async create(req: Request, res: Response) {
    try {
      const withdraw = new Withdraw({
        userId: req.body.userId,
        amount: req.body.amount,
      });
      await withdraw
        .save()
        .then(() => {
          res.status(201).json({
            message: "request sent",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error sending request",
            error: err,
          });
        });
    } catch (error) {
      console.error("error sending request", error);
    }
  }

  async Withdraw(req: Request, res: Response) {
    try {
      const request = await Withdraw.findOne({ _id: req.params.id });
      if (request) {
        return res.status(200).json({
          request,
        });
      } else {
        return res.status(404).json({
          message: "request not found",
        });
      }
    } catch (error) {
      console.error("error fetching request", error);
    }
  }

  async withdrawalsRequest(req: Request, res: Response) {
    try {
      const requests = await Withdraw.find({
        userId: req.params.userId,
      }).sort({ createdAt: -1 });
      if (requests) {
        return res.status(200).json(requests);
      } else {
        return res.status(404).json({
          message: "no chapter found",
        });
      }
    } catch (error) {
      console.error("error fetching requests", error);
    }
  }

  async allWithdrawalsRequest(req: Request, res: Response) {
    try {
      const requests = await Withdraw.find({}).sort({ createdAt: -1 });
      if (requests) {
        return res.status(200).json({
          requests,
        });
      } else {
        return res.status(404).json({
          message: "no request found",
        });
      }
    } catch (error) {
      console.error("error fetching requests", error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const request = await Withdraw.findOne({ _id: req.params.id });
      if (request) {
        request.status = req.body.status;
        await request.save().then(() => {
          return res.status(200).json({
            message: "request status updated",
          });
        });
      } else {
        return res.status(404).json({
          message: "request not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default ChapterController;
