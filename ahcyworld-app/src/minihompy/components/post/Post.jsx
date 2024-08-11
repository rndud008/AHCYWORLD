import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import { axiosPostList } from "./utils/postUtils";
import { findByHompyIdAxios } from "./utils/hompyUtils";
import { list } from "./utils/FolderUtils";

const keyword =['board','photo','video'];

const Post = () => {
  const { hompyId, postName, folderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folder = useSelector((state) => state.folder.folder);
  const hompy = useSelector((state) => state.hompy.hompy);
  const page = useSelector((state) => state.post.page);

  useEffect(() => {
    if(keyword.some(item => postName.includes(item))){

      list(postName, dispatch, hompyId);
      findByHompyIdAxios(dispatch, hompyId);
    }
  }, [postName, hompyId]);

  useEffect(() => {
    if (folder || folder?.length > 0) {
      axiosPostList(dispatch, folder.id, hompyId, postName, page);
      navigate(`/hompy/${hompyId}/${postName}/${folder.id}`);
    }
  }, [page, folder,dispatch]);


  return (
    <>
      <Layout hompy={hompy} user={hompy.user}>
        <Outlet />
      </Layout>
    </>
  );
};

export default Post;
