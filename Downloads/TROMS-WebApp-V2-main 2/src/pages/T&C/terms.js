import React, { Component,useEffect,useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Media,
  Row,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import profileupdateValidator from "hooks/profileupdateValidator"
import { appCreators } from "store/app/appReducer";
import { motion } from "framer-motion"
//redux
import { useSelector, useDispatch } from "react-redux"
import { showToast } from "utils/toastnotify";

const Terms = () =>{
  const dispatch = useDispatch()
    let [pageData,setpage]= useState({})
    const [pageload,setpageLoad] =useState(false)

    const { apiVersion,userDetails } = useSelector(
      (state) => ({
        apiVersion: state.Dashboard.apiVersion, 
        userDetails: state.appReducer.userDetails
      })
      );

    const appRole =  userDetails && userDetails.appRole;

        const url = appRole == "REFERRING_CLINICIAN" ?"https://trvapi-test.herokuapp.com/api/config/terms"
        :"https://trvapi-test.herokuapp.com/api/config/termsRev";
        
        // fetch(url)
        // .then(result => {
        
        //   return result.text();
        // })
        // .then(page => {
        
        //   setpage(page)
        //   setpageLoad(true)
        
        // })
        // .catch(err =>{
        //   showToast('Failed to fetch terms and conditions','error')
        // });
        const profileupdatevalidator = profileupdateValidator()

        useEffect(()=>{
          fetch(url)
          .then(result => {
          
            return result.text();
          })
          .then(page => {
          
            setpage(page)
            setpageLoad(true)
          
          })
          .catch(err =>{
            showToast('Failed to fetch terms and conditions','error')
          });

          if(profileupdatevalidator){
            dispatch(appCreators.setIncompleteProfileModalOpen())
          }

          if(userDetails?.consultantCode == null ||userDetails?.firstName == null || userDetails?.lastName == null
            ||userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
            || userDetails?.speciality == null || userDetails?.speciality == false  ){
            dispatch(appCreators.setIncompleteProfileModalOpen())
            }
        },[])
  

    return (
      <React.Fragment>
 <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
          <MetaTags>
            <title>Terms | TriVice - Triage, Referral & Advice</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Dashboard" breadcrumbItem="Terms & Conditions" />
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle className="h4">TriVice Terms</CardTitle>
                    <div style={{height:'100%'}}>
                        {pageload? (
                            <div >
                            <div 
                                dangerouslySetInnerHTML={{ __html: pageData && pageData }} />
                           </div>
                        ) : <p>Loading...</p>}
                        </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          </motion.div>
      </React.Fragment>
    )
}

export default Terms
