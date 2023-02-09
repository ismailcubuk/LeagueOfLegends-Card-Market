import './Alert.css';
import React, { useContext } from 'react'
import CardContext from '../../component/CardContext'
import Modal from 'react-bootstrap/Modal';
function Alert() {
    const { alertt, setAlertt } = useContext(CardContext)
    const handleClose = () => setAlertt(false);
    return (
        <div>
            <Modal show={alertt} onHide={handleClose}>
                <Modal.Header className='alert-moodle-header' closeButton>
                    <h2>ALERT !</h2>
                </Modal.Header>
                <Modal.Body className='alert-moodle-body'>INSUFFICIENT BALANCE !</Modal.Body>
            </Modal>

        </div>
    )
}

export default Alert