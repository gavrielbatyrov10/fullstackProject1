const prisma = require("../prisma");

/** Seeds the database with a user and some items */

// TODO: Add seed data, and be able to programatically seed the DB in this file
const seed = async () => {
  try {
    // Create users
    const user1 = await prisma.user.create({
      data: {
        username: "uniqueeesasdaduser11131",
        password: "passwo4rd1",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        username: "unfdiadsduser21232",
        password: "passwo4rd2",
      },
    });

    // Create items
    const item1 = await prisma.item.create({
      data: {
        description: "Item 1 description",
        userId: user1.id,
      },
    });

    const item2 = await prisma.item.create({
      data: {
        description: "Item 2 description",
        userId: user2.id,
      },
    });

    // Create reviews
    const review1 = await prisma.review.create({
      data: {
        rating: 5,
        userId: user1.id,
        itemId: item1.id,
        reviewText: "Great item!",
      },
    });

    const review2 = await prisma.review.create({
      data: {
        rating: 4,
        userId: user2.id,
        itemId: item2.id,
        reviewText: "Nice item!",
      },
    });

    // Create comments
    const comment1 = await prisma.comment.create({
      data: {
        body: "Comment 1",
        userId: user1.id,
        reviewId: review1.id,
      },
    });

    const comment2 = await prisma.comment.create({
      data: {
        body: "Comment 2",
        userId: user2.id,
        reviewId: review2.id,
      },
    });

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

// const seed = async () => {
//   await prisma.user.upsert({
//     where: {
//       username: "foo",
//     },
//     update: {},
//     create: {
//       username: "foo",
//       password: "bar",
//       tasks: {
//         create: [
//           { description: "task 1" },
//           { description: "task 2" },
//           { description: "task 3" },
//         ],
//       },
//     },
//   });
// };

// seed()
//   .then(async () => await prisma.$disconnect())
//   .catch(async (err) => {
//     console.error(err);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
