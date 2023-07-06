import React,{useState} from "react"
import PropTypes from "prop-types"

const Loadbtn = (props)=>{

    console.log('props',props)

return(

    <>
    <button
        className="btn btn-primary btn-block mt-2"
        type="submit"
        disabled ={props.loading || props.disabled}
        >
         {props.loading == true ? <span> <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>  {props.btnname}</span> : props.btnname }
        </button>
    </>
)

}
Loadbtn.propTypes = {
    loading:PropTypes.any,
    btnloadname:PropTypes.any,
    btnname:PropTypes.any,
    disabled: PropTypes.bool
  }

export default Loadbtn;