import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import User from "./user.model";
import sendEmail from "../../services/email/sendEmail";
import { welcomeEmail } from "./templates/welcomeEmail";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(409).json({
          message: "email already exist",
        });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
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
              email: response.email,
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
      const user = await User.findOne({ email: req.body.email });
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
                  email: user.email,
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
          email: req.body.email,
          bio: req.body.bio,
          avatar: req.body.avatar,
          country: req.body.country,
        },
        $push: {
          purchasedCourses: { purchasedCourses: req.body.purchasedCourses },
          wishlist: { wishlist: req.body.wishlist },
          cart: { cart: req.body.cart },
        },
      }
    );
    if (user.acknowledged) {
      res.status(200).json({
        message: "update successful",
        user,
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
        return res.status(200).json({
          user,
        });
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
      const users = await User.find();
      if (users) {
        return res.status(200).json({
          users,
        });
      } else {
        return res.status(404).json({
          message: "no user found",
        });
      }
    } catch (error) {
      console.error("error fetching users", error);
    }
  }

  async addToWishlist(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const itemID = req.body.item._id;
        const userWishlist = user.wishlist;
        const temp = userWishlist.filter((item) => item.id === itemID);
        if (temp.length > 0) {
          return res.status(400).json({
            message: "item already exist in wislist",
          });
        }
        user.wishlist.push(req.body.item);
        user.save().then(() => {
          return res.status(200).json({
            message: "item added to wishlist",
          });
        });
      }
    } catch (error) {
      console.error("error adding item to wishlist", error);
    }
  }

  async viewWishlist(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const wishlist = user.wishlist;
        return res.status(200).json({
          wishlist: wishlist,
        });
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching wishlist", error);
    }
  }

  async removeFromWishlist(req: Request, res: Response) {
    try {
      const user = await User.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            wishlist: {
              _id: req.body.item._id,
            },
          },
        }
      );
      if (user.acknowledged) {
        return res.status(200).json({
          message: "item removed from wishlist",
        });
      } else {
        return res.status(404).json({
          message: "item not found",
        });
      }
    } catch (error) {
      console.error("error removing item from wishlist", error);
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const itemID = req.body.item._id;
        const userCart = user.cart;
        const temp = userCart.filter((item) => item.id === itemID);
        if (temp.length > 0) {
          return res.status(400).json({
            message: "item already exist in cart",
          });
        }
        user.cart.push(req.body.item);
        user.save().then(() => {
          return res.status(200).json({
            message: "item added to cart",
          });
        });
      }
    } catch (error) {
      console.error("error adding item to cart", error);
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const user = await User.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            cart: {
              _id: req.body.item._id,
            },
          },
        }
      );
      if (user.acknowledged) {
        return res.status(200).json({
          message: "item removed from cart",
        });
      } else {
        return res.status(404).json({
          message: "item not found",
        });
      }
    } catch (error) {
      console.error("error removing item from cart", error);
    }
  }

  async viewCart(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        const cart = user.cart;
        return res.status(200).json({
          cart: cart,
        });
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    } catch (error) {
      console.error("error fetching cart", error);
    }
  }
}

export default UserController;