import { MyContext } from "src/types/MyContext-type";
import { Post } from "../entities/Post";
import { Query, Resolver,Ctx, Arg, Int} from "type-graphql";

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext 
    ): Promise<Post[]>
    {
        return em.find(Post,{});
    }

    @Query(() => Post, {nullable:true}) // nullable: true is like or null but you can't write or null in graphql query
    post(
        @Arg('id',() => Int) id:number,
        @Ctx() {em}:MyContext 
    ): Promise<Post | null>
    {
        return em.findOne(Post,{id})
    }


}