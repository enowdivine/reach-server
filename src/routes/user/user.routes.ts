import express, { Router } from "express";
import UserAuth from "./user.controller";

const router: Router = express.Router();
const user = new UserAuth();

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/forgot-password", user.forgotPassword);

router.get("/verification/:token", user.verifyEmail);
router.get("/user/:id", user.user);
router.get("/users", user.users);

router.put("/update-user/:id", user.update);
router.put("/update-password/:id", user.updatePassword);
router.put("/new-password/:id", user.newPassword);

// router.put("/add-to-wishlist/:id", user.addToWishlist);
// router.put("/remove-item-from-wishlist/:id", user.removeFromWishlist);
// router.get("/wishlist/:id", user.viewWishlist);

// router.put("/add-to-cart/:id", user.addToCart);
// router.put("/remove-item-from-cart/:id", user.removeFromCart);
// router.get("/cart/:id", user.viewCart);

router.delete("/delete-user/:id", user.deleteUser);
router.put("/deactivate-user/:id", user.updateStatus);

export default router;
