import User from "../../models/User.js";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import { generateAuthToken, generateRefreshToken } from "../../services/tokens.js";

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const user = await User.findOne({ email: profile.emails[0].value });
        let userObject;
        
        if (user) {
            if(!user.isGoogleUser || !user.googleId) {
                user.isGoogleUser = true;
                user.googleId = profile.id;
                await user.save();
            }
            userObject = user;
        } else {
            // Create new user
            const newUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                isGoogleUser: true
            });
            await newUser.save();
            userObject = newUser;
        }
    
        return cb(null, userObject);
    } catch (error) {
        return cb(error, false);
    }
});

export async function startOAuth(req, res, next) {
    const state = Math.random().toString(36).substring(2, 15);
    req.session = req.session || {};
    req.session.oauthState = state;
    
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: state 
    })(req, res, next);
}

export async function completeOAuth(req, res) {
    const { userId } = req.body;
    const fingerprint = req.headers["x-fp"];
    
    if (!fingerprint || !userId) {
        return res.status(400).json({ error: "User ID and fingerprint are required" });
    }
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const token = generateAuthToken(user._id, fingerprint, 
            `${process.env.ACCESS_TOKEN_EXPIRATION_MINUTES || 15}m`);
        const refreshToken = generateRefreshToken(user._id, fingerprint, 
            `${process.env.REFRESH_TOKEN_EXPIRATION_DAYS || 7}d`);
        
        res.header("Authorization", `Bearer ${token}`);
        res.cookie("securefp", fingerprint, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: process.env.FINGERPRINT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
            sameSite: "none" 
        });
        res.cookie("tokenrf", refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: process.env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
            sameSite: "none" 
        });
        
        res.json({ message: "OAuth login completed successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to complete OAuth login" });
    }
}

