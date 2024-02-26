import axios from "~/lib/axios";

type params = {
  id: string;
  type: string;
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
  poll: {
    _attributes: {
      name: string;
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
  }[];
};

// type poll = {
//     name: string;
//     title: string;
//     totalVotes: string;
//     results: {
//       numPlayers: string;
//       result: {
//         value: string;
//         numVotes: string;
//       }[];
//     };
// }

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
  //   poll?: poll | poll[];
};

export const thing = async (params?: params): Promise<item | null> => {
  const response = await axios.get("/thing", { params });
  const data: response = response.data.items.item;

  if (!response.data.items.item) return null;

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
    // TODO: Support polls in the future
    // poll: data.poll.map((poll) => {
    //   return {
    //     name: poll._attributes.name,
    //     title: poll._attributes.title,
    //     totalVotes: poll._attributes.totalvotes,
    //     results: poll.results.map((result) => {
    //       return {
    //         numPlayers: result._attributes.numplayers,
    //         result: result.result.map((r) => {
    //           return {
    //             value: r._attributes.value,
    //             numVotes: r._attributes.numvotes,
    //           };
    //         }),
    //       };
    //     }),
    //   };
    // }),
  };
};
