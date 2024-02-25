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
  exact?: true;
};

type response = {
  _attributes: { type: string; id: string };
  name: { _attributes: { type: string; value: string } };
  yearpublished?: { _attributes: { value: string } };
};

type item = {
  id: string;
  type: string;
  name: string;
  yearPublished?: string;
};

const transformItem = (item: response): item => {
  return {
    id: item._attributes.id,
    type: item._attributes.type,
    name: item.name._attributes.value,
    yearPublished: item.yearpublished?._attributes.value,
  };
};

export const search = async (params: params): Promise<item[]> => {
  const { data } = await axios.get("/search", { params });

  if (!data.items.item) return [];

  // If using exact search, the response will be an object
  if (!Array.isArray(data.items.item)) {
    return [transformItem(data.items.item)];
  }

  return data.items.item.map((item: response) => {
    return transformItem(item);
  });
};
