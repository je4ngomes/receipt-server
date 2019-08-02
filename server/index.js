import { GraphQLServer, PubSub } from 'graphql-yoga';
import { formatError } from 'apollo-errors';

// set and load database configuration
import './config/db';
import './models/User';
import './models/Category';
import './models/Receipt';

import mergeGraphql from './utils/mergeGraphql';
import middlewares from './middlewares/graphql';

const { typeDefs, resolvers } = mergeGraphql([{ dir: `${__dirname}/graphql/**/resolvers.js`, type: 'RESOLVERS' },
                                                      { dir: `${__dirname}/graphql/**/*.gql`, type: 'TYPES' }])
const port = process.env.PORT || 3000;
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares,
    context: req => ({ req, pubsub: new PubSub() })
});

server.start(
    { port, formatError },
    () => console.log(`Listening on port ${port}`)
);

//https://ultimatecourses.com/blog/graphql-client-side-integration-with-apollo-hooks