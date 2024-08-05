show tables;

drop table if exists attachment_id;

select * from friend;
select * from ah_user;
select* from friend;
select * from payment_history;

select * from item;
select count(*) from item;
delete
from ah_user
where username="user3"
;


update item
set item_name='포치코1'
where id=90;

update item
set item_name='글꼴4'
where id=80;

select * from diary;
select * from hompy;

delete from ah_user;
alter table ah_user
    AUTO_INCREMENT = 1;

delete from friend;
alter table friend
    AUTO_INCREMENT = 1;