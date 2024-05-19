import { Prisma } from "@prisma/client";
import { RatingsCreateData } from "@src/Types";
import { prisma } from "@src/db";

const ratingExtension = Prisma.defineExtension({
  model: {
    ratings: {
      createRating: async (data: RatingsCreateData)=>{
        console.log("This is query");
        return await prisma.ratings.create({
          data,
        });
      },
    },
  },
});

export { ratingExtension };
