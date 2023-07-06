import React from "react"
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { Container, Row, Col, Card } from "reactstrap"

//Import Cards
import CardMaintenance from "./cardMaintanence";

//Import Images
import maintenance from "../../assets/images/maintenance.svg"
import logo from "../../assets/images/logo-dark.png"
import sidebarlogo from "assets/images/sidebarlogo.svg" 

import  Trivicelogo  from 'assets/images/triViceHeaderlogo.svg';


const PagesMaintenance = () => {
  return (
    <React.Fragment>
      <section className="my-5 pt-sm-1">
        <MetaTags>
          <title>Maintenance | Skote - React Admin & Dashboard Template</title>
        </MetaTags>
        <Container>
          <Row>
            <Col xs="12" className="text-center">
              <div className="home-wrapper">

                <Row className="justify-content-center">
                  <Col sm={4}>
                    <div className="maintenance-img">
                      <img
                        src={maintenance}
                        alt=""
                        height="300"
                      />
                    </div>
                  </Col>
                </Row>
                <h3 className="mt-0">Sorry, we don’t support your browser at this moment.</h3>
                <p>To use the TriVice web application, please use the latest version of Google Chrome, Safari, Microsoft Edge and FireFox. For better experience please switch or upgrade your browser</p>

                <Row>
                  <Col xl={12} >
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>

                <Card style={{display:'inline-block',border:'1px solid #556EE6',padding:'25px',justifyContent:'center',width:"200px"}}>
                    <i className="bx bxl-chrome h1 text-primary"  />
                    <p>Google Chrome</p>
                    </Card>               
                    <Card style={{display:'inline-block',border:'1px solid #556EE6',padding:'25px',justifyContent:'center',width:"200px"}}>
                  <i className="bx bxl-edge  h1 text-primary" />
                    <p>Microsoft Edge</p>
                    </Card>
                  

                    <Card style={{display:'inline-block',border:'1px solid #556EE6',padding:'25px',justifyContent:'center',width:"200px"}}>
                    <i className="bx bxl-firefox  h1 text-primary"  />
                    <p>Mozilla Firefox</p>
                    
                    </Card>
                    <Card style={{display:'inline-block',border:'1px solid #556EE6',padding:'25px',justifyContent:'center',width:"200px",}}>
                    <i className="bx bxl-apple h1 text-primary"  />
                    <p>Safari</p>
                    </Card>
                    
                    </div>
                    
                   
                  </Col>
                   
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default PagesMaintenance
