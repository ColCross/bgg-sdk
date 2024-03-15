import * as collection from "~/routes/collection";
import * as family from "~/routes/family";
import * as guild from "~/routes/guild";
import * as hot from "~/routes/hot";
import * as plays from "~/routes/plays";
import * as search from "~/routes/search";
import * as thing from "~/routes/thing";
import * as user from "~/routes/user";

export const bgg = {
  ...collection,
  ...family,
  ...guild,
  ...hot,
  ...search,
  ...thing,
  ...user,
  plays: { ...plays },
};
