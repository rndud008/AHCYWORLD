show tables;

drop table if exists attachment_id;

select * from friend;
select * from ah_user;

select * from diary;
select * from hompy;

delete from ah_user;
alter table ah_user
    AUTO_INCREMENT = 1;

delete from friend;
alter table friend
    AUTO_INCREMENT = 1;

delete from hompy;
alter table hompy
    AUTO_INCREMENT = 1;