show tables;

drop table if exists attachment_id;

ALTER TABLE hompy MODIFY COLUMN mini_hompy_bgm LONGTEXT;

select *
from hompy;
select *
from folder;
select * from post;
select * from user_write_histroy;

insert into item (price, bgm_img, file_name, item_name, item_type, source_name, status)
values (100, null, '블라블라','아이유','배경음악','홀씨','visible');

select * from friend;
select * from ah_user;
select* from friend;
select * from payment_history;
select * from attachment;
select * from board_type;
select * from item;
select * from carts;
select *
from diary;
select * from message;
select * from comment;
select * from guest_book;

delete from friend
where id = 61;

delete
from ah_user
where id = 11;


delete from hompy
where user_id=11;


select * from attachment where post_id='7285';
select * from email_authentication;


alter table post modify column content Longtext;

alter table user_write_histroy drop column update_at;
#  컬럼 삭제.
delete from email_authentication;
insert into post (create_at,folder_id,content,subject)
select create_at,folder_id,content,subject
from friend;

update item
set status = 'visible'
where id = 116;

update ah_user
set role = 'ROLE_MEMBER,ROLE_ADMIN'
where username = 'K3';

update friend
set friend_status = 'waiting'
where id = 67;

delete
    from item
where id = 51;
delete
    from item
where item_type = '폰트';

# 페이먼트 커럼추가
alter table payment_history
add status VARCHAR(20);
# 컬럼에 값 추가
update payment_history
set status = 'accept'
where id = 9;
# 아이템 이름 변경
update item
set item_name = ''
where id =  65;

select *
from diary;
select *
from hompy;
select *
from guest_book;
select *
from carts;



update hompy set total_visitor = 0 where id = 1;

update ah_user
set acorn = 9999999
where id = 2;




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

update ah_user
set password = '$2a$10$U3WEBM9/kkWLwf8wYDTnvOhtcgESxe4aCS2UzDlgESA.CK5Dvtn.K'
where id = 1;



update item
set source_name='모험을떠나요스킨.png'
where id = 118;

update item
set item_name='글꼴4'
where id = 80;

update hompy
set mini_hompy_skin = 'background.png'
where id = 5;




SELECT *
FROM Hompy
WHERE user_id = 4;

delete
from ah_user
where id = 7;
alter table ah_user
    AUTO_INCREMENT = 1;

delete
from friend;
alter table friend
    AUTO_INCREMENT = 1;

delete
from hompy
where id = 6;
alter table hompy
    AUTO_INCREMENT = 1;

insert into board_type (name) values ('게시판');
insert into board_type (name) values ('사진첩');
insert into board_type (name) values ('동영상');

delete
from board_type;
alter table board_type
    AUTO_INCREMENT = 1;


select * from payment_history;

delete from payment_history;
alter table payment_history
    AUTO_INCREMENT = 1;


SELECT SUM(payment) AS total_payment
FROM payment_history
WHERE create_at like '2024-08%';
