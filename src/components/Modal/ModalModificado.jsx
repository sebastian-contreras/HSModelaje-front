import {  Modal } from "react-bootstrap"
import './ModalModificado.css'
import Button from "../Button/Button"
function ModalModificado({show, handleClose,title='',size=40,children}) {

  return (
    <Modal show={show}         backdrop="static"
    dialogClassName={`modal-${size}w`} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>

    {children}

  </Modal>
  )
}

export default ModalModificado