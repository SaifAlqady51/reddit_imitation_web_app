import { MyContext } from "src/types/MyContext-type";
import { Post } from "../entities/Post";
import { Query, Resolver,Ctx} from "type-graphql";

@Resolver()
export class PostResolver{
    @Query(() => [Post])
    post(
        @Ctx() {em}: MyContext 
    ){
        return em.find(Post,{});
    }
}