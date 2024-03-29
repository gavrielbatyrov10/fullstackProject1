const { ServerError } = require("../errors");
const prisma = require("../prisma");

const router = require("express").Router();
module.exports = router;

//  we are getting all the items and we are also searching by the description
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    const items = await prisma.item.findMany({
      where: {
        description: {
          contains: search,
        },
      },
      include: {
        Review: true,
      },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // this turns it into an int
    const id = parseInt(req.params.id);

    const item = await prisma.item.findUnique({
      // this gets the specific item from the item id
      where: { id: id },
      include: {
        Review: true,
      },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});
// this checks if the user is logged in
router.use((req, res, next) => {
  if (!res.locals.user) {
    return next(new ServerError(401, "You must be logged in."));
  }
  next();
});
/** Creates new items and sends it */
router.post("/", async (req, res, next) => {
  try {
    const { description, imageUrl } = req.body;
    if (!description) {
      throw new ServerError(400, "Description required.");
    }
    const userId = res.locals.user.id;
    const item = await prisma.item.create({
      data: {
        description,
        imageUrl,
        userId: userId,
      },
    });
    res.json(item);
  } catch (err) {
    // this returns the error message with the status code
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});
// delete
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.item.delete({
      where: {
        id: id,
      },
      include: {
        Review: true,
      },
    });
    res.json({ status: 200, message: "Item deleted successfully." });
  } catch (err) {
    next(err);
  }
});

router.put("/:itemId", async (req, res, next) => {
  try {
    const userId = res.locals.user.id;

    const itemId = parseInt(req.params.itemId);
    const { description, imageUrl } = req.body;
    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });
    res.json(item);
    if (!item) {
      return next({
        status: 404,
        message: "Item not found.",
      });
    }
    if (item.userId !== userId) {
      return next({
        status: 403,
        message: "You are not allowed to edit this item.",
      });
    }
    // this finds the review that has the specific id then updates it
    const itemUpdated = await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        description: description,
        imageUrl: imageUrl,
      },
    });

    return res.json({
      status: 200,
      message: "item updated successfully.",
      item: itemUpdated,
    });
  } catch (error) {
    return next({
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
});
