const { ServerError } = require("../errors");
const prisma = require("../prisma");

const router = require("express").Router();
module.exports = router;

/** User must be logged in to access tasks. */
router.use((req, res, next) => {
  if (!res.locals.user) {
    return next(new ServerError(401, "You must be logged in."));
  }
  next();
});

/** Creates new items and sends it */
router.post("/", async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description) {
      throw new ServerError(400, "Description required.");
    }

    const item = await prisma.item.create({
      data: {
        description,
      },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});
