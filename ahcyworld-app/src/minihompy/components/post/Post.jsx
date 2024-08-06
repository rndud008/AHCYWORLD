import React, { useContext, useEffect, useState } from "react";
import BoardTypeList from "./BoardTypeList";
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams, useRoutes } from "react-router-dom";
// import Header from "../../login/components/Header/Header";
import Header from "../../../webpage/components/Header/Header";
// import api from "../../../apis/api";
import Cookies from "js-cookie";
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

const Post = () => {
    const { hompyId, postName } = useParams();
    const { userInfo } = useContext(LoginContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [moveFolderId, setMoveFolderId] = useState();
    // const [folderList, setFolderList] = useState([]);
    const folder = useSelector((state) => state.folder.folder);
    const folderList = useSelector((state) => state.folder.folderList);
    const pageAndPostList = useSelector((state) => state.post.pageAndPostList);

    const axiosPostList = async () => {
        const folderId = folder?.id !== null ? folder.id : folderList?.[0]?.id;

        // const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list?page=${page}`)
        // console.log(folderList[0],'folderList[0]')
        // console.log('axiosPostList',folderId)

        // const {data, status} = response;

        // if(status === 200){
        // setPageAndPostList(data);
        // }

        dispatch(PostAction.axiosPostList(hompyId, postName, folderId, page));
    };

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
            dispatch(FolderAction.getFolderListAxios(hompyId, postName));
        }
    };

    useEffect(() => {
        list();
    }, [postName]);

    useEffect(() => {
        if (folder || folder?.length > 0) {
            axiosPostList();
            navigate(`/post/${hompyId}/${postName}/${folder.id}`);
        }
    }, [page, folder?.id]);

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
                                // setFolderList={setFolderList}
                                // setPageAndPostList={setPageAndPostList}
                                folder={folder}
                                // setFolder={setFolder}
                                hompyId={hompyId}
                            />
                        </Col>
                        <Col>
                            <Outlet />
                            <Routes>
                                <Route
                                    path=':folderId'
                                    element={
                                        postName.includes("board") ? (
                                            <PostList
                                                pageAndPostList={pageAndPostList}
                                                folder={folder}
                                                setPage={setPage}
                                            />
                                        ) : (
                                            <PostListDetail
                                                pageAndPostList={pageAndPostList}
                                                folderList={folderList}
                                                moveFolderId={moveFolderId}
                                                setMoveFolderId={setMoveFolderId}
                                                folder={folder}
                                                setPage={setPage}
                                            />
                                        )
                                    }
                                />
                                <Route
                                    path=':folderId/detail/:postId'
                                    element={
                                        <PostDetail
                                            folderList={folderList}
                                            moveFolderId={moveFolderId}
                                            setMoveFolderId={setMoveFolderId}
                                        />
                                    }
                                />
                                <Route path=':folderId/write' element={<PostWrite />} />
                                <Route path=':folderId/update/:postId' element={<PostUpdate />} />
                            </Routes>
                        </Col>
                    </Row>
                    <Container>
                        <Button variant='none'>
                            <Link to={`/post/${hompyId}/${"board"}`}>게시판</Link>
                        </Button>
                        <Button variant='none'>
                            <Link to={`/post/${hompyId}/${"video"}`}>비디오</Link>
                        </Button>
                        <Button variant='none'>
                            <Link to={`/post/${hompyId}/${"photo"}`}>사진첩</Link>
                        </Button>
                    </Container>
                </Container>
            </div>
        </>
    );
};

export default Post;
