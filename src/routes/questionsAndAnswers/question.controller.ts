import { Request, Response } from "express";
import Message from "./question.model";
import UserModel from "../user/user.model";

class QuestionAndAnswerController {
  async createMessage(req: Request, res: Response) {
    const newMessage = new Message({
      users: [req.body.senderId, req.body.receiverId, req.body.courseId],
      message: req.body.message,
    });
    try {
      const savedMessage = await newMessage.save();
      return res.status(200).json({
        message: "Question sent",
        savedMessage,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occured",
        error: error,
      });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const massages = await Message.find({
        users: { $in: [req.params.id] },
      });
      res.status(200).send(massages);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }

  async getMessagedUsers(req: Request, res: Response) {
    try {
      const messages = await Message.find({
        users: { $in: [req.params.id] },
      });
      const userIds = messages.filter(
        (item) => item.users[0] !== req.params.id
      );
      const users = UserModel.find({ $in: userIds });
      res.status(200).send(users);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
}

export default QuestionAndAnswerController;
