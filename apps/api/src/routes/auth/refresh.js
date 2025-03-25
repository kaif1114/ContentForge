import router from "./auth.js"
import jwt from "jsonwebtoken";
import { generateAuthToken } from "../../services/tokens.js";

 export default async function refresh(req, res){
    const refreshToken = req.cookies["x-rf-token"];
    if (!refreshToken) return res.status(401).send("Access denied. No refresh token provided.");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async(err, decoded)=>{
        if (err) return res.status(401).send("Access denied. Invalid refresh token.");
        const token = generateAuthToken(decoded.id);
        res.header("Authorization", `Bearer ${token}`)
        res.json({ message: "Token refreshed successfully" });
    });
    
};


