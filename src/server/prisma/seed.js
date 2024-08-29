const prisma = require("../prisma");
/** Seeds the database with users, items, reviews, and comments */

const seed = async () => {
  try {
    // Array of usernames and passwords
    const usernames = Array.from({ length: 20 }, (_, i) => `user${i + 1}`);
    const passwords = Array.from({ length: 20 }, (_, i) => `password${i + 1}`);

    // Array of different image URLs
    const imageUrls = [
      "https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg",
      "https://www.princeton.edu/sites/default/files/styles/1x_full_2x_half_crop/public/images/2022/02/KOA_Nassau_2697x1517.jpg?itok=Bg2K7j7J",
      "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/top-20-small-dog-breeds.jpeg.jpg",
      "https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg",
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg",
      "https://cdn.britannica.com/92/212692-050-D53981F5/labradoodle-dog-stick-running-grass.jpg",
      "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2021/07-06/small+white+fluffy+dog+smiling+at+the+camera+in+close-up-min.jpg",
      "https://www.akc.org/wp-content/uploads/2017/11/Golden-Retriever-Puppy.jpg",
      "https://www.cdc.gov/healthy-pets/media/images/2024/04/GettyImages-598175960-cute-dog-headshot.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/800px-Huskiesatrest.jpg",
      "https://www.thesprucepets.com/thmb/y4YEErOurgco9QQO-zJ6Ld1yVkQ=/3000x0/filters:no_upscale():strip_icc()/english-dog-breeds-4788340-hero-14a64cf053ca40f78e5bd078b052d97f.jpg",
      "https://i.guim.co.uk/img/media/e551814760cef0ed8182b829d31ec3f1465ecf16/0_121_640_384/master/640.jpg?width=1200&quality=85&auto=format&fit=max&s=1329df53a21b3187bce1461694a739ea",
      "https://www.purina.co.uk/sites/default/files/2020-12/Dog_1098119012_Teaser.jpg",
      "https://d.newsweek.com/en/full/2390494/husky-dog-bed.jpg?w=1600&h=1600&q=88&f=609d037e16316bf30c8755d787c3b1f0",
      "https://www.usatoday.com/gcdn/authoring/authoring-images/2024/04/25/PMJS/73459685007-240425-local-wisconsin-humane-society-p-3.jpg?crop=4957,2789,x0,y193&width=3200&height=1801&format=pjpg&auto=webp",
      "https://image.petmd.com/files/styles/978x550/public/dog-allergies.jpg",
      "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/4e17ec01-850d-4fda-a446-e68ff71854ba/German+Shepherds+dans+pet+care.jpeg",
      "https://petcomments.com/i/r/400x-/media/p/348/german-shepherd.jpg",
      "https://www.bluecross.org.uk/sites/default/files/d8/styles/theme_feature_extra_large/public/2021-03/Stressed%20dog.jpg.webp?itok=wTUs61N_",
      "https://s.abcnews.com/images/Video/GTY_dog_day_jef_160826_16x9_992.jpg",
    ];

    const users = [];

    // Create users or update if username already exists
    for (let i = 0; i < 20; i++) {
      const user = await prisma.user.upsert({
        where: { username: usernames[i] },
        update: {},
        create: {
          username: usernames[i],
          password: passwords[i],
        },
      });
      users.push(user);
    }

    // Create items, reviews, and comments for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      for (let j = 1; j <= 5; j++) {
        // Reduced the number of items for brevity
        // Create items
        const item = await prisma.item.create({
          data: {
            description: `Item ${j} description for ${user.username}`,
            userId: user.id,
            imageUrl: imageUrls[(i * 5 + j) % imageUrls.length], // Assign different images
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
