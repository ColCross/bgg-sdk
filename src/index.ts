import * as hot from "~/routes/hot";
import * as search from "~/routes/search";
import * as thing from "~/routes/thing";

export const bgg = {
  ...hot,
  ...search,
  ...thing,
};
