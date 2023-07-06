import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment-timezone';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
  Collapse
} from "reactstrap";
import classnames from "classnames";
import { isEmpty, map } from "lodash";
import { useParams, useRouteMatch, Redirect, useLocation } from "react-router-dom";

import img1 from 'assets/images/product/img-1.png'
import noImage from 'assets/images/NO-IMAGE-AVALAIBLE.png'


//redux
import { useSelector, useDispatch } from "react-redux"

import caseDetails, {caseTypes,caseCreators } from "store/caseDeatils/reducer"

const CdImages = (props)=>{

let imgUrl = props.imgUrl;
const [currentIMG,setcurrentIMG] = useState('');

const [activeTab, setActiveTab] = useState("1")


const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

const imageShow = (img) => {
    setcurrentIMG(img)
  }

let Defaultimg = noImage ;

if(imgUrl){
   imgUrl && imgUrl.map((item,key) =>{
   if(key == 0){
     Defaultimg = item
   }
   });
   }

    return(
        <div className="product-detai-imgs">
        <Row>
          <Col md="2" xs="3">
            <Nav className="flex-column" pills>
            
              {
                    imgUrl && imgUrl.map((item,key)=>
                   <>
              
                      
                      <NavItem>
                      <NavLink 
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => {
                          toggleTab("1")
                        }}
                      >
                        <img
                          src={item}
                          alt=""
                          onClick={() => {
                            imageShow(item)
                          }}
                          className="img-fluid mx-auto d-block rounded"
                        />
                      </NavLink>
                    </NavItem>
                </>
                    )
                
              }

            </Nav>
          </Col>
          <Col md={{ size: 7, offset: 1 }} xs="9">
            <TabContent activeTab={activeTab} >
              <TabPane tabId="1">
                <div>
                  <img
                    src={currentIMG ? currentIMG :Defaultimg}
                    alt={currentIMG ? "img" :"No image found"}
                    id="expandedImg1"
                    className="img-fluid mx-auto d-block"
                  />
                </div>
              </TabPane>
              <TabPane tabId="2" >
                <div>
                  <img
                    src={img1}
                    id="expandedImg2"
                    alt=""
                    className="img-fluid mx-auto d-block"
                  />
                </div>
              </TabPane>
              <TabPane tabId="3" >
                <div>
                  <img
                    src={img1}
                    id="expandedImg3"
                    alt=""
                    className="img-fluid mx-auto d-block"
                  />
                </div>
              </TabPane>
              <TabPane tabId="4">
                <div>
                  <img
                    src={img1}
                    id="expandedImg4"
                    alt=""
                    className="img-fluid mx-auto d-block"
                  />
                </div>
              </TabPane>
            </TabContent>
          
          </Col>
        </Row>
      </div>
    )
}

CdImages.propTypes = {
    imgUrl: PropTypes.any,
  }
  

export default CdImages;