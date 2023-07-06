import React from "react"
import PropTypes from "prop-types"
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Media,
    Table,
    Label,
    UncontrolledTooltip,
} from "reactstrap"
import { bchDashboardCreators } from "store/dashboard/reducer"
import { useDispatch } from "react-redux"
function OrthopticsCheckModal({isOpen,closeModal,token}) {
  const dispatch = useDispatch()
  return (
    <div>
      <Modal
        isOpen={isOpen}
        scrollable={true}
        backdrop={"static"}
        centered={true}
        id="staticBackdrop"
      >
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLabel">
            <i className="fa fa-warning"></i> On-Duty Confirmation
          </h5>
          <button
            type="button"
            className="btn btn-danger btn-close"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body ">
          <p>Are you the Duty Orthoptist for today?</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
                closeModal()
            }}
          >
            No
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              dispatch(bchDashboardCreators.updateOnCallRegistrar(token))
            //   setbasic(false)
            closeModal()
            }}
          >
            Yes
          </button>
        </div>
      </Modal>
    </div>
  )
}

OrthopticsCheckModal.propTypes = {
    isOpen: PropTypes.any,
    closeModal:PropTypes.func,
    token: PropTypes.string
}

export default OrthopticsCheckModal
