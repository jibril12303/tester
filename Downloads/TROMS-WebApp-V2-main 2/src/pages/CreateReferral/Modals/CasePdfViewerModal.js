import React from "react"
import PropTypes from "prop-types"
import { Offcanvas } from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import "moment-timezone"

const CasePdfViewerModal = ({ showModal, modalClose, openFeedbackModal }) => {
  const { casePdfData } = useSelector(state => ({
    casePdfData: state.CreateReferral.CasePdfDetails,
  }))

  return (
    <Offcanvas
      isOpen={showModal}
      style={{ width: "40vw" }}
      scrollable={false}
      backdrop={"static"}
      placement={"end"}
      direction={"end"}
      toggle={() => modalClose()}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">
          <i className="fa fa-warning"></i> Case Details
        </h5>
      </div>
      <div className="modal-body" style={{ padding: "0px" }}>
        {casePdfData?.CasePdfUrl == null ? (
          "Loading..."
        ) : (
          <object
            data={casePdfData?.CasePdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <iframe src={casePdfData?.CasePdfUrl}>
              <p>This browser does not support PDF!</p>
            </iframe>
          </object>
        )}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            modalClose()
            openFeedbackModal()
          }}
        >
          Continue
        </button>
      </div>
    </Offcanvas>
  )
}

CasePdfViewerModal.propTypes = {
  showModal: PropTypes.any,
  modalClose: PropTypes.any,
  openFeedbackModal: PropTypes.any,
}

export default CasePdfViewerModal
