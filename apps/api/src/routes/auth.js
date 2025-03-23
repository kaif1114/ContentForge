import express from "express";
import z from "zod";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

router.post("/", async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
    }
    const { email, password } = validation.data;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    res.header("x-auth-token", user.generateAuthToken())
    res.json({message: "Logged in successfully"});
});

export default router;
