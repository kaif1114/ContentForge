import Schedule from "../../models/Schedule.js";

async function getSchedule(req, res) {
  const month = parseInt(req.query.month) || new Date().getMonth();
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const schedules = await Schedule.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $month: "$scheduleDate" }, month] },
            { $eq: [{ $year: "$scheduleDate" }, year] },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "contents",
        localField: "postId",
        foreignField: "posts._id",
        as: "contentData",
      },
    },
    { $unwind: "$contentData" },
    {
      $addFields: {
        postData: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$contentData.posts",
                cond: { $eq: ["$$this._id", "$postId"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        platform: 1,
        scheduleDate: 1,
        "postData.title": 1,
        "postData.description": 1,
        "postData.tags": 1,
        "postData.platform": 1,
        "postData.createdAt": 1,
        "postData.updatedAt": 1,
        "postData.status": 1,
        "postData.length": 1,
        "postData.tone": 1,
        "postData.customLength": 1,
        "postData._id": 1,
      },
    },
  ]);

  if (!schedules || schedules.length === 0) {
    return res.status(404).json({ message: "No schedule found" });
  }
  const responseData = schedules.map((item) => ({
    _id: item._id,
    scheduleDate: item.scheduleDate,
    platform: item.platform,
    post: item.postData,
  }));
  res.json(responseData);
}

export default getSchedule;
