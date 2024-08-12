show tables;

drop table if exists attachment_id;

select *
from hompy;
select *
from folder;
select * from post;
select * from friend;
select * from ah_user;
select* from friend;
select * from payment_history;
select * from attachment;
select * from user_write_histroy;
select * from board_type;
select * from email_authentication;

alter table post modify column content Longtext;

alter table user_write_histroy drop column update_at;
#  컬럼 삭제.
delete from email_authentication;
insert into post (create_at,folder_id,content,subject)
select create_at,folder_id,content,subject
from friend;


select *
from diary;
select *
from hompy;
select *
from guest_book;
select *
from carts;

delete
from ah_user
where id = 8;

update hompy set total_visitor = 0 where id = 1;

update ah_user
set acorn = 100000
where id = 4;



insert into post (create_at, folder_id, content, subject)
select create_at, folder_id, content, subject
from post;

describe ah_user;
describe hompy;

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
set item_name='풍물놀이_꾕과리'
where id = 31;

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

insert into board_type (name) values ('게시판');
insert into board_type (name) values ('사진첩');
insert into board_type (name) values ('동영상');

delete
from board_type;
alter table board_type
    AUTO_INCREMENT = 1;

delete from payment_history;
alter table payment_history
    AUTO_INCREMENT = 1;


SELECT SUM(payment) AS total_payment
FROM payment_history
WHERE create_at like '2024-08%';
