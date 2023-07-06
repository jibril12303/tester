import PropTypes from 'prop-types'
import React, { useState } from "react"

import { useHistory } from "react-router-dom";

import { connect } from "react-redux"
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Button, UncontrolledDropdown, DropdownItem, Badge, Container } from "reactstrap"
import ReactDrawer from 'react-drawer';
import 'react-drawer/lib/react-drawer.css';
import { Link } from "react-router-dom"
import OrgDropdown from 'components/CommonForBoth/TopbarDropdown/OrgDropdown';

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, UncontrolledTooltip } from "reactstrap"

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import RightSidebar from "../CommonForBoth/RightSidebar"
import megamenuImg from "../../assets/images/megamenu-img.png"

// import images
import github from "../../assets/images/brands/github.png"
import bitbucket from "../../assets/images/brands/bitbucket.png"
import dribbble from "../../assets/images/brands/dribbble.png"
import dropbox from "../../assets/images/brands/dropbox.png"
import mail_chimp from "../../assets/images/brands/mail_chimp.png"
import slack from "../../assets/images/brands/slack.png"

import logo from "../../assets/images/logo.svg"
import logoLightSvg from "../../assets/images/logo-light.svg"

//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"
import { bchDashboardCreators } from 'store/dashboard/reducer';
import { appCreators } from 'store/app/appReducer';

const Header = props => {
  const [search, setsearch] = useState(false)
  const [megaMenu, setmegaMenu] = useState(false)
  const [socialDrp, setsocialDrp] = useState(false)
  const [failNotifs, setFailNotifs] = useState(false)
 
  const emptyList = [];

  const { userDetails, auditFails, failCount, fromNotifs } = useSelector(
    (state) => ({

      userDetails: state.appReducer.userDetails,
      auditFails: state.Dashboard.auditFails,
      failCount: state.Dashboard.auditFailsCount,
      fromNotifs: state.appReducer.fromNotifs
    })
  );
  let referral = '';
  const appRole = userDetails && userDetails.appRole;
  if (appRole == 'REFERRING_CLINICIAN') {
    referral = true;
  }
  const dispatch = useDispatch();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [position, setPosition] = useState();
  const [open, setOpen] = useState(false);
  const [notifList, setNotifList] = useState(auditFails)


  const toggleTopDrawer = () => {
    setPosition('right');
    setOpen(!open)
  }

  const onDrawerClose = () => {
    setOpen(false);
  }

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function clearNotifs(){
    if(auditFails!=[]){
    auditFails?.forEach((item,index) => {
      dispatch(bchDashboardCreators.updateAudit(item._id))
    }),
    dispatch(bchDashboardCreators.countAuditFails()),
    dispatch(bchDashboardCreators.getAuditFails())
                

  }
  }

  function renderNotifs() {

    if (auditFails != []) {
      let failNotifs = auditFails?.map((item, ind) => (
        <>
          <div key={ind}>
            <DropdownItem >
              <Row>
                <Col md={8} onClick={() => {dispatch(appCreators.setFromNotifs(true)),
              history.push({
                pathname: '/referral-detail',
                state: {
                  caseID: item?.caseData?.caseID
                },
              });
              window.location.reload();
            }}>
                  <span><i className='bx bxs-error h2' style={{ color: "red" }} />  {item?.caseData?.caseID}</span>
                  <br />
                  <div className='text-muted'> {(item.hasOwnProperty('email')) ? (<div> Email Failure </div>) : (item.hasOwnProperty('push') && item?.push?.type == 'twilio') ? (<div> SMS Failure </div>) : null}</div>
                </Col>
                <Col  >
                  <Button color='danger' style={{marginTop:"10px",maxWidth:'30px', maxHeight:'30px'}} onClick={()=>(dispatch(bchDashboardCreators.updateAudit(item._id)),dispatch(bchDashboardCreators.countAuditFails()),  dispatch(bchDashboardCreators.getAuditFails()), dispatch(bchDashboardCreators.countAuditFails()))}><i style={{color: "white",position: "relative",right: "9px",top: "-2px"}} fontSize={12} className='bx bx-x' /></Button>
                </Col>
              </Row>
            </DropdownItem>

          </div>

        </>
      ))
      return (failNotifs)
    }
  }


  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  let history = useHistory();

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">

            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="30" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />

            </button>


            <Dropdown
              className="dropdown-mega d-none d-lg-block ms-2"
              isOpen={megaMenu}
              toggle={() => {
                setmegaMenu(!megaMenu)
              }}
            >
            </Dropdown>
          </div>

          <div className="d-flex">
            {(userDetails.accountType == "REVIEWER") && <><div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  setFailNotifs(!failNotifs)
                }}
                className="btn header-item noti-icon"
              >
                <i className="bx bxs-bell" ><div style={{ fontSize: 13 }}>{<Badge color="danger">{failCount}</Badge>}</div> </i>
                <Dropdown isOpen={failNotifs} toggle={() => setFailNotifs(!failNotifs)}>

                  <DropdownMenu style={{ maxHeight: "400px", overflowY: "scroll", width: "240px" }}>
                    <Button style={{ margin: "0px 15px 0px 15px" }} color='primary' onClick={() => (clearNotifs())}> Clear notifications </Button>
                    {renderNotifs()}:
                  </DropdownMenu>
                </Dropdown>
              </button>
            </div></>}

            {referral && <>
              <OrgDropdown />
              {/* <div className="dropdown d-none d-lg-inline-block ms-1">

              <button
                type="button"
                onClick={() => {
                  history.push('/create-referral')
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-paper-plane" id="createcase" />
               
                <UncontrolledTooltip
                target="createcase"
                                      >
                                        Create case
                </UncontrolledTooltip>
              </button>
            </div> */}

            </>}
            <div className="dropdown d-none d-lg-inline-block ms-1">
              {/*    {referral && (*/}
              {/*  <Button onClick={() => {*/}
              {/*    history.push('/create-referral')*/}
              {/*  }}>*/}
              {/*  Create a referral*/}
              {/*</Button>*/}
              {/*    )}*/}

              <button
                type="button"
                onClick={() => {
                  toggleFullscreen()
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" id="fullscreen" />
                <UncontrolledTooltip
                  target="fullscreen"
                >
                  Fullscreen
                </UncontrolledTooltip>
              </button>
            </div>


            {/* <NotificationDropdown /> NOTIFICATION DROPDOWN */}
            <ProfileMenu />

          </div>
        </div>
      </header>
      <ReactDrawer
        open={open}
        position={position}
        onClose={onDrawerClose}
      >
        <RightSidebar onClose={onDrawerClose} />
      </ReactDrawer>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
