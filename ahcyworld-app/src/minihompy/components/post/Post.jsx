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
import Layout from "../Layout/Layout";
import { hompyInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import { HompyAction } from "../../../redux/actions/HompyAction";

const Post = ({ page }) => {
  const { hompyId, postName } = useParams();
  const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hompyInfo } = useContext(LoginContext);
  const folder = useSelector((state) => state.folder.folder);
  const folderList = useSelector((state) => state.folder.folderList);
  const hompy = useSelector(state => state.hompy.hompy)


  const axiosPostList = async () => {
    const folderId = folder?.id !== null ? folder.id : folderList?.[0]?.id;

    try {
      await dispatch(
        PostAction.axiosPostList(hompyId, postName, folderId, page)
      );
    } catch (error) {
      return list();
    }
  };

  const list = async () => {
    if (postName) {
      dispatch(FolderAction.getFolderListAxios(hompyId, postName));
    }
  };

  const findByHompyIdAxios = async() =>{
    try{
      await dispatch(HompyAction.findByHompyIdAxios(hompyId))
    }catch(e){
      alert(e);
    }
  }

  useEffect(() => {
    list();
    findByHompyIdAxios();
  }, [postName]);

  useEffect(() => {
    if (folder || folder?.length > 0) {
      axiosPostList();
      navigate(`/hompy/${hompyId}/${postName}/${folder.id}`);
    }
  }, [page, folder?.id]);

  return (
    (userInfo?.id !== null ) && (
      <>
        <Layout hompy={hompy} user={hompy.user}>
          {/* <Container>
            <Row>
              <Col>
                <BoardTypeList />
              </Col>
              <Col>
              </Col>
            </Row>
          </Container> */}
                <Outlet />
        </Layout>
      </>
    )
  );
};

export default Post;
