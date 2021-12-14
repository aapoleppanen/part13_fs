-- commands used in task 13.2

-- connect with heroku run psql

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('James Stewart', 'https://www.amazon.com/Essential-Calculus-James-Stewart/dp/1133112293', 'Essential Calculus');
insert into blogs (author, url, title, likes) values ('Dan Abramov', 'https://overreacted.io/', 'Overreacted', 3);