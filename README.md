# makhno

Makhno is the tool described by the article: [New Tool Makhno will expose geographic social media censorship](https://foundation.mozilla.org/en/blog/new-tool-makhno-will-expose-geographic-social-media-censorship/), and is the backend technology implemented in [makhno.net](https://makhno.net).

## Specification

The file `openapi.yaml` has been generated with https://editor.swagger.io and define the API endpoints. Would be updated in an iterative fashon before becoming part of an official documentation.

## file tree

```
v :~/D/makhno main $ tree --gitignore
.
├── agents
│   ├── logs
│   └── README.md
├── bin
│   ├── airtable-fetcher.mjs
│   ├── cleaner.mjs
│   ├── curl.mjs
│   ├── detour-everything.mjs
│   ├── gafam.mjs
│   ├── global.mjs
│   ├── orchestrator.mjs
│   ├── process-output.mjs
│   ├── README.md
│   ├── results.mjs
│   ├── scheduled.mjs
│   ├── submission.mjs
│   └── submit.mjs
├── config
│   ├── airtable.example
│   ├── database.json
│   ├── http.json
│   ├── NOTES.md
│   └── README.md
├── jest.config.js
├── LICENSE
├── NOTE
├── openapi.yaml
├── package.json
├── package-lock.json
├── platforms
│   ├── domains.yaml
│   ├── facebook
│   ├── instagram
│   ├── tiktok
│   │   ├── channel.yaml
│   │   ├── curl
│   │   │   └── video.yaml
│   │   ├── filterChannelOnly.js
│   │   ├── pickVideoInfo.js
│   │   └── video.yaml
│   └── youtube
│       ├── channel1.yaml
│       ├── channel2.yaml
│       ├── channel3.yaml
│       ├── curl
│       │   └── channel.yaml
│       ├── pickLastChunk.js
│       ├── pickLastVideoId.js
│       ├── shorts.yaml
│       ├── video-standard.yaml
│       └── video-urlshort.yaml
├── README.md
├── src
│   ├── gafam
│   │   └── http.js
│   ├── results
│   │   ├── database.js
│   │   ├── http.js
│   │   └── validators.js
│   ├── scheduled
│   │   ├── database.js
│   │   ├── http.js
│   │   └── validators.js
│   └── submission
│       ├── database.js
│       ├── http.js
│       └── validators.js
├── tests
│   ├── agents
│   │   └── README.md
│   ├── gafam
│   │   ├── curl
│   │   │   ├── platformX-nature1.yaml
│   │   │   ├── platformX-nature2.yaml
│   │   │   ├── platformY-nature1.yaml
│   │   │   └── README.md
│   │   └── http.js
│   ├── _payloads
│   │   ├── blockedYTChannel.html
│   │   ├── invalidTKvideo.html
│   │   ├── invalidYTChannel.html
│   │   ├── loremipsum.html
│   │   ├── results.json
│   │   ├── scheduled.json
│   │   ├── submission.json
│   │   ├── validTKvideo.html
│   │   └── validYTChannel.html
│   ├── results
│   │   ├── database.js
│   │   └── validators.js
│   ├── scheduled
│   │   ├── database.js
│   │   └── validators.js
│   ├── submission
│   │   ├── database.js
│   │   └── validators.js
│   └── utils
│       ├── parse-curl.js
│       └── parsinghq.js
└── utils
    ├── build-index.js
    ├── cli.js
    ├── countries.js
    ├── express.js
    ├── gafam.js
    ├── mongo.js
    ├── parse-curl.js
    ├── parsinghq.js
    ├── results.js
    ├── various.js
    └── webutils.js

26 directories, 85 files
```

### In order, to know:

* `gafam`, `results`, `scheuled`, `submission` are also the name of the http routes implemented and the name of the API specifics
* `services/` are files representing the platform (facebook, youtube,...) supported, used by the GAFAM API
* `bin/` are single purposes execution scripts
* `utils/` are all the utilities necessary, they have comment at the begnning to explain when it should be used
* `LICENSE` is AGPL-3.0

### Dependencies (handled by `npm install`)

* [zx](https://github.com/google/zx), [express](https://expressjs.com/).
* developed with node 16.x

### How test is handled? 

* [jest](https://jestjs.io/)
* you should start the services `npm run submission` `npm run schedule` `npm run gafam` `npm run results`
* then `npm run detour` would test locally if they are working and would execute some activity simulating the server
* `jest --collect-coverage`

## Implemented components, scripts, and their role

`npm run submission` it listed at port `2001` and implemented the API related to external submissions; It validates new URL that should be analyzed, and return them to the `orchestrator` component.

`DEBUG=* bin/orchestrator.mjs` runs the orchestrator, a component that pick from the most recent submissions and produce a list of operations, these are sent to the `scheduled` component

`npm run scheduled` it listen at port `2003` and implement the API related to scheduled tasks. It validates new tasks and return them to the agents that can absolve the tasks.

`DEBUG=* bin/curl.mjs` the most basic kind of `agent`. It connects to the `scheduled` APIs, check if there is any new URL to connect, it does and submit the result to the `GAFAM` component. The results from `GAFAM` are then sent to the `results` component.

`npm run gafam` it listen at port `2002` and implements the GAFAM API. They receive URL and HTML, and decides if the HTML submitted belong to a page that is reachable or not. Communicate this result as API response.

`npm run results` it listen at port `2004` and implements the results API. They waits for results produced by the `agent`s.

---

The command `npm run detour` test most of these functionalities, by doing a detour of the system.

The command `DEBUG=* bin/submit.mjs` allow to submit arbitrary URLs to the system.

## The `./platforms` folder 

Format and specification for the platform directory YAML files

## The meaning of `Nature` in this project

Are all youtube link the same? No. Except they contains `youtube.com` as hostname in their URL, this toolkit needs to distinguish between a link to a youtube profile from a link to a youtube video. And more than one link format can have the same meaning. This meaning takes the name of Nature, as it is the nature of the link.

Examples:

* `https://www.tiktok.com/@battlebots` has Nature `TikTok Channel`
* `https://www.tiktok.com/@rtl.sport/video/7154111468428856582` has Nature `TikTok Video`
* `https://www.youtube.com/c/%E4%BA%AC%E9%83%BD%E3` has Nature `Youtube Channel`
* `https://www.youtube.com/user/dish` has Nature `Youtube Channel`
* `https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ` has Nature `Youtube Channel`
* `https://www.youtube.com/shorts/IX3nMJaUS-Q` has Nature `Youtube Short`
* `https://www.youtube.com/watch?v=n61ULEU7CO0` has Nature `Youtube Video`
* `https://youtu.be/n61ULEU7CO0` has Nature `Youtube Video`

## The `.js` files

## The `curl/` subdirectories


### Author

Claudio Agosti _claudio at tracking dot exposed_.

---

The Makhno project in its first year (2022) is a joint venture between [Tracking Exposed](https://tracking.exposed) and [Hermes Center](https://hermescenter.org).
