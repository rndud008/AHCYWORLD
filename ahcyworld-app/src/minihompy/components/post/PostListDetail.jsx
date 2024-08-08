import React, { useContext, useEffect } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PageNation from "./PageNation";
import PostItem from "./PostItem";
import PostListDetailItem from "./PostListDetailItem";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider"; 
import { useSelector } from "react-redux";

const PostListDetail = ({
  setPage,
  moveFolderId,
  setMoveFolderId,
}) => {

  const { postName, hompyId } = useParams();
  const { hompyInfo } = useContext(LoginContext);
  const pageAndPostList = useSelector(state => state.post.pageAndPostList);
  const folder = useSelector(state => state.folder.folder);

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
                      {postName} 올리기
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {pageAndPostList?.posts != null ? (
            pageAndPostList?.posts?.map((item) => {
              return (
                <PostListDetailItem
                  key={item}
                  item={item}
                  // folderList={folderList}
                  moveFolderId={moveFolderId}
                  setMoveFolderId={setMoveFolderId}
                />
              );
            })
          ) : (
            <h4>게시물이 존재하지 않습니다.</h4>
          )}
        </div>
        <div>
          <PageNation setPage={setPage} />
        </div>
      </Container>
    </>
  );
};

export default PostListDetail;
