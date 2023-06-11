"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230611074307 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230611074307 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" varchar(255) not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20230611074307 = Migration20230611074307;
//# sourceMappingURL=Migration20230611074307.js.map