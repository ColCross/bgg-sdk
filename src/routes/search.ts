import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";
import {
  boardgame,
  boardgameaccessory,
  boardgameexpansion,
  rpgitem,
  videogame,
} from "~/routes/types";

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

type ApiResponseBody = {
  _attributes: { type: string; id: string };
  name: { _attributes: { type: string; value: string } };
  yearpublished: { _attributes: { value: string } };
};

type ApiResponse = {
  items: {
    _attributes: { total: string; termsofuse: string };
    item?: ApiResponseBody | ApiResponseBody[];
  };
};

type Item = {
  id: string;
  type: string;
  name: string;
  yearPublished: string;
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
    type: data._attributes.type,
    name: data.name._attributes.value,
    yearPublished: data.yearpublished._attributes.value,
  };
};

export const search = async (args: Args): Promise<Payload> => {
  const params = getParams(args);
  const { data } = await axios.get<ApiResponse>("/search", { params });

  return {
    attributes: {
      termsofuse: data.items._attributes.termsofuse,
    },
    items: enforceArray(data.items.item).map((data) => transformData(data)),
  };
};
