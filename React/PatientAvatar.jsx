import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "react-avatar-edit";
import defaultAvatar from "../../assets/images/avatar/avatarDefault.jpg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import debug from "sabio-debug";
import fileServices from "services/fileService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const _logger = debug.extend("AddHorseForm");

export default function Cropper(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [src, setSrc] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (src.length > 0) {
      uploadFile();
    }
  }, [src]);

  const onClose = () => {
    setPreview(null);
    setIsModalOpen(false);
  };

  const onCrop = (view) => {
    setPreview(view);
  };
  const showModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSrc([preview]);
    setIsModalOpen(false);
  };

  //editor returns base64 raw binary data held in string that needs to be converted to a Blob object for upload
  const toBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  const uploadFile = () => {
    var blob = toBlob(src[0]);
    const formData = new FormData();
    formData.append("fileList", blob, "filename.png");

    _logger(formData, src, blob);
    fileServices
      .uploadFile(formData)
      .then(onUploadFileSuccess)
      .catch(onUploadFileError);
  };
  const onUploadFileSuccess = (response) => {
    if (response?.items?.length > 0) {
      const fileUrl = response.items;
      _logger({ success: fileUrl });
      props.onUploadSuccess(fileUrl);
    }
  };
  const onUploadFileError = (error) => {
    toast.error("There was a network error!", error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <div>
      <img
        className="horse-addform-avatar"
        alt="Profile"
        src={
          src[0]
            ? src[0]
            : props.horseAvatar
            ? props.horseAvatar
            : defaultAvatar
        }
      />
      <p />
      <Button className="mb-1" type="primary" onClick={showModal}>
        Add Picture
      </Button>
      <Modal title="Change Profile Picture" show={isModalOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body className="addhorse-avatar-body">
          <Avatar
            width={400}
            height={300}
            onCrop={onCrop}
            onClose={onClose}
            src={src[0]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOk}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
Cropper.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
  horseAvatar: PropTypes.string,
};
