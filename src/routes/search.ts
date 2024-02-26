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

const transformData = (data: response): item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    name: data.name._attributes.value,
    yearPublished: data.yearpublished?._attributes.value,
  };
};

export const search = async (params: params): Promise<item[]> => {
  const { data } = await axios.get("/search", { params });

  if (!data.items.item) return [];

  return data.items.item.map((data: response) => {
    return transformData(data);
  });
};

export const searchExact = async (params: params): Promise<item | null> => {
  const { data } = await axios.get("/search", {
    params: {
      ...params,
      exact: true,
    },
  });
  if (!data.items.item) return null;
  return transformData(data.items.item);
};
