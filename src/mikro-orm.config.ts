import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";



export default {
    migrations:{
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    },
    entities: [Post],          // we imported Post class from Post.ts we created there the database column
    dbName:'reddit_database',
    password:'postgres',  
    type:'postgresql',         // type of the database we are using
    debug:!__prod__            // debug when we are not in the production environment (dev only)
}  as Parameters< typeof MikroORM.init >[0] // this line specifies the type of the parameters [note: Parameters returns an array]