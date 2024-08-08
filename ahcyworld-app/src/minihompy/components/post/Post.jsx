import React, { useContext, useEffect, useState } from "react";
import BoardTypeList from "./BoardTypeList";
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams, useRoutes } from "react-router-dom";
import Header from "../../../webpage/components/Header/Header";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Post.css";
import PostDetail from "./PostDetail";
import PostList from "./PostList";
import PostWrite from "./PostWrite";
import PostUpdate from "./PostUpdate";
import PostListDetail from "./PostListDetail";
import { FolderAction } from "../../../redux/actions/FolderAction";
import { PostAction } from "../../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider";
import Layout from "../Layout/Layout";
import { hompyInfo } from "../../../apis/auth";

const Post = ({page}) => {
    const { hompyId, postName } = useParams();
    const {userInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(hompyId,'post')

    const {hompyInfo} = useContext(LoginContext);

    // const [folderList, setFolderList] = useState([]);
    const folder = useSelector((state) => state.folder.folder)
    const folderList = useSelector((state)=> state.folder.folderList)
    const pageAndPostList = useSelector((state) => state.post.pageAndPostList)
  
    const axiosPostList = async() =>{
      const folderId = folder?.id !== null ? folder.id : folderList?.[0]?.id
  
      // const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list?page=${page}`)
      // console.log(folderList[0],'folderList[0]')
      // console.log('axiosPostList',folderId)
  
      // const {data, status} = response;
  
      // if(status === 200){
        // setPageAndPostList(data);
      // }
  
      try{
        await dispatch(PostAction.axiosPostList(hompyId,postName,folderId,page))
      }catch(error){
        return list();
      }
    }
  
    const list = async () => {
      if (postName) {
        // const response = await api.get(
        //   `http://localhost:8070/${hompyId}/${postName}/list`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //     },
        //   }
        // );
        // const { data } = response;
        // setFolderList(data);
        // dispatch(FolderAction.clickFolder(null))
        dispatch(FolderAction.getFolderListAxios(hompyId,postName))
        // dispatch(FolderAction.)
      }
    };
  
    useEffect( ()=>{
      list();
    },[postName])
  
    useEffect(()=>{
      if(folder || folder?.length >0){
        axiosPostList();
        navigate(`/hompy/${hompyId}/${postName}/${folder.id}`)
      }
    },[page,folder?.id])
  
  
    return userInfo?.id != null && (
      <>
      {/* 쿠키 를 이용하여 로그인 한 회원인지 체크. */}
        <Layout hompy={hompyInfo} user={hompyInfo.user}>
          {/* <Header /> */}
          <Container>
            <Row>
              <Col>
                <BoardTypeList />
              </Col>
              <Col>
                <Outlet />
              </Col>
            </Row>
            {/* <Container>
              <Button variant="none">
                <Link to={`/post/${hompyId}/${"board"}`}>게시판</Link>
              </Button>
              <Button variant="none">
                <Link to={`/post/${hompyId}/${"video"}`}>비디오</Link>
              </Button>
              <Button variant="none">
                <Link to={`/post/${hompyId}/${"photo"}`}>사진첩</Link>
              </Button>
            </Container> */}
          </Container>
        </Layout>
      </>
    );
  };

export default Post;
