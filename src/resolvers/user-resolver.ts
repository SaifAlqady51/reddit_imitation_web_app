import { RequiredEntityData } from "@mikro-orm/core";
import {User}  from "../entities/User"
import { MyContext } from "src/types/MyContext-type";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2'




@InputType()                      // using InputType for arg 
class UsernameAndPasswordArgs {   // that class is used instead of the default Arg query
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FailResponse {     // that class is specify the type of the error that could occur 
    @Field()
    field:string;        // errors containing field name     

    @Field()
    message:string   ;   // errors containing message
}


@ObjectType()
class UserResponse {        // UserResponse is a type of login it could be error or user
    @Field(() => [FailResponse], {nullable:true})  
    errors?: FailResponse[]

    @Field(() => User, {nullable:true})
    user?: User
}



@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernameAndPasswordArgs,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        if(options.username.length < 3){
            return {
                errors: [{
                    field:'username',
                    message:'username must be at least 3 characters'
                }]
            }
        }

        if(options.password.length < 8 ){
            return {
                errors: [{
                    field:'password',
                    message:'username must be at least 8 characters'
                }]
            }
        }


        
        // using argon2 to decrypt the password
        const hashedPassword = await argon2.hash(options.password)
        // creating new user
        const user = em.create(User,{username:options.username, password: hashedPassword} as RequiredEntityData<User>)
        await em.persistAndFlush(user)

        return {user}
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernameAndPasswordArgs,
        @Ctx() {em}: MyContext
    ) : Promise<UserResponse>{
        // finding the user by its username
        const user = await em.findOne(User,{username: options.username})
        // if there is no user
        if(!user){
            return {
                errors:[{
                    field: 'username',
                    message:'username does not exist'
                }]
            }
        }

        // using argon2 to chekc password correctness
        const valid = await argon2.verify(user.password,options.password)
        // if password is not correct
        if(!valid){
            return {
                errors:[{
                    field:'password',
                    message:'Incorrect password'
                }]
        }

    }
    // finally return a user after check the upper conditions
    return {user}
    }
}