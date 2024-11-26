import { Modal } from 'react-bootstrap'
import './ModalModificado.css'
import Button from '../Button/Button'
import { useState } from 'react'
import { Skeleton, Typography } from '@mui/material'
function ModalModificado ({
  show,
  handleClose,
  title = '',
  size = 40,
  children
}) {
  const [transicion, setTransicion] = useState(false)
  return (
    <Modal
      show={show}
      backdrop='static'
      dialogClassName={`modal-${size}w`}
      onHide={handleClose}
      onEntered={()=>setTransicion(false)}
      onExit={()=>setTransicion(true)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transicion ? <>
          <Typography variant="h2">{transicion ? <Skeleton /> : ''}</Typography>
          <Typography variant="h2">{transicion ? <Skeleton /> : ''}</Typography>
          <Typography variant="h2">{transicion ? <Skeleton /> : ''}</Typography>

        </> : children}</Modal.Body>
    </Modal>
  )
}

export default ModalModificado
