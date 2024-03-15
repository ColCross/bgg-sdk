import {
  boardgame,
  boardgameaccessory,
  boardgamecompilation,
  boardgameexpansion,
  boardgameimplementation,
  boardgameintegration,
  rpg,
  rpgitem,
  videogame,
} from "~/routes/types";

export type ParamsBase = {
  minDate?: string;
  maxDate?: string;
  subtype?: Array<
    | boardgame
    | boardgameexpansion
    | boardgameaccessory
    | boardgameintegration
    | boardgamecompilation
    | boardgameimplementation
    | rpg
    | rpgitem
    | videogame
  >;
  page?: number;
};

export type ApiResponseAttributesBase = {
  total: string;
  page: string;
  termsofuse: string;
};

export type ApiResponseBase<T, Q> = {
  plays: {
    _attributes: T;
    play: Q | Q[];
  };
};
