import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import { axiosPostList } from "./utils/postUtils";
import { findByHompyIdAxios } from "./utils/hompyUtils";
import { list } from "./utils/FolderUtils";
import * as Swal from "../../../apis/alert"
import { CommentAction } from "../../../redux/actions/CommentAction";
import { PostAction } from "../../../redux/actions/PostAction";
import { hompyInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const keyword =['board','photo','video'];

const Post = () => {
  const { hompyId, postName, folderId } = useParams();
  const {hompyInfo} = useContext(LoginContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folder = useSelector((state) => state.folder.folder);
  const hompy = useSelector((state) => state.hompy.hompy);
  const page = useSelector((state) => state.post.page);

  useEffect(() => {
    if(keyword.some(item => postName.includes(item)) && hompyInfo.id !== undefined){
      list(postName, dispatch, hompyId);
      findByHompyIdAxios(dispatch, hompyId);
      dispatch(CommentAction.contentState(false,""));
      dispatch(CommentAction.contentErrorState("content",false))
    }

  }, [postName, hompyId, dispatch]);

  useEffect(() => {
    if ((folder || folder?.length > 0 ) && hompyInfo.id !== undefined) {
      try{
        axiosPostList(dispatch, folder?.id, hompyId, postName, page);
        dispatch(CommentAction.contentState(false,""));
        dispatch(CommentAction.contentErrorState("content",false))
        dispatch(PostAction.postErrorState("subject",false))
        dispatch(PostAction.postErrorState("content",false))
      }catch(e){
        Swal.alert("게시글을 불러오는데 실패했습니다.",e,"error");
      }
       navigate(`/hompy/${hompyId}/${postName}/${folder?.id}`);
    }
  }, [page, folder?.id,folderId]);
  

  return (
    <>
      <Layout hompy={hompy} user={hompy.user}>
        <Outlet />
      </Layout>
    </>
  );
};

export default Post;
