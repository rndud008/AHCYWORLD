import React, { useContext, useEffect, useState } from "react";
import BoardTypeList from "./BoardTypeList";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
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
import PostWrite from "./PostWrite";
import { LoginContext } from "../../login/context/LoginContextProvider";
import PostUpdate from "./PostUpdate";
import PostListDetail from "./PostListDetail";

const useQuery = () =>{
  return new URLSearchParams(useLocation().search);
}

const Post = () => {
  // const location = useLocation(); // 현재 위치 정보를 가져옴
  // const postName = location.pathname.split("/")[3];
  // let hompyId = location.pathname.split("/")[2];

  const { hompyId, postName } = useParams();
  const query = useQuery();
  const {userInfo} = useContext(LoginContext);
  const navigate = useNavigate();
  
  const [page, setPage] = useState(0);
  const [folderList, setFolderList] = useState([]);
  const [moveFolderId, setMoveFolderId] = useState();
  const [pageAndPostList, setPageAndPostList] = useState([]);
  const [folder, setFolder] = useState({
    id: "",
    boardType: "",
    name: "",
    hompy: "",
    status: "",
  });
  console.log('post folder : ',folder)
  console.log('post folderList : ',folderList)
  console.log(query)

  const axiosPostList = async() =>{
    const folderId = folder[0]?.id !==undefined ? folder[0].id : folderList[0]?.id

    console.log(folderList[0],'folderList[0]')
    const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list?page=${page}`)
    console.log('axiosPostList',response)

    const {data, status} = response;

    if(status === 200){
      setPageAndPostList(data);
      
    }

    
  }

  const list = async () => {
    if (postName) {
      const response = await api.get(
        `http://localhost:8070/${hompyId}/${postName}/list`,
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

  useEffect(()=>{
    axiosPostList()

  },[page,folderList])

  return (
    <>
    {/* 쿠키 를 이용하여 로그인 한 회원인지 체크. */}
      <div>
        <Header />
        <Container>
          <Row>
            <Col>
              <BoardTypeList
                folderList={folderList}
                postName={postName}
                setFolderList={setFolderList}
                setPageAndPostList={setPageAndPostList}
                folder={folder}
                setFolder={setFolder}
                hompyId={hompyId}
              />
            </Col>
            <Col>
              <Outlet />
              <Routes>
                <Route
                  path=""
                  element={
                    postName.includes('board') ?
                    <PostList
                      pageAndPostList={pageAndPostList}
                      folder={folder}
                      setPage={setPage}
                    />
                    :
                    <PostListDetail
                      pageAndPostList={pageAndPostList}
                      folderList={folderList}
                      moveFolderId={moveFolderId}
                      setMoveFolderId={setMoveFolderId}
                      folder={folder}
                      setPage={setPage}
                    />
                  }
                />
                <Route
                  path=":folderId/detail/:postId"
                  element={
                    <PostDetail
                      folderList={folderList}
                      moveFolderId={moveFolderId}
                      setMoveFolderId={setMoveFolderId}
                    />
                  }
                />
                <Route path=":folderId/write" element={<PostWrite />} />
                <Route path=":folderId/update/:postId" element={<PostUpdate />} />
              </Routes>
            </Col>
          </Row>
          <Container>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${"board"}`}>게시판</Link>
            </Button>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${"video"}`}>비디오</Link>
            </Button>
            <Button variant="none">
              <Link to={`/post/${hompyId}/${"photo"}`}>사진첩</Link>
            </Button>
          </Container>
        </Container>
      </div>
    </>
  );
};

export default Post;
