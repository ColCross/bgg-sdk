import axios from "~/lib/axios";

type args = {
  query: string;
  type?: Array<
    boardgame | boardgameaccessory | boardgameexpansion | rpgitem | videogame
  >;
  exact?: boolean;
};

type params = Omit<args, "type"> & {
  type?: string;
};

const getParams = (args: args): params => {
  return {
    ...args,
    type: args.type ? args.type.join(",") : undefined,
  };
};

type response = {
  items: {
    _attributes: { total: string; termsofuse: string };
    item?: responseBody | responseBody[];
  };
};

type responseBody = {
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

const transformData = (data: responseBody): item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    name: data.name._attributes.value,
    yearPublished: data.yearpublished?._attributes.value,
  };
};

export const search = async (args: args): Promise<item[]> => {
  const params = getParams(args);
  const { data } = await axios.get<response>("/search", { params });

  if (data.items.item === undefined) return [];

  if (Array.isArray(data.items.item)) {
    return data.items.item.map((data) => transformData(data));
  }

  return [transformData(data.items.item)];
};
