import express from "express";
import userCtrl from "../controllers/user.controller";

const router = express.Router();

router.post("/api/v1/user/postuser", async (req, res) => {
  try {
    const profile = req.body;

    // Call controller method to create or update user
    const user = await userCtrl.postUser(profile);

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save or update user" });
  }
});

export default router;
