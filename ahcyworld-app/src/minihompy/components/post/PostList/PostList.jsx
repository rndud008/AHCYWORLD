import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import PostItem from "./PostDetail/PostItem/PostItem";
import PageNation from "../PageNation/PageNation"
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider";
import { useSelector } from "react-redux";

// boardType 에 따라 PostDetail or PostListDetail 출력.
const PostList = () => {
  const { hompyId, postName } = useParams();
  const { hompyInfo } = useContext(LoginContext);
  const pageAndPostList = useSelector(state => state.post.pageAndPostList);
  const folder = useSelector((state) => state.folder.folder);

  return (
    <>
      <Container>
        <div className="postListHeader">
          {folder && <div>{folder.name}</div>}
          {parseInt(hompyId) === hompyInfo?.id && (
            <>
              {folder && (
                <div>
                  <Button variant="none">
                    {" "}
                    <Link
                      to={`/hompy/${hompyId}/${postName}/${folder.id}/write`}
                    >
                      글쓰기
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <Table striped bordered hover>
          {pageAndPostList.url && (
            <thead>
              <tr>
                <th>#</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회</th>
              </tr>
            </thead>
          )}
          <tbody>
            {pageAndPostList?.posts !== null ? (
              pageAndPostList?.posts?.map((item) => {
                return <PostItem key={item.id} item={item} />;
              })
            ) : (
              <h4>게시물이 존재하지 않습니다.</h4>
            )}
          </tbody>
        </Table>
        <div>
          <PageNation />
        </div>
      </Container>
    </>
  );
};

export default PostList;
