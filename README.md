# bgg-sdk

**WORK IN PROGRESS: NOT YET READY FOR USE**

A modern SDK for interacting with the BoardGameGeek (BGG) XMLAPI2, written in TypeScript and inspired by [BGG](https://www.npmjs.com/package/bgg).

## Core Features

- Type safety for requests and responses
- Automatic conversion of responses from XML to JSON
- Automatic retry for queued requests
- Support for both CommonJS and ES modules
- Usable in both server and browser environments

## Planned Features

- Support for all BGG XMLAPI2 endpoints (see [documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2))
  - Remaining endpoints to implement
    - forumlist
    - forum
    - thread
    - plays

## TODO

- Make typing more consistent across routes (ex: page param)
- Implement remaining endpoints
- Create unit tests for all endpoints
