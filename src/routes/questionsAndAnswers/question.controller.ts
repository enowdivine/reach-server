import { Request, Response } from "express";
import Question from "./question.model";
import UserModel from "../user/user.model";

class QuestionAndAnswerController {
  async createQuestion(req: Request, res: Response) {
    const newMessage = new Question({
      users: [req.body.senderId, req.body.receiverId, req.body.courseId],
      message: req.body.message,
    });
    try {
      const savedMessage = await newMessage.save();
      return res.status(200).json({
        message: "Message sent",
        savedMessage,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occured",
        error: error,
      });
    }
  }

  async getQuestions(req: Request, res: Response) {
    try {
      const questions = await Question.find({
        users: { $in: [req.params.userId, req.params.courseId] },
      });
      const filteredQuestions = questions.filter(
        (item) => item.users[2] === req.params.courseId
      );
      res.status(200).send(filteredQuestions);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }

  async getQuestionsUsers(req: Request, res: Response) {
    try {
      const messages = await Question.find({
        users: { $in: [req.params.userId] },
      });
      const userMessages = messages.filter(
        (item) =>
          item.users[0] !== req.params.userId &&
          item.users[2] === req.params.courseId
      );
      const userIds = userMessages.map((item) => item.users[0]);
      const users = await UserModel.find({ _id: { $in: userIds } });
      res.status(200).send(users);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
}

export default QuestionAndAnswerController;
