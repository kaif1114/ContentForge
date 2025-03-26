import express from "express";
import z from "zod";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { generateAuthToken, generateRefreshToken } from "../../services/tokens.js";
import refresh from "./refresh.js";
import register from "./register.js";
const router = express.Router();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

async function login(req, res) {
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
    const token = generateAuthToken(user._id);
    res.header("Authorization", `Bearer ${token}`)
    res.cookie("x-rf-token", generateRefreshToken(user._id, "3d"), { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3 * 24 * 60 * 60 * 1000, sameSite: "lax" });
    res.json({message: "Logged in successfully"});
}

router.post("/", login);
router.get("/refresh", refresh);
router.post("/register", register);

export default router;
