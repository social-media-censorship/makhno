/* 
 * this utility is used to bind an httpserver with express4.
 * the routes loaded are the one configured in
 * src/<serviceName>/http.js
 *
 * they are in separated services so we can handle them in different ports,
 * boxes, and guarantee that one port is one service for separation pourposes 
 *
 */

const express = require('express')
const debug = require('debug')('utils:express');

async function bindHTTPServer(routeConfig, serverConfig, dbConfig) {

    const expressApp = express()

    expressApp.listen(serverConfig.port, () => {
        debug("Binded sucessfully port %d", serverConfig.port);
    });

    for (const route of routeConfig.routes) {
       await route(dbConfig, expressApp);
    }

    /* this function is called by bin/*.mjs
     * and so far we don't need to return anything */
}

module.exports = {
    bindHTTPServer
}