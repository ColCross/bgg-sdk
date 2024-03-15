import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";
import {
  boardgame,
  boardgamecompany,
  boardgameperson,
  rpg,
  rpgcompany,
  rpgperson,
  videogame,
  videogamecompany,
} from "~/routes/types";

type Args = {
  type: Array<
    | boardgame
    | boardgamecompany
    | boardgameperson
    | rpg
    | rpgcompany
    | rpgperson
    | videogame
    | videogamecompany
  >;
};

type Params = Omit<Args, "type"> & {
  type: string;
};

const getParams = (args?: Args): Params | undefined => {
  if (!args) return undefined;

  return {
    type: args.type.join(","),
  };
};

type ApiResponseBody = {
  _attributes: { id: string; rank: string };
  name: { _attributes: { value: string } };
  yearpublished: { _attributes: { value: string } };
  thumbnail: { _attributes: { value: string } };
};

type ApiResponse = {
  items: {
    _attributes: { termsofuse: string };
    item?: ApiResponseBody | ApiResponseBody[];
  };
};

type Item = {
  id: string;
  rank: string;
  name: string;
  yearPublished: string;
  thumbnail: string;
};

type Payload = {
  attributes: {
    termsofuse: string;
  };
  items: Item[];
};

const transformData = (data: ApiResponseBody): Item => {
  return {
    id: data._attributes.id,
    rank: data._attributes.rank,
    name: data.name._attributes.value,
    yearPublished: data.yearpublished._attributes.value,
    thumbnail: data.thumbnail._attributes.value,
  };
};

export const hot = async (args?: Args): Promise<Payload> => {
  const params = getParams(args);
  const { data } = await axios.get<ApiResponse>("/hot", {
    params,
  });

  return {
    attributes: {
      termsofuse: data.items._attributes.termsofuse,
    },
    items: enforceArray(data.items.item).map((data) => transformData(data)),
  };
};
