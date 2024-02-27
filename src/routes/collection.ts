import axios from "~/lib/axios";

type args = {
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

type params = Omit<args, "id"> & {
  id?: string;
};

const getParams = (args: args): params | undefined => {
  if (!args) return undefined;

  return {
    ...args,
    id: args.id?.join(",") || undefined,
  };
};

type response = {
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

type item = {
  id: string;
  collid: string;
  type: string;
  name: string;
  yearPublished?: string;
  image: string;
  thumbnail: string;
  status: {
    own: boolean;
    prevowned: boolean;
    fortrade: boolean;
    want: boolean;
    wanttoplay: boolean;
    wanttobuy: boolean;
    wishlist: boolean;
    preordered: boolean;
    lastmodified: string;
  };
  numplays: number;
};

const transformData = (data: response): item => {
  return {
    id: data._attributes.objectid,
    collid: data._attributes.collid,
    type: data._attributes.objecttype,
    name: data.name._text,
    yearPublished: data.yearpublished?._text,
    image: data.image._text,
    thumbnail: data.thumbnail._text,
    status: {
      own: Boolean(data.status._attributes.own),
      prevowned: Boolean(data.status._attributes.prevowned),
      fortrade: Boolean(data.status._attributes.fortrade),
      want: Boolean(data.status._attributes.want),
      wanttoplay: Boolean(data.status._attributes.wanttoplay),
      wanttobuy: Boolean(data.status._attributes.wanttobuy),
      wishlist: Boolean(data.status._attributes.wishlist),
      preordered: Boolean(data.status._attributes.preordered),
      lastmodified: data.status._attributes.lastmodified,
    },
    numplays: Number(data.numplays._text),
  };
};

export const collection = async (args: args): Promise<item[]> => {
  const params = getParams(args);
  const { data } = await axios.get("/collection", { params });

  if (!data || !data.items || !data.items.item) return [];

  /* 
    The BGG API returns an object instead of an array when there is only one item in the response.
    Normalize the response by always returning an array.
    Note that this differs from the searchExact function in search.ts, where the "exact" parameter implies a single item return.
  */
  if (!Array.isArray(data.items.item)) {
    return [transformData(data.items.item)];
  }

  return data.items.item.map((data: response) => transformData(data));
};
