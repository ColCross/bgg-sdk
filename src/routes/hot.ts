import axios from "~/lib/axios";

type args = {
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

type params = Omit<args, "type"> & {
  type: string;
};

const getParams = (args?: args): params | undefined => {
  if (!args) return undefined;

  return {
    type: args.type.join(","),
  };
};

type response = {
  items: {
    _attributes: { termsofuse: string };
    item?: responseBody | responseBody[];
  };
};

type responseBody = {
  _attributes: { id: string; rank: string };
  name: { _attributes: { value: string } };
  yearpublished?: { _attributes: { value: string } };
  thumbnail: { _attributes: { value: string } };
};

type item = {
  id: string;
  rank: string;
  name: string;
  yearpublished?: string;
  thumbnail: string;
};

const transformData = (data: responseBody): item => {
  return {
    id: data._attributes.id,
    rank: data._attributes.rank,
    name: data.name._attributes.value,
    yearpublished: data.yearpublished?._attributes.value,
    thumbnail: data.thumbnail._attributes.value,
  };
};

export const hot = async (args?: args): Promise<item[]> => {
  const params = getParams(args);
  const { data } = await axios.get<response>("/hot", {
    params,
  });

  if (!data.items.item) return [];

  if (Array.isArray(data.items.item)) {
    return data.items.item.map((data) => transformData(data));
  }

  return [transformData(data.items.item)];
};
