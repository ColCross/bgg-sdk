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
  id: string[];
  type?: Array<
    | boardgame
    | boardgameaccessory
    | boardgameexpansion
    | rpgissue
    | rpgitem
    | videogame
  >;
  versions?: true;
  videos?: true;
  stats?: true;
  marketplace?: true;
  comments?: true;
  ratingcomments?: true;
  page?: number;
  pagesize?: number;
};

type Params = Omit<Args, "id" | "type"> & {
  id: string;
  type?: string;
};

const getParams = (args: Args): Params => {
  return {
    ...args,
    id: args.id.join(","),
    type: args.type?.join(","),
  };
};

type ApiResponsePollLanguageDependence = {
  _attributes: {
    name: "language_dependence";
    title: string;
    totalvotes: string;
  };
  results: {
    result: [
      {
        _attributes: {
          level: string;
          value: string;
          numvotes: string;
        };
      },
    ];
  };
};

type ApiResponsePollSuggestedPlayerAge = {
  _attributes: {
    name: "suggested_playerage";
    title: string;
    totalvotes: string;
  };
  results: {
    result: {
      _attributes: {
        value: string;
        numvotes: string;
      };
    }[];
  };
};

type ApiResponsePollNumPlayers = {
  _attributes: {
    name: "suggested_numplayers";
    title: string;
    totalvotes: string;
  };
  results: {
    _attributes: {
      numplayers: string;
    };
    result: {
      _attributes: {
        value: string;
        numvotes: string;
      };
    }[];
  }[];
};

type ApiResponsePolls = Array<
  | ApiResponsePollLanguageDependence
  | ApiResponsePollNumPlayers
  | ApiResponsePollSuggestedPlayerAge
>;

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
  playingtime: {
    _attributes: {
      value: string;
    };
  };
  minplaytime: {
    _attributes: {
      value: string;
    };
  };
  maxplaytime: {
    _attributes: {
      value: string;
    };
  };
  minage: {
    _attributes: {
      value: string;
    };
  };
  link: ApiResponseLink | ApiResponseLink[];
  poll?: ApiResponsePolls;
};

type ApiResponse = {
  items: {
    _attributes: {
      termsofuse: string;
    };
    item?: ApiResponseBody | ApiResponseBody[];
  };
};

type PollLanguageDependence = {
  name: string;
  title: string;
  totalvotes: string;
  results: {
    level: string;
    value: string;
    numvotes: string;
  }[];
};

type PollSuggestedPlayerAge = {
  name: string;
  title: string;
  totalvotes: string;
  results: {
    value: string;
    numvotes: string;
  }[];
};

type PollNumPlayers = {
  name: string;
  title: string;
  totalvotes: string;
  results: {
    numplayers: string;
    result: {
      value: string;
      numvotes: string;
    }[];
  }[];
};

type Polls = Array<
  PollLanguageDependence | PollNumPlayers | PollSuggestedPlayerAge
>;

type Item = {
  id: string;
  type: string;
  thumbnail: string;
  image: string;
  names: {
    type: string;
    sortindex: string;
    value: string;
  }[];
  description: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
  playingTime: string;
  minPlayTime: string;
  maxPlayTime: string;
  minAge: string;
  links: {
    type: string;
    id: string;
    value: string;
  }[];
  polls: Polls;
};

type Payload = {
  attributes: {
    termsofuse: string;
  };
  items: Item[];
};

const transformPollLanguageDependence = (
  poll: ApiResponsePollLanguageDependence,
): PollLanguageDependence => {
  return {
    name: poll._attributes.name,
    title: poll._attributes.title,
    totalvotes: poll._attributes.totalvotes,
    results: poll.results.result.map((result) => {
      return {
        level: result._attributes.level,
        value: result._attributes.value,
        numvotes: result._attributes.numvotes,
      };
    }),
  };
};

const transformPollSuggestedPlayerAge = (
  poll: ApiResponsePollSuggestedPlayerAge,
): PollSuggestedPlayerAge => {
  return {
    name: poll._attributes.name,
    title: poll._attributes.title,
    totalvotes: poll._attributes.totalvotes,
    results: poll.results.result.map((result) => {
      return {
        value: result._attributes.value,
        numvotes: result._attributes.numvotes,
      };
    }),
  };
};

const transformPollSuggestedNumPlayers = (
  poll: ApiResponsePollNumPlayers,
): PollNumPlayers => {
  return {
    name: poll._attributes.name,
    title: poll._attributes.title,
    totalvotes: poll._attributes.totalvotes,
    results: poll.results.map((result) => {
      return {
        numplayers: result._attributes.numplayers,
        result: result.result.map((result) => {
          return {
            value: result._attributes.value,
            numvotes: result._attributes.numvotes,
          };
        }),
      };
    }),
  };
};

// TODO: Figure out why TS doesn't recognize the discriminated union and requires a type assertion
const transformPoll = (apiPolls: ApiResponsePolls): Polls => {
  const polls: Polls = [];

  apiPolls.forEach((apiPoll) => {
    switch (apiPoll._attributes.name) {
      case "language_dependence": {
        polls.push(
          transformPollLanguageDependence(
            apiPoll as ApiResponsePollLanguageDependence,
          ),
        );
        break;
      }
      case "suggested_playerage": {
        polls.push(
          transformPollSuggestedPlayerAge(
            apiPoll as ApiResponsePollSuggestedPlayerAge,
          ),
        );
        break;
      }
      case "suggested_numplayers": {
        polls.push(
          transformPollSuggestedNumPlayers(
            apiPoll as ApiResponsePollNumPlayers,
          ),
        );
        break;
      }
      default: {
        return null;
      }
    }
  });

  return polls;
};

const transformData = (data: ApiResponseBody): Item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    thumbnail: data.thumbnail?._text,
    image: data.image?._text,
    names: enforceArray(data.name).map((name) => {
      return {
        type: name._attributes.type ?? "",
        sortindex: name._attributes.sortindex,
        value: name._attributes.value,
      };
    }),
    description: data.description?._text,
    yearPublished: data.yearpublished?._attributes.value,
    minPlayers: data.minplayers?._attributes.value,
    maxPlayers: data.maxplayers?._attributes.value,
    playingTime: data.playingtime?._attributes.value,
    minPlayTime: data.minplaytime?._attributes.value,
    maxPlayTime: data.maxplaytime?._attributes.value,
    minAge: data.minage?._attributes.value,
    links: enforceArray(data.link).map((link) => {
      return {
        type: link._attributes.type,
        id: link._attributes.id,
        value: link._attributes.value,
      };
    }),
    polls: transformPoll(enforceArray(data.poll)),
  };
};

export const thing = async (args: Args): Promise<Payload> => {
  const params = getParams(args);
  const { data } = await axios.get<ApiResponse>("/thing", { params });

  return {
    attributes: {
      termsofuse: data.items._attributes.termsofuse,
    },
    items: enforceArray(data.items.item).map((data) => transformData(data)),
  };
};
