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
select * from user_write_histroy;

alter table user_write_histroy drop column update_at;
#  컬럼 삭제.

insert into post (create_at,folder_id,content,subject)
select create_at,folder_id,content,subject
from friend;

select *
from diary;
select *
from hompy;
select *
from guest_book;

delete
from ah_user
where id = 8;



insert into post (create_at, folder_id, content, subject)
select create_at, folder_id, content, subject
from post;

describe ah_user;

alter table ah_user modify birth_day date null;
alter table ah_user modify gender varchar(255) null;

    select * from item;
select count(*)
from item;
delete
from ah_user
where username = "user3"
;



update item
set file_name='포치코1.png'
where id = 90;

update item
set item_name='글꼴4'
where id = 80;

update hompy
set minimi_picture = '망곰2.png'
where id = 2;




SELECT *
FROM Hompy
WHERE user_id = 4;

delete
from ah_user;
alter table ah_user
    AUTO_INCREMENT = 1;

delete
from friend;
alter table friend
    AUTO_INCREMENT = 1;

delete
from hompy;
alter table hompy
    AUTO_INCREMENT = 1;