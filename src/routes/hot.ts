import axios from "~/lib/axios";

// TODO: Support typing for multiple types query
type params = {
  type:
    | boardgame
    | videogame
    | "rpg"
    | "boardgameperson"
    | "rpgperson"
    | "boardgamecompany"
    | "rpgcompany"
    | "videogamecompany"
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

export const hot = async (params?: params): Promise<item[]> => {
  const { data } = await axios.get("/hot", { params });

  return data.items.item.map(
    (item: response) => {
      return {
        id: item._attributes.id,
        rank: item._attributes.rank,
        name: item.name._attributes.value,
        yearpublished: item.yearpublished?._attributes.value,
        thumbnail: item.thumbnail._attributes.value,
      };
    }
  );
};

