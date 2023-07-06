import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

import { appCreators } from 'store/app/appReducer';
import profileLogo from "assets/images/profileLogonew.jpg"
import { mainReducerCreators,mainReducerTypes } from "store/reducers";

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  var appState = JSON.parse(localStorage.getItem('applicationState')); 
  const appReducer = appState && appState.appReducer && appState.appReducer;
  const userDetails = appState && appState.appReducer && appState.appReducer.userDetails;
  const appRole = userDetails && userDetails.appRole;
  let firstName = userDetails && userDetails.firstName ;
  let lastName = userDetails && userDetails.lastName;
  
  let profilename = firstName ? firstName : "" +" "+lastName ? lastName : "" ;

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
          <img
            className="rounded-circle header-profile-user"
            src={profileLogo}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2">{firstName ? firstName  : ""} {lastName ? lastName : "" }</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"/>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1"/>
            {props.t("Profile")}{" "}
          </DropdownItem>
          
          <div className="dropdown-divider"/>
          <div style={{padding:'0px', margin:'0px'}} onClick={props.logoutUser}>
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
            <span>{props.t("Logout")}</span>
          </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
  logoutUser : PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

const mapDispatchtoProps = (dispatch)=>({
  logoutUser:() => dispatch(mainReducerCreators.userLogout())
});

export default withRouter(
  connect(mapStatetoProps,mapDispatchtoProps)(withTranslation()(ProfileMenu))
)
