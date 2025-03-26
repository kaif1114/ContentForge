import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader.split(" ")[1];
    const fingerprint = req.cookies["securefp"];
    if (!token || !fingerprint) return res.status(401).send("Access denied. No token or fingerprint provided.");

    jwt.verify(token, process.env.JWT_AUTH_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Access denied. Invalid token.");
        if (fingerprint !== decoded.fingerprint) return res.status(401).send("Access denied. Invalid fingerprint.");
        req.user = decoded.id;
        next();
    } );
    
}
