import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import Instructor from "./instructor.model";
import sendEmail from "../../services/email/sendEmail";
import { welcomeEmail } from "./templates/welcomeEmail";

class InstructorController {
  async register(req: Request, res: Response) {
    try {
      const user = await Instructor.findOne({ email: req.body.email });
      if (user) {
        return res.status(409).json({
          message: "email already exist",
        });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new Instructor({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      newUser
        .save()
        .then((response) => {
          const token: string = jwt.sign(
            {
              id: response._id,
              username: response.username,
              email: response.email,
              role: response.role,
            },
            process.env.JWT_SECRET as string
          );
          sendEmail({
            to: response.email as string,
            subject: "Deonicode: Welcome Email",
            message: welcomeEmail(response.username as string),
          });
          res.status(201).json({
            message: "success",
            token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating user",
            error: err,
          });
        });
    } catch (error) {
      console.error("error in user registration", error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await Instructor.findOne({ email: req.body.email });
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password!,
          (err: any, result: any) => {
            if (err) {
              return res.status(401).json({
                message: "authentication failed",
              });
            }
            if (result) {
              const token: string = jwt.sign(
                {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                },
                process.env.JWT_SECRET as string
              );
              return res.status(200).json({
                message: "login successful",
                token: token,
              });
            }
            res.status(401).json({
              message: "authentication failed",
            });
          }
        );
      } else {
        return res.status(401).json({
          message: "authentication failed",
        });
      }
    } catch (error) {
      console.error("user login error", error);
      return res.status(500);
    }
  }

  async update(req: Request, res: Response) {
    const user = await Instructor.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          bio: req.body.bio,
          avatar: req.body.avatar,
          country: req.body.country,
        },
      }
    );
    if (user.acknowledged) {
      const newuser = await Instructor.findOne({ _id: req.params.id });
      const token: string = jwt.sign(
        {
          id: newuser?._id,
          username: newuser?.username,
          email: newuser?.email,
          role: newuser?.role,
        },
        process.env.JWT_SECRET as string
      );
      res.status(200).json({
        message: "update successful",
        token: token,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    let user = await Instructor.findOne({ _id: req.params.id });
    if (user) {
      const { currentPassword, newPassword } = req.body;
      bcrypt
        .compare(currentPassword, user.password!)
        .then((match: any) => {
          if (match) {
            bcrypt.hash(newPassword, 10, (error: any, hash: any) => {
              if (error) {
                return res.status(500).json({
                  error: error,
                });
              }
              const passwordUpdate = {
                password: hash,
              };
              user = _.extend(user, passwordUpdate);
              if (user) {
                user
                  .save()
                  .then((result: any) => {
                    res.status(200).json({
                      message: "password updated",
                    });
                  })
                  .catch((error: any) => {
                    res.status(500).json({
                      error: error,
                    });
                  });
              }
            });
          } else {
            return res.status(500).json({
              message: "passwords do not match",
            });
          }
        })
        .catch((err: any) => {
          return res.status(401).json({
            error: err,
          });
        });
    }
  }

  async instructor(req: Request, res: Response) {
    try {
      const user = await Instructor.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json({
          user,
        });
      } else {
        return res.status(404).json({
          message: "instructor not found",
        });
      }
    } catch (error) {
      console.error("error fetching instructor", error);
    }
  }

  async instructors(req: Request, res: Response) {
    try {
      const users = await Instructor.find();
      if (users) {
        return res.status(200).json({
          users,
        });
      } else {
        return res.status(404).json({
          message: "no instructor found",
        });
      }
    } catch (error) {
      console.error("error fetching instructors", error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = await Instructor.findOne({ email: req.body.email });
      if (user) {
        const resetToken: string = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          }
        );
        const url = `<a href="${process.env.FRONTEND_URL}/new-password/${resetToken}">Click here</a>`;
        sendEmail({
          to: user.email as string,
          subject: "Deonicode: Reset Password",
          message: welcomeEmail(url),
        });
        return res.status(200).json({
          message: "success, check your inbox",
        });
      } else {
        return res.status(500).json({
          message: "email does not exist",
        });
      }
    } catch (error) {
      console.error("error in forgot password", error);
    }
  }

  async newPassword(req: Request, res: Response) {
    try {
      let user = await Instructor.findOne({ _id: req.params.id });
      if (user) {
        const { newPassword } = req.body;
        bcrypt.hash(newPassword, 10, async (error: any, hash: any) => {
          if (error) {
            return res.status(500).json({
              error: error,
            });
          }
          const passwordUpdate = {
            password: hash,
          };
          user = _.extend(user, passwordUpdate);
          user
            .save()
            .then((result: any) => {
              const token: string = jwt.sign(
                {
                  id: result._id,
                  username: result.username,
                  email: result.email,
                },
                process.env.JWT_SECRET as string
              );
              res.status(200).json({
                message: "Password Updated",
                token: token,
              });
            })
            .catch((error: any) => {
              res.status(500).json({
                error: error,
              });
            });
        });
      } else {
        return res.status(500).json({
          message: "email does not exist",
        });
      }
    } catch (error) {
      console.error("error in new password", error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const user = await Instructor.findOne({ _id: req.params.id });
      if (user) {
        user.isActive = !user.isActive;
        await user.save().then(() => {
          return res.status(200).json({
            message: "instructor status updated",
          });
        });
      } else {
        return res.status(404).json({
          message: "instructor not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteInstructor(req: Request, res: Response) {
    try {
      const response = await Instructor.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "instructor deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "instructor not found",
        });
      }
    } catch (error) {
      console.error("error fetching instructor", error);
    }
  }
}

export default InstructorController;
