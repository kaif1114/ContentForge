import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    jwt.verify(token, process.env.JWT_AUTH_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Access denied. Invalid token.");
        req.user = decoded;
        next();
    } );
    
}
