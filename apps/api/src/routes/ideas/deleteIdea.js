import { Idea } from "../../models/Idea.js";
async function deleteIdea(req, res) {
  const { id } = req.params;
  const user = req.user;
  const idea = await Idea.deleteOne({ _id: id, user: user });
  if (idea.deletedCount === 0) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  res.status(200).json({ message: "Idea deleted" });
}

export default deleteIdea;
