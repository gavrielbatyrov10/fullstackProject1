const prisma = require("../prisma");
/** Seeds the database with users, items, reviews, and comments */

const seed = async () => {
  try {
    // Create users or update if username already exists
    const user1 = await prisma.user.upsert({
      where: { username: "user1" },
      update: {},
      create: {
        username: "user1",
        password: "password1",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { username: "user2" },
      update: {},
      create: {
        username: "user2",
        password: "password2",
      },
    });

    const users = [user1, user2];

    // Create items, reviews, and comments for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      for (let j = 1; j <= 3; j++) {
        // Create items
        const item = await prisma.item.create({
          data: {
            description: `Item ${j} description for ${user.username}`,
            userId: user.id,
            imageUrl:
              "https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg",
          },
        });
        // Create reviews
        const review = await prisma.review.create({
          data: {
            rating: Math.floor(Math.random() * 5) + 1,
            userId: user.id,
            itemId: item.id,
            reviewText: `Review ${j} for ${user.username}'s item`,
          },
        });

        // Create comments
        for (let k = 1; k <= 2; k++) {
          await prisma.comment.create({
            data: {
              body: `Comment ${k} for ${user.username}'s item ${j}`,
              userId: user.id,
              reviewId: review.id,
            },
          });
        }
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
