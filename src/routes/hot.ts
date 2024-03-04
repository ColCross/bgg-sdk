import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

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

type Response = {
  items: {
    _attributes: { termsofuse: string };
    item?: ResponseBody | ResponseBody[];
  };
};

type ResponseBody = {
  _attributes: { id: string; rank: string };
  name: { _attributes: { value: string } };
  yearpublished?: { _attributes: { value: string } };
  thumbnail: { _attributes: { value: string } };
};

type Item = {
  id: string;
  rank: string;
  name: string;
  yearpublished?: string;
  thumbnail: string;
};

const transformData = (data: ResponseBody): Item => {
  return {
    id: data._attributes.id,
    rank: data._attributes.rank,
    name: data.name._attributes.value,
    yearpublished: data.yearpublished?._attributes.value,
    thumbnail: data.thumbnail._attributes.value,
  };
};

export const hot = async (args?: Args): Promise<Item[]> => {
  const params = getParams(args);
  const { data } = await axios.get<Response>("/hot", {
    params,
  });

  return enforceArray(data.items?.item).map((data) => transformData(data));
};
