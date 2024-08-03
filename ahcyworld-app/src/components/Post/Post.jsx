import React, { useEffect, useState } from "react";
import BoardTypeList from "./BoardTypeList";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  useRoutes,
} from "react-router-dom";
import Header from "../../login/components/Header/Header";
import api from "../../login/apis/api";
import Cookies from "js-cookie";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Post.css";
import PostDetail from "./PostDetail";
import PostList from "./PostList";

const Post = () => {
  const location = useLocation(); // 현재 위치 정보를 가져옴
  // const postName = location.pathname.split("/")[3];
  // let hompyId = location.pathname.split("/")[2];

  const {hompyId,postName} = useParams();

  console.log("post name : ", postName);
  console.log("hompy Id: ", hompyId);

  const [folderList, setFolderList] = useState([]);
  const [pageAndPostList, setPageAndPostList] = useState([]);
  const [folder, setFolder] = useState({
    id: "",
    boardType: "",
    name: "",
    hompy: "",
    status: "",
  });

  const list = async () => {
    if (postName) {
      const response = await api.get(
        `http://localhost:8090/${hompyId}/${postName}/list`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const { data } = response;

      setFolderList(data);

    }
  };

  useEffect(() => {
    list();
    setFolder([]);
    setPageAndPostList([]);
    
  }, [postName, hompyId]);


  return (
    <>
      <div>
        <Header />
        <Container>
          <Row>
            <Col>
              <div>
                <BoardTypeList
                  folderList={folderList}
                  postName={postName}
                  setFolderList={setFolderList}
                  setPageAndPostList={setPageAndPostList}
                  folder={folder}
                  setFolder={setFolder}
                  hompyId={hompyId}
                />
              </div>
            </Col>
            <Col>
              <Outlet />
              <Routes>
                <Route
                  path=""
                  element={
                    <PostList
                      pageAndPostList={pageAndPostList}
                      folder={folder}
                    />
                  }
                />
                <Route
                  path=":folderId/detail/:postId"
                  element={<PostDetail />}
                />
              </Routes>
            </Col>
          </Row>
          <Container>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${'board'}`}>게시판</Link>
            </Button>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${'video'}`}>비디오</Link>
            </Button>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${'photo'}`}>사진첩</Link>
            </Button>
          </Container>
        </Container>
      </div>
    </>
  );
};

export default Post;
