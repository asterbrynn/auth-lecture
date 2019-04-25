create table users (
    id serial primary key,
    name varchar,
    email varchar not null,
    password varchar not null
);