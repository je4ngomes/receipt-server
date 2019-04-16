import { GraphQLServer } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import mergeGraphql from '../../graphql/graphql-prisma/src/utils/mergeGraphql';

// load database connection
import './config/db';

const { schema: typeDefs, resolvers } = mergeGraphql([{ dir: `${__dirname}/graphql/**resolvers.js`, type: 'RESOLVERS' },
                                                      { dir: `${__dirname}/graphql/**/*.graphql`, type: 'TYPES' }])

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => ({ req })
});

const port = process.env.PORT || 3000;
server.start(
    { port, formatError },
    () => console.log(`Listining on port ${port}`)
);