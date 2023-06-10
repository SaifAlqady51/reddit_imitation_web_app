import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOromConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolver/post';
import { HelloResolver } from './resolver/hello';


const main = async() => {
    const orm = await MikroORM.init(mikroOromConfig);
    await orm.getMigrator().up();
    // starting express server
    const app = express();
    //creating apollo server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[PostResolver, HelloResolver],
            validate:false
        }),
        // context is a special object that is accessible by all the resolvers
        context:() => ({em:orm.em})
    });
    // starting apollo server
    await apolloServer.start();
    // apply apollo server with express
    apolloServer.applyMiddleware({app})

    app.listen(4000, () => {
        console.log('listening on port 4000')
    })
}

main().catch(error => {
    console.error(error)
});