import axios from "~/lib/axios";

// TODO: Support typing for multiple types query
type params = {
  query: string;
  type?:
    | videogame
    | boardgame
    | "rpgitem"
    | "boardgameaccessory"
    | "boardgameexpansion";
};

export const search = (params: params) => {};
