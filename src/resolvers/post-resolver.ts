import { MyContext } from "src/types/MyContext-type";
import { Post } from "../entities/Post";
import { Query, Resolver,Ctx, Arg, Int, Mutation} from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";

@Resolver()
export class PostResolver{
    @Query(() => [Post])  // useing Query to get data 
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

    @Mutation(() => Post) // using mutation for inserting deleting updating
    async createPost(
        @Arg('title',() => String) title:string,
        @Ctx() {em}:MyContext 
    ): Promise<Post>
    {
        const post = em.create(Post,{title} as RequiredEntityData<Post>);
        await em.persistAndFlush(post)
        return post
    }
    @Mutation(() => Post) // using mutation for inserting deleting updating
    async updatePost(
        @Arg('id',() => Int) id:number,
        @Arg('title',() => String, {nullable:true}) title:string,
        @Ctx() {em}:MyContext 
    ): Promise<Post | null>
    {
        const post = await em.findOne(Post,{id})
        if(!post){
            return null;
        }
        if(typeof title !== 'undefined'){
            post.title = title
            await em.persistAndFlush(post)
        }

        return post

    }

    @Mutation(() => Boolean) // using mutation for inserting deleting updating
    async deletePost(
        @Arg('id',() => Int) id:number,
        @Ctx() {em}:MyContext 
    ): Promise<boolean >
    {
        const post = await em.findOne(Post,{id});
        if(!post){
            return false
        }
        await em.nativeDelete(Post,{id});
        return true;
    }



}















