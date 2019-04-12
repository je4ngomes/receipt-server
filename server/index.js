import { GraphQLServer } from 'graphql-yoga';
import { formatError } from 'apollo-errors';

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => ({ db, req })
});

const port = process.env.PORT || 3000;
server.start(
    { port, formatError },
    () => console.log(`Listining on port ${port}`)
);