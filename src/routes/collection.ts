import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";
import {
  boardgame,
  boardgameaccessory,
  boardgameexpansion,
  rpgissue,
  rpgitem,
  videogame,
} from "~/routes/types";

type Args = {
  username: string;
  version?: true;
  subtype?:
    | boardgame
    | boardgameaccessory
    | boardgameexpansion
    | rpgissue
    | rpgitem
    | videogame;
  excludesubtype?: string;
  id?: Array<string>;
  brief?: true;
  stats?: true;
  own?: 0 | 1;
  rated?: 0 | 1;
  played?: 0 | 1;
  comment?: 0 | 1;
  trade?: 0 | 1;
  want?: 0 | 1;
  wishlist?: 0 | 1;
  wishlistpriority?: 1 | 2 | 3 | 4 | 5;
  preordered?: 0 | 1;
  wanttoplay?: 0 | 1;
  wanttobuy?: 0 | 1;
  prevowned?: 0 | 1;
  hasparts?: 0 | 1;
  wantparts?: 0 | 1;
  minrating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  minbggrating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  bggrating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  minplays?: number;
  maxplays?: number;
  showprivate?: true;
  collid?: number;
  modifiedsince?: string;
};

type Params = Omit<Args, "id"> & {
  id?: string;
};

const getParams = (args: Args): Params => {
  return {
    ...args,
    id: args.id?.join(",") || undefined,
  };
};

type ApiResponseBody = {
  _attributes: {
    objecttype: string;
    objectid: string;
    subtype: string;
    collid: string;
  };
  name: {
    _attributes: {
      sortindex: string;
    };
    _text: string;
  };
  yearpublished: {
    _text: string;
  };
  image: {
    _text: string;
  };
  thumbnail: {
    _text: string;
  };
  status: {
    _attributes: {
      own: string;
      prevowned: string;
      fortrade: string;
      want: string;
      wanttoplay: string;
      wanttobuy: string;
      wishlist: string;
      preordered: string;
      lastmodified: string;
    };
  };
  numplays: {
    _text: string;
  };
};

type ApiResponse = {
  items?: {
    _attributes: {
      termsofuse: string;
      totalitems: string;
      pubdate: string;
    };
    item: ApiResponseBody | ApiResponseBody[];
  };
};

type Item = {
  id: string;
  collId: string;
  type: string;
  name: string;
  yearPublished: string;
  image: string;
  thumbnail: string;
  status: {
    own: boolean;
    prevOwned: boolean;
    forTrade: boolean;
    want: boolean;
    wantToPlay: boolean;
    wantToBuy: boolean;
    wishList: boolean;
    preOrdered: boolean;
    lastModified: string;
  };
  numPlays: number;
};

type Payload = {
  attributes: {
    termsOfUse: string;
    totalItems: string;
    pubDate: string;
  };
  items: Item[];
};

const transformData = (data: ApiResponseBody): Item => {
  return {
    id: data._attributes.objectid,
    collId: data._attributes.collid,
    type: data._attributes.objecttype,
    name: data.name._text,
    yearPublished: data.yearpublished?._text,
    image: data.image._text,
    thumbnail: data.thumbnail._text,
    status: {
      own: Boolean(Number(data.status._attributes.own)),
      prevOwned: Boolean(Number(data.status._attributes.prevowned)),
      forTrade: Boolean(Number(data.status._attributes.fortrade)),
      want: Boolean(Number(data.status._attributes.want)),
      wantToPlay: Boolean(Number(data.status._attributes.wanttoplay)),
      wantToBuy: Boolean(Number(data.status._attributes.wanttobuy)),
      wishList: Boolean(Number(data.status._attributes.wishlist)),
      preOrdered: Boolean(Number(data.status._attributes.preordered)),
      lastModified: data.status._attributes.lastmodified,
    },
    numPlays: Number(data.numplays._text),
  };
};

export const collection = async (args: Args): Promise<Payload | null> => {
  const params = getParams(args);
  const { data } = await axios.get<ApiResponse>("/collection", {
    params,
  });

  if (!data.items) {
    return null;
  }

  return {
    attributes: {
      termsOfUse: data.items._attributes.termsofuse,
      totalItems: data.items._attributes.totalitems,
      pubDate: data.items._attributes.pubdate,
    },
    items: enforceArray(data.items.item).map((data) => transformData(data)),
  };
};
