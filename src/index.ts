import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOromConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post-resolver';
import { HelloResolver } from './resolvers/hello-resolver';
import { UserResolver } from './resolvers/user-resolver';
import session from 'express-session'
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { MyContext } from './types/MyContext-type';
// import cors from 'cors'


const main = async() => {

    const orm = await MikroORM.init(mikroOromConfig);
    await orm.getMigrator().up();

    // starting express server
    const app = express();

    // inialize client
    const redisClient = createClient();

    // initialize store
    const redisStore = new RedisStore({
        client: redisClient,
        disableTouch:true
    })

    // inialize session storage
    app.use(
        session({
            name:'qid',
            store:redisStore,
            secret:'mysecret',
            resave:false,
            saveUninitialized:false,
            cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365 * 18, // 18 yeafs
                httpOnly: true, // for security 
                secure: __prod__, // coockie only works in https
                sameSite: "lax" // for more about sameSite visit https://blog.heroku.com/chrome-changes-samesite-cookie
            }

        })
    )
    // app.use(
    //     cors({
    //         credentials:true,
    //         origin:"https://studio.apollographql.com"

    //     })
    // )

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
    apolloServer.applyMiddleware({app})

    app.listen(4000, () => {
        console.log('listening on port 4000')
    })
}

main().catch(error => {
    console.error(error)
});