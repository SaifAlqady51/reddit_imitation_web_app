import { MikroORM, RequiredEntityData } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOromConfig from './mikro-orm.config';
import { Post } from './entities/Post';




const main = async() => {
    const orm = await MikroORM.init(mikroOromConfig);
    await orm.getMigrator().up();
    
    const posts = await orm.em.find(Post,{})
    console.log(posts)



}

main().catch(error => {
    console.error(error)
});