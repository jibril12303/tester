import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import TimeoutModal from "components/Common/TimeoutModal"
import { browserName, browserVersion } from "react-device-detect";
import EditprofileAlert from "components/Common/editprofileAlert";

import { connect, useSelector,useDispatch } from "react-redux"

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isLoggedIn,
  unsupportedBrowser,
  ...rest
}) => (


 

  <Route
    {...rest}
    render={props => {
  if (isAuthProtected && !isLoggedIn ) {
        return (
          <Redirect
            to={{ pathname: "/login"}}
          />
        )
      }

      return (
        <Layout>
          <Component {...props} />
          <TimeoutModal />
          <EditprofileAlert/>
          </Layout>
      )
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  unsupportedBrowser:PropTypes.bool,
}

export default Authmiddleware;
