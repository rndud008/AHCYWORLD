import React, { useContext } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { LoginContext } from "../../../../../webpage/components/login/context/LoginContextProvider" 
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { folderClick, handleShow } from "../../utils/FolderUtils";
import "./Folder.style.css";

const Folder = ({ item }) => {
  const { hompyInfo } = useContext(LoginContext);
  const { hompyId, postName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const folder = useSelector((state) => state.folder.folder);

  return (
    <>
      {folder && (
        <ListGroup.Item key={item.id} className="board-type-list-group-item">
          <Form.Check
            type="radio"
            id={`folder-radio-${item.id}`}
            name="folder"
            value={item.name}
            label={item.name}
            onClick={(e) =>
              folderClick(e, dispatch, navigate, hompyId, postName)
            }
            checked={item.id === folder.id}
          />
          {parseInt(hompyId) === hompyInfo?.id && (
            <button
              id={item.id}
              onClick={(e) => handleShow(e, dispatch)}
            >
              수정
            </button>
          )}
        </ListGroup.Item>
      )}
    </>
  );
};

export default Folder;
