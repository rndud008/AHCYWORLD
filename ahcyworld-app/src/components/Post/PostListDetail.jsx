import React, { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const PostListDetail = ({ name, pageAndPostList ,folder}) => {
  console.log("pageAndPostList first", pageAndPostList);
  console.log(
    "pageAndPostList second:",
    pageAndPostList?.posts
      ? pageAndPostList?.posts?.[0].folder.boardType.name
      : "게시물이 존재하지 않습니다."
  );

  console.log('pageAndPostList third' , folder)
  return (
    <>
      
      <Container>
        <div className="postListHeader">
        {folder[0] && <div>{folder[0].name}</div>}
        {folder[0] && <div><Button>글쓰기</Button></div>}
        </div>
        <div></div>
      </Container>
    </>
  );
};

export default PostListDetail;
