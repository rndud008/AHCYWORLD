import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PageNation from "../PageNation/PageNation";
import PostListDetailItem from "./PostListDetailItem/PostListDetailItem";
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider";
import { useSelector } from "react-redux";

const PostListDetail = () => {
  const { postName, hompyId } = useParams();
  const { hompyInfo , roles} = useContext(LoginContext);
  const pageAndPostList = useSelector((state) => state.post.pageAndPostList);
  const folder = useSelector((state) => state.folder.folder);

  console.log('PostListDetail :' ,hompyInfo)

  return (
    <>
      <Container className="postContainer">
        <div className="postListHeader">
          {folder && <h4>{folder.name}</h4>} 
          {(parseInt(hompyId) === hompyInfo?.id) && (
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
              return <PostListDetailItem item={item} />;
            })
          ) : (
            <h4>게시물이 존재하지 않습니다.</h4>
          )}
        </div>
        <div>
          <PageNation />
        </div>
      </Container>
    </>
  );
};

export default PostListDetail;
