import User from "../../models/User.js";

async function me(req, res) {
    const user = await User.findById(req.user);
    res.json({
        id: user._id.toString(),
        email: user.email, 
        name: user.name
    });
  }

export default me;