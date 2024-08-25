import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeValue,
  detailListHandleClose,
  moveFolder,
} from "../../../utils/postUtils";

const DetailModal = ({ show, setShow, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hompyId, postName, folderId } = useParams();
  const folderList = useSelector((state) => state.folder.folderList);
  const moveFolderId = useSelector((state) => state.post.moveFolderId);

  return (
    <>
      <Modal
        show={show}
        onHide={(e) => detailListHandleClose(e, setShow, show)}
      >
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
                  folderList.map((folderItem) => {
                    return (
                      <Form.Check
                        key={`move-folder-${folderItem.id}`}
                        type="radio"
                        id={`move-folder-radio-${folderItem.id}`}
                        value={folderItem.name}
                        name="folder"
                        label={folderItem.name}
                        onChange={(e) => changeValue(e, dispatch)}
                        checked={
                          parseInt(folderItem.id) === parseInt(moveFolderId)
                        }
                      />
                    );
                  })}
              </div>
            </Form.Group>
            <div className="modalFolderListButton">
              <Button className="diarywriteok-btn"  type="submit">
                이동
              </Button>

              <Button
                className="diarywriteno-btn"
                name="folderMove"
                variant="secondary"
                onClick={(e) => detailListHandleClose(e, setShow, show)}
              >
                취소
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailModal;
