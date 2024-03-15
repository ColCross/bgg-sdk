import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

import {
  ApiResponseAttributesBase,
  ParamsBase,
  ApiResponseBase,
} from "~/routes/plays/types";

type Params = ParamsBase & {
  username: string;
};

type ApiResponseAttributes = ApiResponseAttributesBase & {
  username: string;
  userid: string;
};

type ApiResponseSubtype = {
  _attributes: {
    value: string;
  };
};

type ApiResponsePlay = {
  _attributes: {
    id: string;
    date: string;
    quantity: string;
    length: string;
    incomplete: string;
    nowinstats: string;
    location: string;
  };
  item: {
    _attributes: {
      name: string;
      objecttype: string;
      objectid: string;
    };
    subtypes: {
      subtype: ApiResponseSubtype | ApiResponseSubtype[];
    };
  };
};

type ApiResponse = ApiResponseBase<ApiResponseAttributes, ApiResponsePlay>;

type Payload = {
  attributes: {
    termsofuse: string;
    username: string;
    userid: string;
    total: string;
    page: string;
  };
  plays: Array<{
    id: string;
    date: string;
    quantity: string;
    length: string;
    incomplete: string;
    nowinstats: string;
    location: string;
    item: {
      name: string;
      objecttype: string;
      objectid: string;
      subtypes: string[];
    };
  }>;
};

const transformData = (data: ApiResponse): Payload => {
  return {
    attributes: {
      termsofuse: data.plays._attributes.termsofuse,
      username: data.plays._attributes.username,
      userid: data.plays._attributes.userid,
      total: data.plays._attributes.total,
      page: data.plays._attributes.page,
    },
    plays: enforceArray(data.plays.play).map((play) => ({
      id: play._attributes.id,
      date: play._attributes.date,
      quantity: play._attributes.quantity,
      length: play._attributes.length,
      incomplete: play._attributes.incomplete,
      nowinstats: play._attributes.nowinstats,
      location: play._attributes.location,
      item: {
        name: play.item._attributes.name,
        objecttype: play.item._attributes.objecttype,
        objectid: play.item._attributes.objectid,
        subtypes: enforceArray(play.item.subtypes.subtype).map(
          (subtype) => subtype._attributes.value,
        ),
      },
    })),
  };
};

export const username = async (params: Params): Promise<Payload> => {
  const { data } = await axios.get<ApiResponse>("/plays", { params });
  return transformData(data);
};
