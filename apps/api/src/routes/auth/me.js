import { auth } from "../../middleware/auth.js";
import User from "../../models/User.js";

async function me(req, res) {
    const user = await User.findById(req.user);
    res.json({email: user.email, name: user.name});
  }

export default me;