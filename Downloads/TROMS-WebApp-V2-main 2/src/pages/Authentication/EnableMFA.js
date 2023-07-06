import React, { useEffect, useState } from "react"
import { Label, Form ,Input ,Modal,FormFeedback, NavItem, TabContent, TabPane, Row, Col, NavLink,} from "reactstrap"
import AuthCode from "react-auth-code-input";
  
//redux
import { useSelector, useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom";

import Loadbtn from "components/Common/Loadbtn"
import { mfaCreators } from "store/auth/mfa/reducer";
import classNames from "classnames";
import googleAuth from './Google-Authenticator.png'
import { setClient } from "utils/apiUtils";


const EnableMFA = props =>{

    let history = useHistory();
    const dispatch = useDispatch()
    const [, forceUpdate] = useState()
    const [twoFA, setTwoFA] = useState('')
    const [activeTab, setActiveTab] = useState(1)

    const { token,qrcode,loading} = useSelector(state => ({
        token:state.appReducer.token,
        qrcode: state.mfaReducer.qrcode,
        loading: state.mfaReducer.loading
      }))
    const mfaSubmit = (e) =>{
        e.preventDefault()
        if(twoFA.length == 6){
            dispatch(mfaCreators.verifyTOTP(twoFA,history))
            
        }
    }
    useEffect(()=>{
        setClient(token)
        dispatch(mfaCreators.requestQRCodeWAuth())
    },[])
console.log("token",token)
    return(
        <Row>
            <Col lg="12">
                <div className="wizard clearfix">
                    <div className="steps clearfix">
                        <ul>
                            <NavItem className={classNames({
                                current: activeTab == 1
                            })}>
                                <NavLink onClick={()=>setActiveTab(1)} className={classNames({
                                    active: activeTab == 1
                                })}>
                                     <span className="number">1.</span>{" "}
                                    Download authenticator
                                </NavLink>
                            </NavItem>
                            <NavItem className={classNames({
                                current: activeTab == 2
                            })}>
                                <NavLink onClick={()=>setActiveTab(2)} className={classNames({
                                    active: activeTab == 2
                                })}>
                                     <span className="number">2.</span>{" "}
                                    Scan QR
                                </NavLink>
                            </NavItem>
                            <NavItem className={classNames({
                                current: activeTab == 3
                            })}>
                                <NavLink onClick={()=>setActiveTab(3)} className={classNames({
                                    active: activeTab == 3
                                })}>
                                     <span className="number">3.</span>{" "}
                                    Verify
                                </NavLink>
                            </NavItem>
                        </ul>
                    </div>
                    <div className="content clearfix">
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId={1}>
                               <Row>
                                    <Col lg="6">
                                        <img src={googleAuth} height={'auto'} width="100%"/>
                                    </Col>
                                    <Col lg="6">
                                        <p style={{fontSize:'16px'}}>
                                            Two factor authentication adds an extra layer of security to your account. You sign in with something you know (your password) and something you have (a code on you phone). This means that even if your password is compromised your account will remain safe. 
                                        </p>
                                        <h3>
                                            What you need to do
                                        </h3>
                                        <ol className="h4">
                                            <li>
                                                Go to your phones App store
                                            </li>
                                            <li>
                                                Install the Google Authenticator app
                                            </li>
                                            <li>
                                                Go to the next page
                                            </li>
                                        </ol>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId={2}>
                                {qrcode != null && (
                                <>
                                <div style={{display:'flex', justifyContent:'center' }}>
                                <h2>
                                    Scan the QR code using Google Authenticator
                                </h2>
                                </div>
                                <div style={{display:'flex', justifyContent:'center' }}>
                                                                <img src={qrcode} />
                                </div>
                                </>
                                )}
                            </TabPane>
                            <TabPane tabId={3}>
                                {qrcode != null && (
                                    <div style={{textAlign: 'center'}}>
                                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center', flexDirection:'column'}}>
                                <AuthCode
                                            characters={6}
                                            onChange={(code) => setTwoFA(code)}
                                            className="form-control form-control-lg text-center"
                                            allowedCharacters="^[0-9]"
                                            inputStyle={{
                                            width: "35px",
                                            height: "calc(1.5em + 1rem + 2px)",
                                            padding: ".25rem .5rem",
                                            borderRadius: "8px",
                                            fontSize: "1.01562rem",
                                            textAlign: "center",
                                            marginRight: "8px",
                                            border: "1px solid #ced4da",
                                            textTransform: "uppercase",
                                            borderRadius: ".4rem"
                                            }}
                                            />
                                            <Label style={{textAlign:'center'}}>Please input the code from your authenticator app.</Label>
                                            </div>
                                            </div>
                                )}
                            </TabPane>
                        </TabContent>
                    </div>
                    <div className="actions clearfix">
                        <ul>
                        <li
                            className={
                              activeTab === 1
                                ? "previous disabled"
                                : "previous"
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                if(activeTab != 1){
                                    setActiveTab(activeTab - 1)
                                }
                              }}
                            >
                              Previous
                          </Link>
                          </li>
                          <li
                            className={
                              'next'
                            }
                          >
                            <Link
                              to="#"
                              onClick={(e) => {
                                if(activeTab != 3){
                                    setActiveTab(activeTab + 1)
                                } else {
                                    mfaSubmit(e)
                                }
                              }}
                            >
                              {activeTab == 3 ? 'Finish' : 'Next'}
                          </Link>
                          </li>
                        </ul>
                    </div>
                </div>
            </Col>
        </Row>

    )
}


export default EnableMFA;