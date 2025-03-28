import z from "zod";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { generateAuthToken, generateRefreshToken } from "../../services/tokens.js";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export default async function login(req, res) {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
    }
    const { email, password } = validation.data;
    const user = await User.findOne({ email });
    if (!user || user.isGoogleUser) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const fingerprint = req.headers["x-fp"];
    if (!fingerprint) {
        return res.status(401).json({ error: "Fingerprint is required" });
    }

    const token = generateAuthToken(user._id, fingerprint, `${process.env.ACCESS_TOKEN_EXPIRATION_MINUTES || 15}m`);
    const refreshToken = generateRefreshToken(user._id, fingerprint, `${process.env.REFRESH_TOKEN_EXPIRATION_DAYS || 7}d`)

    res.header("Authorization", `Bearer ${token}`)
    res.cookie("securefp", fingerprint, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: process.env.FINGERPRINT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost" });
    res.cookie("tokenrf", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: process.env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost" });
    
    res.json({message: "Logged in successfully"});
}