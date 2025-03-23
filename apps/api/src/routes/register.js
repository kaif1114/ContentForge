import express from "express";
import User, {userSchema} from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

router.post("/", async (req, res) => {
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

    res.header("x-auth-token", user.generateAuthToken())
    res.json({id: user._id, name: user.name, email: user.email});
});

export default router;
