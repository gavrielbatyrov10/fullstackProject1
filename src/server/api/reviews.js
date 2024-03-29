const { ServerError } = require("../errors");
const prisma = require("../prisma");

const router = require("express").Router();
module.exports = router;

/** User must be logged in to access reviews. */
router.use((req, res, next) => {
  if (!res.locals.user) {
    return next(new ServerError(401, "You must be logged in."));
  }
  next();
});

/** Creates new reviews and sends it */
router.post("/", async (req, res, next) => {
  try {
    const { itemId, reviewText, rating } = req.body;
    if (!itemId) {
      throw new ServerError(400, "Item is required.");
    } else if (!reviewText) {
      throw new ServerError(400, "Review is required.");
    } else if (!rating) {
      throw new ServerError(400, "Rating is required.");
    }
    const userId = res.locals.user.id;
    const review = await prisma.review.create({
      data: {
        itemId: parseInt(itemId),
        reviewText: reviewText,
        rating: parseInt(rating),
        userId: userId,
      },
    });
    res.json(review);
  } catch (err) {
    next(err);
  }
});
// this gets all the reviews by the userId
router.get("/", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: res.locals.user.id },
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // this turns it into an int
    const id = parseInt(req.params.id);

    const review = await prisma.review.findUnique({
      // this gets the specific review from the review id
      where: { id: id },
    });
    res.json(review);
  } catch (err) {
    next(err);
  }
});
// this deletes it by the userId
router.delete("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    const userId = res.locals.user.id;
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (review.userId !== userId) {
      return next({
        status: 403,
        message: "You are not authorized to delete this review.",
      });
    }

    if (!review) {
      return next({
        status: 404,
        message: "Review not found.",
      });
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return res.json({ status: 200, message: "Review deleted successfully." });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});
// this updates it by the userId
router.put("/:reviewId", async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const reviewId = parseInt(req.params.reviewId);
    const { rating, reviewText } = req.body;
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
    if (review.userId !== userId) {
      return next({
        status: 403,
        message: "You are not allowed to edit this review.",
      });
    }
    // this finds the review that has the specific id then updates it
    const updatedReview = await prisma.review.update({
      where: {
        id: parseInt(reviewId),
      },
      data: {
        rating: parseInt(rating),
        reviewText: reviewText,
      },
    });

    return res.json({
      status: 200,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});
