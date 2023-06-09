import { MikroORM, RequiredEntityData } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOromConfig from './mikro-orm.config';
import { Post } from './entities/Post';




const main = async() => {

    const orm = await MikroORM.init(mikroOromConfig);
    const post = orm.em.create(Post,{title:"my first post"} as RequiredEntityData<Post>) ;
    await orm.em.persistAndFlush(post);
    console.log('--------------------------------sql 2 -------------------------')
    await orm.em.nativeInsert(Post,{title:"my second post"} as RequiredEntityData<Post>)


}

main();