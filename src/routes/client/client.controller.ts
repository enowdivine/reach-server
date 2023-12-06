import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import User from "./client.model";
import sendEmail from "../../services/email/sendEmail";
import {
  welcomeEmail,
  forgotPasswordEmail,
  accountActivated,
  accountSuspended,
  accountDeactivated,
} from "./templates/emails";

class UsersController {
  async register(req: Request, res: Response) {
    try {
      const user = await User.findOne({
        phone: req.body.phone,
        email: req.body.email,
      });
      if (user) {
        return res.status(409).json({
          message: "An account with the number already exist",
        });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location,
        password: hash,
      });
      newUser
        .save()
        .then((response) => {
          const token: string = jwt.sign(
            {
              id: response._id,
              username: response.username,
              phone: response.phone,
            },
            process.env.JWT_SECRET as string
          );

          sendEmail({
            to: response.email as string,
            subject: "Reach: Welcome Email",
            message: welcomeEmail(response.username as string),
          });
          res.status(201).json({
            message: "success, check email",
            token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "error creating account",
            error: err,
          });
        });
    } catch (error) {
      console.error("an error occured", error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await User.findOne({ phone: req.body.phone });
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
                  phone: user.phone,
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
    const user = await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          username: req.body.username,
          phone: req.body.phone,
          email: req.body.email,
          description: req.body.description,
          headline: req.body.headline,
          website: req.body.website,
          location: req.body.location,
        },
      }
    );
    if (user.acknowledged) {
      const newuser = await User.findOne({ _id: req.params.id });
      const token: string = jwt.sign(
        {
          id: newuser?._id,
          username: newuser?.username,
          email: newuser?.email,
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
    let user = await User.findOne({ _id: req.params.id });
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

  async user(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching user", error);
    }
  }

  async users(req: Request, res: Response) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      if (users) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          message: "no user found",
        });
      }
    } catch (error) {
      console.error("error fetching users", error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const resetToken: string = jwt.sign(
          {
            userId: user._id,
            phone: user.phone,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          }
        );
        sendEmail({
          to: user.email as string,
          subject: "Reach: Password Reset",
          message: forgotPasswordEmail(user.username as string),
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
      let user = await User.findOne({ _id: req.params.id });
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
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        user.status = req.body.status;
        await user.save().then(() => {
          sendEmail({
            to: user?.email as string,
            subject: `Account ${req.body.status}`,
            message:
              req.body.status === "active"
                ? accountActivated(user?.username as string, req.body.status)
                : req.body.status === "suspended"
                ? accountSuspended(user?.username as string, req.body.status)
                : accountDeactivated(user?.username as string, req.body.status),
          });
          return res.status(200).json({
            message: "user status updated",
          });
        });
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const response = await User.deleteOne({ _id: req.params.id });
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "user deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching user", error);
    }
  }
}

export default UsersController;
