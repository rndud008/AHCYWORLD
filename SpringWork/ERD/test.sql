show tables;


drop table if exists attachment_id;

select *
from folder;
select * from friend;
select * from ah_user;
select* from friend;
select * from payment_history;
select * from post;
select * from attachment;
insert into post (create_at,folder_id,content,subject)
select create_at,folder_id,content,subject
from post;


select * from item;
select count(*) from item;
delete
from ah_user
where username="user3"
;



update item
set file_name='포치코1.png'
where id=90;

update item
set item_name='글꼴4'
where id=80;

update hompy
set minimi_picture = 'minimi3.png'
where id = 3;

select * from diary;
select * from hompy;
select * from guest_book;
select * from carts;

SELECT * FROM Hompy WHERE user_id = 4;

delete from ah_user;
alter table ah_user
    AUTO_INCREMENT = 1;

delete from friend;
alter table friend
    AUTO_INCREMENT = 1;

delete from hompy;
alter table hompy
    AUTO_INCREMENT = 1;