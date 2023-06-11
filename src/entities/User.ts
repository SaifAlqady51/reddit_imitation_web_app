import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryKey()
    id!:number;
    
    @Field(() => String)
    @Property({type:'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type:'date',onUpdate:() => new Date()})
    updatedAt = new Date();

    @Field()
    @Property({type:'text', unique:true})
    username!:string;
    
    // There is no Field here to prevent you to selete the password
    @Property()
    password!:string;
}