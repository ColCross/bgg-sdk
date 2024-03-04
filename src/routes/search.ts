import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

type Args = {
  query: string;
  type?: Array<
    boardgame | boardgameaccessory | boardgameexpansion | rpgitem | videogame
  >;
  exact?: boolean;
};

type Params = Omit<Args, "type"> & {
  type?: string;
};

const getParams = (args: Args): Params => {
  return {
    ...args,
    type: args.type ? args.type.join(",") : undefined,
  };
};

type Response = {
  items: {
    _attributes: { total: string; termsofuse: string };
    item?: ResponseBody | ResponseBody[];
  };
};

type ResponseBody = {
  _attributes: { type: string; id: string };
  name: { _attributes: { type: string; value: string } };
  yearpublished: { _attributes: { value: string } };
};

type Item = {
  id: string;
  type: string;
  name: string;
  yearPublished: string;
};

const transformData = (data: ResponseBody): Item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    name: data.name._attributes.value,
    yearPublished: data.yearpublished._attributes.value,
  };
};

export const search = async (args: Args): Promise<Item[]> => {
  const params = getParams(args);
  const { data } = await axios.get<Response>("/search", { params });

  return enforceArray(data.items.item).map((data) => transformData(data));
};
