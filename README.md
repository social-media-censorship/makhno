# makhno

Makhno is the tool described by the article: [New Tool Makhno will expose geographic social media censorship](https://foundation.mozilla.org/en/blog/new-tool-makhno-will-expose-geographic-social-media-censorship/)

## Specification

The file `openapi.yaml` has been generated with https://editor.swagger.io and define the API endpoints. Would be updated in an iterative fashon before becoming part of an official documentation.

## file tree

```

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
* `npm start` aka `bin/systemCheckup.mjs`
* `jest --collect-coverage`

### Implemented components and their role


# `./platforms` folder 

Format and specification for the platform directory YAML files

## The `Natures` files

## The `.js` files

## The `curl/` subdirectories


### Author

Claudio Agosti _claudio at tracking dot exposed_.

---

The Makhno project in its first year (2022) is a joint venture between [Tracking Exposed](https://tracking.exposed) and [Hermes Center](https://hermescenter.org).
