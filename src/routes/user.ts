import { axios } from "~/lib/axios";
import { enforceArray } from "~/lib/helpers";

type Params = {
  name: string;
  buddies?: true;
  guilds?: true;
  hot?: true;
  top?: true;
  domain?: boardgame | rpg | videogame;
  page?: string;
};

type BuddyResponse = {
  _attributes: {
    id: string;
    name: string;
  };
};

type GuildResponse = {
  _attributes: {
    id: string;
    name: string;
  };
};

type HotResponse = {
  _attributes: {
    rank: string;
    type: string;
    id: string;
    name: string;
  };
};

type TopResponse = {
  _attributes: {
    rank: string;
    type: string;
    id: string;
    name: string;
  };
};

type ResponseBody = {
  _attributes: {
    id: string;
    name: string;
    termsofuse: string;
  };
  firstname: {
    _attributes: {
      value: string;
    };
  };
  lastname: {
    _attributes: {
      value: string;
    };
  };
  avatarlink: {
    _attributes: {
      value: string;
    };
  };
  yearregistered: {
    _attributes: {
      value: string;
    };
  };
  lastlogin: {
    _attributes: {
      value: string;
    };
  };
  stateorprovince: {
    _attributes: {
      value: string;
    };
  };
  country: {
    _attributes: {
      value: string;
    };
  };
  webaddress: {
    _attributes: {
      value: string;
    };
  };
  xboxaccount: {
    _attributes: {
      value: string;
    };
  };
  wiiaccount: {
    _attributes: {
      value: string;
    };
  };
  psnaccount: {
    _attributes: {
      value: string;
    };
  };
  battlenetaccount: {
    _attributes: {
      value: string;
    };
  };
  steamaccount: {
    _attributes: {
      value: string;
    };
  };
  traderating: {
    _attributes: {
      value: string;
    };
  };
  buddies?: {
    _attributes: {
      total: string;
      page: string;
    };
    buddy: BuddyResponse | BuddyResponse[];
  };
  guilds?: {
    _attributes: {
      total: string;
      page: string;
    };
    guild: GuildResponse | GuildResponse[];
  };
  hot?: {
    _attributes: {
      domain: string;
    };
    item: HotResponse | HotResponse[];
  };
  top?: {
    _attributes: {
      domain: string;
    };
    item: TopResponse | TopResponse[];
  };
};

type Response = {
  user: ResponseBody;
};

type Item = {
  id: string;
  name: string;
  termsOfUse: string;
  firstName: string;
  lastName: string;
  avatarLink: string;
  yearRegistered: string;
  lastLogin: string;
  stateOrProvince: string;
  country: string;
  webAddress: string;
  xboxAccount: string;
  wiiAccount: string;
  psnAccount: string;
  battlenetAccount: string;
  steamAccount: string;
  tradeRating: string;
  buddies?: {
    total: string;
    page: string;
    buddy: {
      id: string;
      name: string;
    }[];
  };
  guilds?: {
    total: string;
    page: string;
    guild: {
      id: string;
      name: string;
    }[];
  };
  hot?: {
    domain: string;
    item: {
      rank: string;
      type: string;
      id: string;
      name: string;
    }[];
  };
  top?: {
    domain: string;
    item: {
      rank: string;
      type: string;
      id: string;
      name: string;
    }[];
  };
};

type Payload = {
  termsOfUse: string;
  user: Item | null;
};

const transformData = (data: ResponseBody): Item => {
  return {
    id: data._attributes.id,
    name: data._attributes.name,
    termsOfUse: data._attributes.termsofuse,
    firstName: data.firstname._attributes.value,
    lastName: data.lastname._attributes.value,
    avatarLink: data.avatarlink._attributes.value,
    yearRegistered: data.yearregistered._attributes.value,
    lastLogin: data.lastlogin._attributes.value,
    stateOrProvince: data.stateorprovince._attributes.value,
    country: data.country._attributes.value,
    webAddress: data.webaddress._attributes.value,
    xboxAccount: data.xboxaccount._attributes.value,
    wiiAccount: data.wiiaccount._attributes.value,
    psnAccount: data.psnaccount._attributes.value,
    battlenetAccount: data.battlenetaccount._attributes.value,
    steamAccount: data.steamaccount._attributes.value,
    tradeRating: data.traderating._attributes.value,
    buddies: data.buddies
      ? {
          total: data.buddies._attributes.total,
          page: data.buddies._attributes.page,
          buddy: enforceArray(data.buddies.buddy).map((data) => ({
            id: data._attributes.id,
            name: data._attributes.name,
          })),
        }
      : undefined,
    guilds: data.guilds
      ? {
          total: data.guilds._attributes.total,
          page: data.guilds._attributes.page,
          guild: enforceArray(data.guilds.guild).map((data) => ({
            id: data._attributes.id,
            name: data._attributes.name,
          })),
        }
      : undefined,
    hot: data.hot
      ? {
          domain: data.hot._attributes.domain,
          item: enforceArray(data.hot.item).map((data) => ({
            rank: data._attributes.rank,
            type: data._attributes.type,
            id: data._attributes.id,
            name: data._attributes.name,
          })),
        }
      : undefined,
    top: data.top
      ? {
          domain: data.top._attributes.domain,
          item: enforceArray(data.top.item).map((data) => ({
            rank: data._attributes.rank,
            type: data._attributes.type,
            id: data._attributes.id,
            name: data._attributes.name,
          })),
        }
      : undefined,
  };
};

export const user = async (params: Params): Promise<Payload> => {
  const { data } = await axios.get<Response>("/user", {
    params,
  });

  return {
    termsOfUse: data.user._attributes.termsofuse,
    user: data.user ? transformData(data.user) : null,
  };
};
