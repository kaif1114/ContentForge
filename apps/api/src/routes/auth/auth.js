import express from "express";
import refresh from "./refresh.js";
import register from "./register.js";
import verify from "./verify.js";
import { auth } from "../../middleware/auth.js";
import passport from "passport";
import login from "./login.js";
import { completeOAuth, startOAuth, googleStrategy } from "./google.js";

const router = express.Router();
passport.use(googleStrategy);

router.post("/", login);
router.get("/refresh", refresh);
router.post("/register", register);
router.get("/google", startOAuth);

router.get("/google/callback", 
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/login' 
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?userId=${req.user._id}`);
    }
);

router.post("/complete-oauth", completeOAuth);

router.get("/verify", auth, verify);
export default router;
