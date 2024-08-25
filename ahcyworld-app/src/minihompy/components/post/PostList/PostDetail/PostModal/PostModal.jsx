import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { changeValue, handleClose, moveFolder } from "../../../utils/postUtils";
import { useDispatch, useSelector } from "react-redux";
import "./PostModal.style.css";

const PostModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hompyId, postName, folderId, postId } = useParams();
  const show = useSelector((state) => state.post.show);
  const moveFolderId = useSelector((state) => state.post.moveFolderId);
  const folderList = useSelector((state) => state.folder.folderList);

  return (
    <>
      <Modal show={show} onHide={() => handleClose(dispatch)}>
        <Modal.Header closeButton>
          <Modal.Title>폴더 이동</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) =>
              moveFolder(
                e,
                dispatch,
                hompyId,
                postName,
                folderId,
                postId,
                moveFolderId,
                navigate
              )
            }
          >
            <Form.Group className="modalFolderList">
              <Form.Label>{`<폴더 리스트>`}</Form.Label>
              <div>
                {folderList &&
                  folderList.map((item) => {
                    return (
                      <Form.Check
                        type="radio"
                        key={item.id}
                        id={`move-folder-radio-${item.id}`}
                        value={item.name}
                        name="folder"
                        label={item.name}
                        onChange={(e) => changeValue(e, dispatch)}
                        checked={item.id === parseInt(moveFolderId)}
                      />
                    );
                  })}
              </div>
            </Form.Group>

            <div className="modalFolderListButton">
              <Button className="postedit-btn" type="submit">
                이동
              </Button>
              <Button className="postdelete-btn" onClick={() => handleClose(dispatch)}>
                취소
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostModal;
