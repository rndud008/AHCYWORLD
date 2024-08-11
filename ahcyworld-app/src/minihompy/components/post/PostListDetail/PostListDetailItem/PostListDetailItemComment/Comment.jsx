import React, { useContext } from 'react'

import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { commentDeleteAxios, commentWriteAxios, contentState } from '../../../utils/commentUtils';
import { LoginContext } from '../../../../../../webpage/components/login/context/LoginContextProvider'; 
import { useDispatch, useSelector } from 'react-redux';

const Comment = ({commentShow,item}) => {
  const {postName} = useParams();
  const {userInfo} = useContext(LoginContext)
  const dispatch =useDispatch();
  const photoAndVideoCommentList = useSelector(
    (state) => state.comment.photoAndVideoCommentList
  );
  const result = photoAndVideoCommentList.find(
    (findItem) => findItem.postId === item.id
  );

  const content = useSelector(state => state.comment.content)

  return (
    <>
      {commentShow && (
          <div>
            {result?.data?.length === 0 ? (
              <div>작성된 댓글이 없습니다.</div>
            ) : (
              result?.data.map((item) => (
                <div style={{ display: "flex" }}>
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  <p>{item.content}</p>
                  {item.user.id === userInfo.id && (
                    <Button
                      onClick={() =>
                        commentDeleteAxios(dispatch, item.id, item.post.id, postName)
                      }
                    >
                      삭제
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div>
          <label>댓글</label>
          <input
            onChange={(e) => contentState(dispatch,e.target.value)}
            placeholder="댓글입력"
          />
          <Button
            onClick={() =>
              commentWriteAxios(dispatch, userInfo, item, content, postName)
            }
          >
            확인
          </Button>
        </div>
    </>
  )
}

export default Comment