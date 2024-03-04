import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

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

type LanguageDependencePollResponse = {
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

type SuggestedPlayerAgePollResponse = {
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

type NumPlayersPollResponse = {
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

type PollResponse = Array<
  | LanguageDependencePollResponse
  | NumPlayersPollResponse
  | SuggestedPlayerAgePollResponse
>;

type NameResponse = {
  _attributes: {
    type: string;
    sortindex: string;
    value: string;
  };
};

type LinkResponse = {
  _attributes: {
    type: string;
    id: string;
    value: string;
  };
};

type ResponseBody = {
  _attributes: {
    type: string;
    id: string;
  };
  thumbnail?: {
    _text: string;
  };
  image?: {
    _text: string;
  };
  name?: NameResponse | NameResponse[];
  description?: {
    _text: string;
  };
  yearpublished?: {
    _attributes: {
      value: string;
    };
  };
  minplayers?: {
    _attributes: {
      value: string;
    };
  };
  maxplayers?: {
    _attributes: {
      value: string;
    };
  };
  playingtime?: {
    _attributes: {
      value: string;
    };
  };
  minplaytime?: {
    _attributes: {
      value: string;
    };
  };
  maxplaytime?: {
    _attributes: {
      value: string;
    };
  };
  minage?: {
    _attributes: {
      value: string;
    };
  };
  link?: LinkResponse | LinkResponse[];
  poll?: PollResponse;
};

type Response = {
  items: {
    _attributes: {
      termsofuse: string;
    };
    item?: ResponseBody | ResponseBody[];
  };
};

type LanguageDependencePoll = {
  name: string;
  title: string;
  totalvotes: string;
  results: {
    level: string;
    value: string;
    numvotes: string;
  }[];
};

type SuggestedPlayerAgePoll = {
  name: string;
  title: string;
  totalvotes: string;
  results: {
    value: string;
    numvotes: string;
  }[];
};

type NumPlayersPoll = {
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

type Poll = Array<
  LanguageDependencePoll | NumPlayersPoll | SuggestedPlayerAgePoll
>;

type Item = {
  id: string;
  type: string;
  thumbnail?: string;
  image?: string;
  name?: {
    type: string;
    sortindex: string;
    value: string;
  }[];
  description?: string;
  yearPublished?: string;
  minPlayers?: string;
  maxPlayers?: string;
  playingTime?: string;
  minPlayTime?: string;
  maxPlayTime?: string;
  minAge?: string;
  link: {
    type: string;
    id: string;
    value: string;
  }[];
  poll: Poll;
};

const transformLanguageDependencePoll = (
  poll: LanguageDependencePollResponse,
): LanguageDependencePoll => {
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

const transformSuggestedPlayerAgePoll = (
  poll: SuggestedPlayerAgePollResponse,
): SuggestedPlayerAgePoll => {
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

const transformSuggestedNumPlayersPoll = (
  poll: NumPlayersPollResponse,
): NumPlayersPoll => {
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
const transformPoll = (poll: PollResponse): Poll => {
  const transformedPolls: Poll = [];

  poll.forEach((poll) => {
    switch (poll._attributes.name) {
      case "language_dependence": {
        transformedPolls.push(
          transformLanguageDependencePoll(
            poll as LanguageDependencePollResponse,
          ),
        );
        break;
      }
      case "suggested_playerage": {
        transformedPolls.push(
          transformSuggestedPlayerAgePoll(
            poll as SuggestedPlayerAgePollResponse,
          ),
        );
        break;
      }
      case "suggested_numplayers": {
        transformedPolls.push(
          transformSuggestedNumPlayersPoll(poll as NumPlayersPollResponse),
        );
        break;
      }
      default: {
        return null;
      }
    }
  });

  return transformedPolls;
};

const transformData = (data: ResponseBody): Item => {
  return {
    id: data._attributes.id,
    type: data._attributes.type,
    thumbnail: data.thumbnail?._text,
    image: data.image?._text,
    name: enforceArray(data.name).map((name) => {
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
    link: enforceArray(data.link).map((link) => {
      return {
        type: link._attributes.type,
        id: link._attributes.id,
        value: link._attributes.value,
      };
    }),
    poll: transformPoll(enforceArray(data.poll)),
  };
};

export const thing = async (args: Args): Promise<Item[]> => {
  const params = getParams(args);
  const { data } = await axios.get<Response>("/thing", { params });

  return enforceArray(data.items.item).map((data) => transformData(data));
};
