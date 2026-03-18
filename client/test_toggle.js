const { z } = require("zod");
const schema = z.object({
  sameHub: z.boolean()
});
console.log(schema.safeParse({sameHub: "on"}));
