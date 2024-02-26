import axios from "~/lib/axios";

type args = {
  query: string;
  type?: Array<
    | videogame
    | boardgame
    | "rpgitem"
    | "boardgameaccessory"
    | "boardgameexpansion"
  >;
};

type params = {
  query: string;
  type?: string;
  exact?: boolean;
};

const getParams = (args: args): params => {
  return {
    query: args.query,
    type: args.type ? args.type.join(",") : undefined,
  };
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

export const search = async (args: args): Promise<item[]> => {
  const params = getParams(args);
  const { data } = await axios.get("/search", { params });

  if (!data.items.item) return [];

  return data.items.item.map((data: response) => {
    return transformData(data);
  });
};

export const searchExact = async (args: args): Promise<item | null> => {
  const params = getParams(args);
  const { data } = await axios.get("/search", {
    params: {
      ...params,
      exact: true,
    },
  });

  if (!data.items.item) return null;
  return transformData(data.items.item);
};
