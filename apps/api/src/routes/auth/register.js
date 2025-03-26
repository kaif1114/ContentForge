import router from "./auth.js";
import User, {userSchema} from "../../models/User.js";
import bcrypt from "bcrypt";
import { generateAuthToken, generateRefreshToken } from "../../services/tokens.js";

const saltRounds = 10;

export default async function register(req, res)  {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
    }
    const { name, email, password } = validation.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateAuthToken(user._id);
    res.header("Authorization", `Bearer ${token}`)
    res.cookie("x-rf-token", generateRefreshToken(user._id, "3d"), { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3 * 24 * 60 * 60 * 1000, sameSite: "lax" });
    res.json({ name: user.name, email: user.email});
};

