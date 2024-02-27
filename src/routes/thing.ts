import axios from "~/lib/axios";

// TODO: Excluding poll data for now

type params = {
  id: string;
  type?: Array<
    | boardgame
    | boardgameaccessory
    | boardgameexpansion
    | rpgissue
    | rpgitem
    | videogame
  >;
  versions: true;
  videos: true;
  stats: true;
  marketplace: true;
  comments: true;
  ratingcomments: true;
  page: string;
  pagesize: string;
};

type response = {
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
  name: {
    _attributes: {
      type: string;
      sortindex: string;
      value: string;
    };
  }[];
  description: {
    _text: string;
  };
  yearpublished: {
    _attributes: {
      value: string;
    };
  };
  minplayers: {
    _attributes: {
      value: string;
    };
  };
  maxplayers: {
    _attributes: {
      value: string;
    };
  };
};

type item = {
  id: string;
  type: string;
  thumbnail: string;
  image: string;
  name: string;
  description: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
};

const transformData = (data: response): item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    thumbnail: data.thumbnail._text,
    image: data.image._text,
    name: data.name[0]._attributes.value,
    description: data.description._text,
    yearPublished: data.yearpublished._attributes.value,
    minPlayers: data.minplayers._attributes.value,
    maxPlayers: data.maxplayers._attributes.value,
  };
};

export const thing = async (params?: params): Promise<item | null> => {
  const response = await axios.get("/thing", { params });
  const data: response = response.data.items.item;

  if (!response.data.items.item) return null;
  return transformData(data);
};
