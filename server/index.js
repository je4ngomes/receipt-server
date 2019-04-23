import { GraphQLServer } from 'graphql-yoga';
import { formatError } from 'apollo-errors';

// set and load database configuration
import './config/db';
import './models/Receipt';
import './models/User';

import mergeGraphql from './utils/mergeGraphql';
import { parseJWTFromRequest, authRequired, fieldValidations } from './middlewares/graphql';

const { schema: typeDefs, resolvers } = mergeGraphql([{ dir: `${__dirname}/graphql/**/resolvers.js`, type: 'RESOLVERS' },
                                                      { dir: `${__dirname}/graphql/**/*.graphql`, type: 'TYPES' }])
const port = process.env.PORT || 3000;
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: [
        parseJWTFromRequest,
        authRequired,
        fieldValidations
    ],
    context: req => ({ req })
});

server.start(
    { port, formatError },
    () => console.log(`Listining on port ${port}`)
);