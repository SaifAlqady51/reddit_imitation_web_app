import { RequiredEntityData } from "@mikro-orm/core";
import {User}  from "../entities/User"
import { MyContext } from "src/types/MyContext-type";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from 'argon2'

@InputType()
class UsernameAndPasswordArgs {   // that class is used instead of the default Arg query
    @Field()
    username: string;

    @Field()
    password: string;
}


@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernameAndPasswordArgs,
        @Ctx() {em}: MyContext
    ){
        // using argon2 to decrypt the password
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User,{username:options.username, password: hashedPassword} as RequiredEntityData<User>)
        await em.persistAndFlush(user)

        return user
    }
}