// Copyright (c) 2023, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import { getRequests } from 'bafa-fetch';
import parseArgs from 'minimist';
import express from 'express';

/**
 * Ouputs message to the console.
 */
const log = console.log;

/**
 * Instance of Express application.
 */
const server = express();

/**
 * Port number of Express application.
 */
const port = 8002;

/**
 * Object populated with the array arguments from command-line arguments.
 */
const args = parseArgs(process.argv.slice(2));

/**
 * Gets object with paging values.
 * 
 * @param {object} query The object with query string variables.
 * @returns Object with paging values.
 */
const getPaging = (query) => {
    const { skip, limit } = query;

    return {
        pageNumber: skip,
        pageSize: limit || 1
    };
};

/**
 * GET method route for requests.
 */
server.get('/requests', async (req, res) => {
    const { query } = req;
    const { filter, lang, sort } = query;

    const options = {
        filter,
        lang: lang || args.lang || 'de',
        paging: getPaging(query),
        sort
    };

    const token = query.token || args.token;
    
    if (token) {
        const { data, status, error } = await getRequests({ token }, options);

        if (status === 200) {
            res.json(data);
        } else {
            res.status(400).json(error);
        }
    } else {
        res.sendStatus(401);
    }
});

/**
 * Creates listener on the specified port.
 */
server.listen(port, () => {
    log(`Server listening on port ${port}`);
});
