import React, { useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import { axiosPostList } from "./utils/postUtils";
import { findByHompyIdAxios } from "./utils/hompyUtils";
import { list } from "./utils/FolderUtils";
import * as Swal from "../../../apis/alert";
import { CommentAction } from "../../../redux/actions/CommentAction";
import { PostAction } from "../../../redux/actions/PostAction";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import { HompyAction } from "../../../redux/actions/HompyAction";
import LoadingSpinner from "../../pages/LoadingSpinner";

const keyword = ["board", "photo", "video"];

const Post = () => {
  const { hompyId, postName, folderId } = useParams();
  const { hompyInfo, roles } = useContext(LoginContext);
  const [isLoading,setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folder = useSelector((state) => state.folder.folder);
  const hompy = useSelector((state) => state.hompy.hompy);
  const page = useSelector((state) => state.post.page);
  const photoVisibleCheck =
    (hompy.menuStatus?.split(",")[0] === "visible" || roles?.isAdmin) &&
    postName.includes("photo");
  const boardVisibleCheck =
    (hompy.menuStatus?.split(",")[1] === "visible" || roles?.isAdmin) &&
    postName.includes("board");
  const videoVisibleCheck =
    (hompy.menuStatus?.split(",")[2] === "visible" || roles?.isAdmin) &&
    postName.includes("video");

    const extraCheck = photoVisibleCheck || boardVisibleCheck || videoVisibleCheck;

    const isHompyLoaded = hompy && Object.keys(hompy).length > 0;

  useEffect(() => {

    const fetchData = async () =>{

      if (
        keyword.some((item) => postName.includes(item)) 
      ) {
        try{
          setIsLoading(true)
          await list(postName, dispatch, hompyId, navigate);
          await findByHompyIdAxios(dispatch, hompyId);
          dispatch(CommentAction.contentState(false, ""));
          dispatch(CommentAction.contentErrorState("content", false));
          dispatch(HompyAction.findByHompyIdAxios(hompyId));
        }catch(e){
          
        }finally{
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [postName, hompyId,hompyInfo]);

  useEffect(() => {

    const fetchPost = async() =>{
      if ((folder && Object.keys(folder).length > 0) && hompyInfo.id !== undefined ) {
        try {
          setIsLoading(true)
          await axiosPostList(dispatch, folder?.id, hompyId, postName, page, navigate);
          dispatch(CommentAction.contentState(false, ""));
          dispatch(CommentAction.contentErrorState("content", false));
          dispatch(PostAction.postErrorState("subject", false));
          dispatch(PostAction.postErrorState("content", false));
          navigate(`/hompy/${hompyId}/${postName}/${folder?.id}`);
        } catch (e) {
          Swal.alert("게시글을 불러오는데 실패했습니다.", e, "error");
        }finally{
          setIsLoading(false)
        }
      }
    }

      fetchPost()

  }, [page, folder?.id,]);


  if (!isHompyLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isHompyLoaded && (extraCheck && isLoading) && <LoadingSpinner /> ||
        (((extraCheck && !isLoading) &&  (

            <Outlet />

        )) || 
          Swal.alert(
            "잘못된 접근입니다.",
            "메인페이지로 돌아갑니다.",
            "error",
            navigate("/")
          ))}
    </>
  );
};

export default Post;
