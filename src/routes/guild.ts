import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

type Params = {
  id: string;
  members?: true;
  sort?: "username" | "date";
  page?: string;
};

type ApiResponseError = {
  _attributes: {
    id: string;
    termsofuse: string;
  };
  error: {
    _text: string;
  };
};

type ApiResponseSuccess = {
  _attributes: {
    id: string;
    name: string;
    created: string;
    termsofuse: string;
  };
  category: { _text: string };
  website: { _text: string };
  manager: { _text: string };
  description: { _text: string };
  location: {
    addr1: { _text?: string };
    addr2: { _text?: string };
    city: { _text?: string };
    stateorprovince?: { _text: string };
    postalcode?: { _text: string };
    country?: { _text: string };
  };
  members?: {
    _attributes: { count: string; page: string };
    member: {
      _attributes: { name: string; date: string };
    }[];
  };
};

type ApiResponse = {
  guild: ApiResponseSuccess | ApiResponseError;
};

type Guild = {
  id: string;
  name: string;
  created: string;
  category: string;
  website: string;
  manager: string;
  description: string;
  location: {
    addr1?: string;
    addr2?: string;
    city?: string;
    stateorprovince?: string;
    postalcode?: string;
    country?: string;
  };
  members?: {
    count: string;
    page: string;
    member: {
      name: string;
      date: string;
    }[];
  };
};

type Payload = {
  attributes: {
    termsOfUse: string;
  };
  guild: Guild | null;
};

const transformData = (data: ApiResponse): Guild | null => {
  if ("error" in data.guild) return null;

  return {
    id: data.guild._attributes.id,
    name: data.guild._attributes.name,
    created: data.guild._attributes.created,
    category: data.guild.category._text,
    website: data.guild.website._text,
    manager: data.guild.manager._text,
    description: data.guild.description._text,
    location: {
      addr1: data.guild.location.addr1._text,
      addr2: data.guild.location.addr2._text,
      city: data.guild.location.city._text,
      stateorprovince: data.guild.location.stateorprovince?._text,
      postalcode: data.guild.location.postalcode?._text,
      country: data.guild.location.country?._text,
    },
    members: data.guild.members && {
      count: data.guild.members._attributes.count,
      page: data.guild.members._attributes.page,
      member: enforceArray(data.guild.members.member).map((member) => ({
        name: member._attributes.name,
        date: member._attributes.date,
      })),
    },
  };
};

export const guild = async (params: Params): Promise<Payload> => {
  const { data } = await axios.get<ApiResponse>("/guild", {
    params,
  });

  return {
    attributes: {
      termsOfUse: data.guild._attributes.termsofuse,
    },
    guild: transformData(data),
  };
};
