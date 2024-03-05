import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

type Args = {
  id: string[];
  type?: Array<rpg | rpgperiodical | boardgamefamily>;
};

type Params = Omit<Args, "id" | "type"> & {
  id: string;
  type?: string;
};

const getParams = (args: Args): Params => {
  return {
    ...args,
    id: args.id.join(","),
    type: args.type ? args.type.join(",") : undefined,
  };
};

type ApiResponseName = {
  _attributes: {
    type: string;
    sortindex: string;
    value: string;
  };
};

type ApiResponseLink = {
  _attributes: {
    type: string;
    id: string;
    value: string;
    inbound: string;
  };
};

type ApiResponseBody = {
  _attributes: {
    type: string;
    id: string;
  };
  thumbnail: {
    _text: string;
  };
  image: {
    _text: string;
  };
  name: ApiResponseName | ApiResponseName[];
  description: {
    _text: string;
  };
  link: ApiResponseLink | ApiResponseLink[];
};

type ApiResponse = {
  items?: {
    _attributes: { termsofuse: string };
    item?: ApiResponseBody | ApiResponseBody[];
  };
};

type Item = {
  id: string;
  type: string;
  thumbnail: string;
  image: string;
  description: string;
  names: {
    type: string;
    sortindex: string;
    value: string;
  }[];
  links: {
    type: string;
    id: string;
    value: string;
    inbound: boolean;
  }[];
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
    thumbnail: data.thumbnail._text,
    image: data.image._text,
    description: data.description._text,
    names: enforceArray(data.name).map((name) => ({
      type: name._attributes.type,
      sortindex: name._attributes.sortindex,
      value: name._attributes.value,
    })),
    links: enforceArray(data.link).map((link) => ({
      type: link._attributes.type,
      id: link._attributes.id,
      value: link._attributes.value,
      inbound: link._attributes.inbound === "true",
    })),
  };
};

export const family = async (args: Args): Promise<Payload | null> => {
  const params = getParams(args);
  const { data } = await axios.get<ApiResponse>("/family", {
    params,
  });

  if (!data.items) return null;

  return {
    attributes: {
      termsofuse: data.items._attributes.termsofuse,
    },
    items: enforceArray(data.items.item).map((data) => transformData(data)),
  };
};
