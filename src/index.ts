import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOromConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post-resolver';
import { HelloResolver } from './resolvers/hello-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { MyContext } from './types/MyContext-type';
import connectRedis from "connect-redis"
import session from "express-session"
import {createClient} from "redis"


const main = async() => {

    const orm = await MikroORM.init(mikroOromConfig);
    await orm.getMigrator().up();

    // starting express server
    const app = express();
    // @ts-ignore
    const RedisStore = () => {( new connectRedis(session) )}
    // @ts-ignore
    let redisCleint =await createClient({legacyMode:true,host:'127.0.0.1',port: 6379}).connect();

// Initialize sesssion storage.
    app.use(
        session({
            name:'qid',
            // @ts-ignore
            store:  RedisStore({client:redisCleint,disableTouch:true}),
            cookie:{
                maxAge:1000* 60* 60* 24 * 365 * 18,
                httpOnly:true,
                secure:__prod__,
                sameSite:'lax',
            },
            resave: false, // required: force lightweight session keep alive (touch)
            saveUninitialized: false, // recommended: only save session when data exists
            secret: "keyboardcat",
        })
    )

    // inialize session storage

    const cors = {
        credentials:true,
        origin: "https://studio.apollographql.com"
    }

    //creating apollo server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[PostResolver, HelloResolver,UserResolver],
            validate:false
        }),
        // context is a special object that is accessible by all the resolvers
        context:({req,res}) : MyContext => ({em:orm.em,req,res})
    });
    // starting apollo server
    await apolloServer.start();
    // apply apollo server with express
    apolloServer.applyMiddleware({app,cors})

    app.listen(4000, () => {
        console.log('listening on port 4000')
    })
}

main().catch(error => {
    console.error(error)
});