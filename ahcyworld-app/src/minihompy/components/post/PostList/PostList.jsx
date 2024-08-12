import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import PostItem from "./PostDetail/PostItem/PostItem";
import PageNation from "../PageNation/PageNation";
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider";
import { useSelector } from "react-redux";
import "./PostList.style.css";

// boardType 에 따라 PostDetail or PostListDetail 출력.
const PostList = () => {
  const { hompyId, postName } = useParams();
  const { hompyInfo } = useContext(LoginContext);
  const pageAndPostList = useSelector((state) => state.post.pageAndPostList);
  const folder = useSelector((state) => state.folder.folder);

  return (
    <>
      <Container className="postContainer">
        <div className="postListHeader">
          {folder && <h4>{folder.name}</h4>}
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
       

        <Table bgcolor="none" className="post-list-table" bordered hover>
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
              <td colSpan={5} className="postBackImg">
                <p>게시물이 존재하지 않습니다.</p>
              </td>
            )}
          </tbody>
        </Table>
        <PageNation />
      </Container>
    </>
  );
};

export default PostList;
