import * as collection from "~/routes/collection";
import * as hot from "~/routes/hot";
import * as search from "~/routes/search";
import * as thing from "~/routes/thing";

export const bgg = {
  ...collection,
  ...hot,
  ...search,
  ...thing,
};
