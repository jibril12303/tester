import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from "reactstrap"

import { appCreators } from 'store/app/appReducer';
import profileLogo from "assets/images/profileLogonew.jpg"

import { bchDashboardTypes, bchDashboardCreators } from "store/dashboard/reducer"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect,useSelector, useDispatch } from "react-redux"
import { withRouter, Link } from "react-router-dom"


const Orgdropdown = props => {
  
  const dispatch = useDispatch()

    // Declare a new state variable, which we'll call "menu"
  var appState = JSON.parse(localStorage.getItem('applicationState')); 
  const appReducer = appState && appState.appReducer && appState.appReducer;
  const userDetails = appState && appState.appReducer && appState.appReducer.userDetails;
  const appRole = userDetails && userDetails.appRole;
  let firstName = userDetails && userDetails.firstName ;
  let lastName = userDetails && userDetails.lastName;

  const {organisations,selectedOrg} = useSelector(state => ({
    organisations: state.appReducer.userDetails.organisation,
    selectedOrg: state.Dashboard.orgID
}))
  
const orgOption = [];
organisations && organisations.map((item)=>{
    orgOption.push({label: item.name, value: item.name, orgID: item._id})
})
 
console.log("orgOption",orgOption)
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("")


  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          
          <i className="bx bx-shuffle font-size-22" id="changeorg"/>
          <UncontrolledTooltip
                target="changeorg" >
                                        Change organisation
                </UncontrolledTooltip>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
            {orgOption && orgOption.map((item,key)=>{
              return(<div key={key}>
                <DropdownItem key={key}>
                <p onClick={()=>dispatch(bchDashboardCreators.setUserOrganisation(item))}>{item.label}</p>
              </DropdownItem>
             
                </div>
            )})}
          
          
          

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

Orgdropdown.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
  logoutUser : PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

const mapDispatchtoProps = (dispatch)=>({
  logoutUser:() => dispatch(appCreators.clearToken())
});

export default withRouter(
  connect(mapStatetoProps,mapDispatchtoProps)(withTranslation()(Orgdropdown))
)
