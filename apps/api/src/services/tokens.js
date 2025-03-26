import jwt from "jsonwebtoken";

export function generateAuthToken(id, fingerprint, expiresIn = "30m") {
    const token = jwt.sign({ id, fingerprint }, process.env.JWT_AUTH_SECRET, { expiresIn });
    return token;
}

export function generateRefreshToken(id, fingerprint, expiresIn = "3d") {
    const token = jwt.sign({ id, fingerprint }, process.env.JWT_REFRESH_SECRET, { expiresIn });
    return token;
}