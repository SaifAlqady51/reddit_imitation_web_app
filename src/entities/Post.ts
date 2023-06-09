import { Entity,PrimaryKey,Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// ObjectType is used to convert class into graphql type
@ObjectType()
@Entity()

// creating table Post in our database

export class Post{

    // creating columns in Post table
    // Field query is essential to convert to graphql type
    @Field()
    @PrimaryKey()
    id!:number;

    @Field(() => String)  // String type with the date field is essential too
    @Property({type:'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type:'date',onUpdate:() => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type:'text'})
    title!:string;
}