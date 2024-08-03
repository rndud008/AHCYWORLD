import React, { useEffect } from "react";
import PostDetail from "./PostDetail";
import PostListDetail from "./PostListDetail";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import PostItem from "./PostItem";

// boardType 에 따라 PostDetail or PostListDetail 출력.
const PostList = ({ name, pageAndPostList, folder }) => {
  console.log("PostList 실행")
  console.log("pageAndPostList first", pageAndPostList);
  console.log(
    "pageAndPostList second:",
    pageAndPostList?.posts
      ? pageAndPostList?.posts?.[0].folder.boardType.name
      : "게시물이 존재하지 않습니다."
  );

  console.log("pageAndPostList third", folder);

  return (
    <>
      <Container>
        <div className="postListHeader">
          {folder[0] && <div>{folder[0].name}</div>}
          {folder[0] && (
            <div>
              <Button>글쓰기</Button>
            </div>
          )}
        </div>
        <Table striped bordered hover >
          {pageAndPostList.url && <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
            </tr>
          </thead>}
          <tbody>
            {pageAndPostList?.posts !== null ?
              pageAndPostList?.posts?.map((item) => {
                return (
                  <PostItem item ={item} />
                );
              }) : <h4>게시물이 존재하지 않습니다.</h4>}
          </tbody>
        </Table>
        <div>
        
        </div>
      </Container>
    </>
  );
};

export default PostList;
