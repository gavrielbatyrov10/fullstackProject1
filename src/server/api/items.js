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
    });
    res.json(items);
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
