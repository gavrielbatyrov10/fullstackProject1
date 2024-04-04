const router = require("express").Router();
const prisma = require("../prisma");
const { ServerError } = require("../errors");
module.exports = router;

// this creates a comment for the review id
router.post("/reviews/:reviewId", async (req, res, next) => {
  try {
    const userId = res.locals.user.id; //this is the user
    const reviewId = parseInt(req.params.reviewId); //this turns str into an int
    const { body } = req.body;
    if (!body) {
      throw new ServerError(400, "Comment body is required.");
    }

    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      return next({
        status: 404,
        message: "Review not found.",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        body: body,
        userId: userId,
        reviewId: reviewId,
      },
    });

    return res.json({
      status: 200,
      message: "Comment added successfully.",
      comment: comment,
    });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});

// its going to get all the comment of  a specific user id
router.get("/", async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const userComments = await prisma.comment.findMany({
      where: {
        userId: userId,
      },
      include: {
        review: true,
      },
    });

    return res.json({ status: 200, comments: userComments });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // this turns it into an int
    const id = parseInt(req.params.id);
    // this will find the comment
    const comment = await prisma.comment.findUnique({
      // this gets the specific comment from the comment id
      where: { id: id },
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// this  deletes the comment
router.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = res.locals.user.id;
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return next({
        status: 404,
        message: "Comment not found.",
      });
    }

    if (comment.userId !== userId) {
      return res.status(404).json({
        message: "You are not allowed to delete this comment.",
      });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res.json({ status: 200, message: "Comment deleted successfully." });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});

//  this is to update the comment by the comment id
// the url will be api/comments/the commentId
router.put("/:commentId", async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const commentId = parseInt(req.params.commentId);
    const { body } = req.body;
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return next({
        status: 404,
        message: "Comment not found.",
      });
    }
    if (comment.userId !== userId) {
      return res.status(404).json({
        message: "You are not allowed to edit this comment.",
      });
    }
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        body: body,
      },
    });

    return res.json({
      status: 200,
      message: "Comment updated successfully.",
      comment: updatedComment,
    });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});
