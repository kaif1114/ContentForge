import jwt from "jsonwebtoken";
import { generateAuthToken, generateRefreshToken } from "../../services/tokens.js";

 export default async function refresh(req, res){
    const refreshToken = req.cookies["tokenrf"];
    const fingerprint = req.cookies["securefp"];
    if (!refreshToken || !fingerprint) return res.status(401).send("Access denied. No refresh token or fingerprint provided.");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded)=>{
        if (err) return res.status(401).send("Access denied. Invalid refresh token.");
        if (fingerprint !== decoded.fingerprint) return res.status(401).send("Access denied. Invalid fingerprint.");
        const token = generateAuthToken(decoded.id, fingerprint, `${process.env.ACCESS_TOKEN_EXPIRATION_MINUTES || 15}m`);
        const refreshToken = generateRefreshToken(decoded.id, fingerprint, `${process.env.REFRESH_TOKEN_EXPIRATION_DAYS || 7}d`);
      
        res.cookie("tokenrf", refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: process.env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
            domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost" });
        // res.cookie("securefp", fingerprint, { 
        //         httpOnly: true, 
        //         secure: process.env.NODE_ENV === "production", 
        //         maxAge: process.env.FINGERPRINT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000, 
        //         sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
        //         domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost" 
        //     });
        res.header("Authorization", `Bearer ${token}`)
        res.json({ message: "Tokens refreshed successfully" });
    });
    
};


