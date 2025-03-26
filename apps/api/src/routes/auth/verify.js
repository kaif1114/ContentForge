export default async function verify(req, res) {
    if(req.user) {
        return res.status(200).json({ message: "User is verified" });
    } else {
        return res.status(401).json({ message: "User is not verified" });
    }
}


