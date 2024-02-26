import axios from "~/lib/axios";

type args = {
  type: Array<
    | boardgame
    | videogame
    | "rpg"
    | "boardgameperson"
    | "rpgperson"
    | "boardgamecompany"
    | "rpgcompany"
    | "videogamecompany"
  >;
};

type params = {
  type: string;
};

const getParams = (args?: args): params | undefined => {
  if (!args) return undefined;

  return {
    type: args.type.join(","),
  };
};

type response = {
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

export const hot = async (args?: args): Promise<item[]> => {
  const params = getParams(args);
  const { data } = await axios.get("/hot", { params });

  if (!data.items.item) return [];

  return data.items.item.map((data: response) => {
    return {
      id: data._attributes.id,
      rank: data._attributes.rank,
      name: data.name._attributes.value,
      yearpublished: data.yearpublished?._attributes.value,
      thumbnail: data.thumbnail._attributes.value,
    };
  });
};
