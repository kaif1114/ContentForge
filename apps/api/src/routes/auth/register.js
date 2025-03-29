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
    const fingerprint = req.headers["x-fp"];
    if (!fingerprint) { 
        return res.status(400).json({ error: "Fingerprint is required" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashedPassword, fingerprint, isGoogleUser: false });

    const token = generateAuthToken(user._id, fingerprint, `${process.env.ACCESS_TOKEN_EXPIRATION_MINUTES || 15}m`);
    const refreshToken = generateRefreshToken(user._id, fingerprint, `${process.env.REFRESH_TOKEN_EXPIRATION_DAYS || 7}d`)

    res.header("Authorization", `Bearer ${token}`)
    res.cookie("securefp", fingerprint, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: process.env.FINGERPRINT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
     });
    res.cookie("tokenrf", refreshToken, { 
        httpOnly: true, 
        ecure: process.env.NODE_ENV === "production", 
        maxAge: process.env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
        domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost" 
    });
    
    res.json({ name: user.name, email: user.email});
};

