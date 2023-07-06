import React, { useEffect, useState ,useRef  } from "react";
import MetaTags from "react-meta-tags";
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
import GenerateCaseDetails from "components/GeneratecaseDetails";
import { useHistory } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

import img1 from 'assets/images/product/img-1.png'

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import Query from "pages/Querypage/QueryPage"
//redux
import { useSelector, useDispatch } from "react-redux"

import caseDetails, {caseTypes,caseCreators } from "store/caseDeatils/reducer"


const Accordians = (props) => {

    let history =useHistory()
    const firstAcc = React.useRef(null);
    const secondAcc = React.useRef(null);
    const thirdAcc = React.useRef(null);
    const fourthAcc = React.useRef(null);
    const fifthAcc = React.useRef(null);

    const dispatch = useDispatch()

    const location = useLocation();

  const {caseDetail,updateloading,organisation,userDetails} =useSelector( state=>({
    caseDetail: state.caseDetails.caseDetails,
    updateloading:state.caseDetails.updateloading,
    userDetails:state.appReducer.userDetails,
    organisation:state.appReducer.userDetails.organisation
  }))
  
let immediateorg = null;
let arrval = [''];

organisation && organisation.map((item)=>{
      arrval = [...arrval,item._id]
    })

  
  // state for action form button
  const [radio, setRadio] = useState(-1);
  
  //state for accordian
  const [col1, setcol1] = useState(false)
  const [col2, setcol2] = useState(false)
  const [col3, setcol3] = useState(false)
  const [col4, setcol4] = useState(false)
  const [col5, setcol5] = useState(false)


  const t_col1 = () => {
    setcol1(!col1)
    setcol2(false)
    setcol3(false)
    setcol4(false)
    setcol5(false)
  }

  const t_col2 = () => {
    setcol2(!col2)
    setcol1(false)
    setcol3(false)
    setcol4(false)
    setcol5(false)
  }

  const t_col3 = () => {
    setcol3(!col3)
    setcol1(false)
    setcol2(false)
    setcol4(false)
    setcol5(false)
  }
  const t_col4 = () => {
    setcol4(!col4)
    setcol1(false)
    setcol2(false)
    setcol3(false)
    setcol5(false)
  }
  const t_col5 = () => {
    setcol5(!col5)
    setcol1(false)
    setcol2(false)
    setcol3(false)
    setcol4(false)
  }

  const fName = caseDetail && caseDetail.case &&caseDetail.case.parent &&caseDetail.case.parent.firstName;
  const lNmae = caseDetail && caseDetail.case &&caseDetail.case.parent &&caseDetail.case.parent.lastName;
  const parentEmail = caseDetail && caseDetail.case &&caseDetail.case.parent &&caseDetail.case.parent.emailAddress
  const parentContactNumber = caseDetail && caseDetail.case &&caseDetail.case.parent &&caseDetail.case.parent.contactNumber
  const Case = caseDetail && caseDetail.case;
  const caseID = Case && Case.caseID.toString();
  const leaflets =Case && Case.sentLeaflets
  
  const leafpatientarray = [];
  const leafclinicianarray = [];
  leaflets && leaflets.map((item,key)=>{
    if(item.typeOfdocument === "Patient"){
      leafpatientarray.push({
        name:item.name,
        link:item.s3Url
      })
    }
    else if(item.typeOfdocument === "Clinician"){
      leafclinicianarray.push({
        name:item.name,
        link:item.s3Url
      })
    }
  })

  //console.log("type",typeof(caseID)+" "+" caseID="+caseID+"str1.startsWith('1222')="+caseID.startsWith('160'))
  const optho = caseID && caseID.startsWith('130');
  console.log(caseDetail)
  let createdName =Case && Case.createdBy && Case.createdBy.firstName
  let createdLname  = Case && Case.createdBy && Case.createdBy.lastName
  let createdHospital = caseDetail && caseDetail.practise && caseDetail.practise.name
  let referringName = createdName + " " + createdLname //referring clinician not consultant
  let consultantName = Case && Case.consultantName
  let createdPnum = Case && Case.createdBy && Case.createdBy.phoneNumber
  let hospitalNumber = Case && Case.hospitalNumber
  let discription = Case && Case.originalSuggestedActionDescription
  let pathwayOutcome = Case && Case.pathwayOutcome



  let injuriesArr = []; //pathway response array
  let injurylength = caseDetail && caseDetail.case && 
                    caseDetail.case.summary && caseDetail.case.summary.length;
  let i = 0;
  for (i = 0; i < injurylength; i++) {


    if(caseDetail?.case?.summary[i]?.type?.toLowerCase() != "visual" && caseDetail?.case?.summary[i]?.type?.toLowerCase() != "images"  ){

      injuriesArr.push(caseDetail && caseDetail.case && caseDetail.case.summary[i]);
    }
    //injuriesArr.push(caseDetail && caseDetail.case && caseDetail.case.summary[i]);
  }

  function Capitalized(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  }

   
console.log(leafclinicianarray.length,"leafclinicianarray")

  let LeafletArr =[
    { header: "Clinician Leaflet",
      Leaflet:leafclinicianarray.length ==0?"Not Available":leafclinicianarray,
    },
    {
      header: "Patient Leaflet",
      Leaflet:leafpatientarray.length ==0?"Not Available":leafpatientarray,
    },
  ]

  let contactArr =[
    {
      header: "Parent/Carer Details",
      contactName: `Name : ${fName ? fName : "Not available"}  ${lNmae ? lNmae : "Not available"  } `,
      contactEmail: `Email : ${parentEmail ? parentEmail: "Not available"}`,
      contactNumber: `Phone : ${parentContactNumber ? parentContactNumber : "Not available"}`,
    },
    {
      header: "GDPR",
    },
    {
      question: "Assessment, Treatment and Referral",
      answer: `${Case && Case.consent && Case.consent.treatment === true ? "Yes" : "No"}`,
    },
    {
      question: "Medical Teaching and Research",
      answer: `${Case && Case.consent && Case.consent.research === true ? "Yes" : "No"}`,
    },
    
  ]

  const createdfullname = createdName ? createdName : ""  + " " + createdLname ? createdLname : "" ;

    //referrar array
  let referralArr =[
    {
      header: "Referring Clinician",
      contactName: `Name : ${referringName ? referringName : "Not available"}`,
      contactNumber: `Phone : ${createdPnum ? createdPnum : "Not available" }`,
    },
    {
      header: "Referring Organisation",
      HospitalName: `${createdHospital ? createdHospital : "Not available"}`,
    },
    
  ]


let originalSuggestedAction =  Case && Case.originalSuggestedAction;
let contacted =  Case && Case.contacted;
let lifeThreatening =Case && Case.lifeThreatening
let contactedval  = null;
let lifeThreateningval = null;
let OriginalPriority = Case?.originalTriageID?.priority;
let ChangedAction = Case?.specialitySelected == "Plastic Surgery" ? Case?.triageID?.action?.plastic :  Case?.triageID?.action?.ophthalmology
let ChangedPriority = Case?.triageID?.priority;


if(contacted){
  contactedval  = contacted==true?"Yes":"No"
}else if(contacted == false){
  contactedval="No"
}
if(lifeThreatening){
  lifeThreateningval = lifeThreatening==true?"Yes":"No"
}
else if(lifeThreatening == false){
  lifeThreateningval = "No"
}
let suggestedAction = Case && Case.suggestedAction;
let internalNotes = Case && Case.internalNotes;
let notes = Case && Case.notes;



//console.log("lifeThreatening",lifeThreatening)

     

//console.log("userDetails.speciality",userDetails && userDetails?.speciality)
//console.log("pathwayOutcome",pathwayOutcome)
//console.log("org",arrval.includes('60c0b7fb5bb26a3fdcf355b6'))
// action box array
  let actionarr = [];

if(Case?.originalTriageID?.code == "IMMEDIATE"){
  if(contacted){
    console.log("IMMEDIATE coming")

    actionarr.push({
      header: "Contact Established?",
      answer: contactedval ? contactedval : "Not known",
    },);
 }

if(contacted == false && Case?.specialitySelected == "Plastic Surgery" ){ //does not need to be shown for ophthamology
    
    actionarr.push({
      header: "Contact Established?",
      answer: contactedval ? contactedval : "Not known",
    },);

    actionarr.push({
      header: "Limb or life threatening injury",
      answer: lifeThreateningval ? lifeThreateningval : "Not known",
    })
  }

}



  
  actionarr.push({
    header: "Original suggested priority and action",
    priority: `Priority : ${OriginalPriority ? OriginalPriority : "Not available"}`,
    discripthead: `Original suggested action : ${originalSuggestedAction ? originalSuggestedAction : "Not available"}`,
    description:discription,
  });
  
  if (Case && Case.referralAccepted) {
 
  
		
		if (Case && !Case.agreeSuggestedAction) {
			actionarr.push({
					header: "Changed priority and action",
          priority: `Priority : ${ChangedPriority ? ChangedPriority : "Not available"}`,
          discripthead:`Changed suggested action : ${ChangedAction ? ChangedAction : "Not available"}` ,
			
				});
		}
				
	{/*	actionarr.push({
      header: "Notes and suggested actions for the referrer",
      answer: notes ? notes : "Not available",
    });
  */}  
    if(props.appRole != 'REFERRING_CLINICIAN') {
		  actionarr.push({
					header: "Internal notes/agreed actions (not visible to referrer) ",
					answer: internalNotes ? internalNotes : "Not available" ,
				});

		}
    if(notes != undefined){
      actionarr.push({
        header: props.appRole != 'REFERRING_CLINICIAN' ? "Note to the referrer" : "Note from the reviewer",
        answer: notes ? notes : "Not available"
      })
    } else {
      actionarr.push({
        header: props.appRole != 'REFERRING_CLINICIAN' ? "Note to the referrer" : "Note from the reviewer",
        answer: suggestedAction ? suggestedAction : "Not available"
      })
    }
    actionarr.push({
			header: "Name of the on-call BWC consultant",
			answer: consultantName ? consultantName : "Not available"
				});
    if (props.appRole == "BCH_CLINICIAN" && typeof Case?.onCallDoctor != 'undefined'){
      actionarr.push({
        header: "On call Registrar",
        answer: typeof Case?.onCallDoctor != 'undefined' ? `${Case.onCallDoctor.firstName} ${Case.onCallDoctor.lastName}` : "Not available"
      })
    }
    if (props.appRole == "BCH_CLINICIAN" && typeof Case?.acceptedBy != 'undefined'){
      actionarr.push({
        header: "Accepted by",
        answer: typeof Case?.acceptedBy != 'undefined' ? `${Case.acceptedBy.firstName} ${Case.acceptedBy.lastName}` : "Not available"
      })
    }
      
	}
	else{
          if(props.appRole=="BCH_CLINICIAN"){
            actionarr.push(
               
                {
                  header: "Do you agree with this suggested action",
                },
                {
                  buttons: 'Yes',
                },
              );
       }
	}

 // console.log("actionarr =",actionarr)

  var Dropitems = caseDetail && caseDetail.allTriage;

  const buttonChange = (value) => {
		switch (value) {
			case "Yes":
				setRadio(1);
				break;
			case "No":
				setRadio(0);
				break;
			default:
				setRadio(-1);
				break;
		}
	};

    function GenerateActionDetails(radio, myCase, Dropitems) {
        let returnedValue = [];
        var agreeSuggestedAction = undefined;
        if (radio === 1) {
          agreeSuggestedAction = true;
        } else if (radio === 0) {
          agreeSuggestedAction = false;
        } else {
          agreeSuggestedAction = undefined;
        }
       
    
      
      
        var boxcaseID = myCase && myCase.caseID;
        var consultantName = undefined;
        var internalNotes = undefined;
        var notes = undefined;
        var agreeSuggestedAction = undefined;
        var lastEdited = myCase && myCase.lastEdited;
        var referralAccepted = true;
        var suggestedAction = '';
      
      
        {/*when choosing yes onsubmit will work*/ }
      
        const onSubmit = (event,values) => {
       //   console.log("in submit fucntion",JSON.stringify(values));
          
          const payload = {
            caseID: boxcaseID,
            consultantName: values.consultantName,
            internalNotes: values.internalNotes,
            notes: values.notes,
            agreeSuggestedAction: true,
           referralAccepted: referralAccepted,
           lastEdited: lastEdited,
           
        }
        dispatch(caseCreators.updateCaseDetails(payload,history))
      
        }
      
        {/*when choosing No onNosubmit will work */ }
      
        const onnoSubmit = (event,values) => {
        //  console.log("2nd form button" + JSON.stringify(values));
      
       //   consultantName = values.consultantName;
        //  internalNotes = values.internalNotes;
       //   notes = values.notes;
       //   suggestedAction = values.suggestedAction
      
          const payload = {
         caseID: boxcaseID,
            consultantName: values.consultantName,
            internalNotes: values.internalNotes,
            suggestedAction: values.notes,
            agreeSuggestedAction: false,
            referralAccepted: referralAccepted,
            lastEdited: lastEdited,
            pathwayOutcome: values.suggestedAction,
      
      
         }
         dispatch(caseCreators.updateCaseDetails(payload,history))
         
      
        }
      
      
        if (radio) {
          returnedValue.push(
            <>
            <AvForm className="form-horizontal"
                             onValidSubmit={(e, v) => {
                              onSubmit(e, v)
                            }}>
                              <div className="mb-3">
                                <label>Notes for the referrer <span className="text-danger">*</span></label>
                                <AvField
                                  name="notes"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>
                          
                              <div className="mb-3">
                              <label>Internal notes / agreed actions <span className="text-danger">*</span></label>
                                <AvField
                                  name="internalNotes"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>
                              
                              <div className="mb-3">
                              <label>Name of the on-call BWC consultant <span className="text-danger">*</span></label>
                                <AvField
                                  name="consultantName"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>
               
    
                              <div className="mt-3 d-grid">
                                <button
                                  className="btn btn-primary btn-block "
                                  type="submit"
                                >
                                  Submit
                                </button>
                              </div>
    
                            </AvForm>
            </>
              
          );
        } else {
          returnedValue.push(
            <>
              <AvForm className="form-horizontal"
                             onValidSubmit={(e, v) => {
                              onnoSubmit(e, v)
                            }}>
                        <div className="mb-3">
                  <label>Change Priority <span className="text-danger">*</span></label>
                             <AvField
                                  name="suggestedAction"
                                  label=""
                                  className="form-control"  
                                  type="select"
                                 // defaultValue="Birmingham Childrens's Hospital"
                                  
                                 // onChange = {selecthospital}
                                 required

                                >
                                  <option value='' selected disabled>Select...</option>
                                  
                                  {
                                    Dropitems && Dropitems.map((item,key)=>{
                                    //  console.log("item",item)
                                      return(
                                        <option style={{textTransform:'capitalize'}} key={key} value={item && item.code}>{item && Capitalized(item.priority)}</option> 
                                        
                                      )
                                    })
                                  }
                                  </AvField>
                              </div>
                              <div className="mb-3">
                              <label>Suggested action/notes for referrer <span className="text-danger">*</span></label>
                                <AvField
                                  name="notes"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>
                              <div className="mb-3">
                              <label>Internal notes/agreed actions <span className="text-danger">*</span></label>
                                <AvField
                                  name="internalNotes"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>
        
                              <div className="mb-3">
                              <label>Name of the on-call BWC consultant <span className="text-danger">*</span></label>
                                <AvField
                                  name="consultantName"
                                  className="form-control"
                                  type="text"
                                  required
                                />
                              </div>   
                 
                              <div className="mt-3 d-grid">
                                <button
                                  className="btn btn-primary btn-block "
                                  type="submit"
                                >
                                  Submit
                                </button>
                              </div>
    
                            </AvForm>
            </>
          );
        }
      
        return returnedValue;
      }
      
      const scrollToRef = (ref) => {
       // console.log("ref",ref)
        ref?.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: "center",
      });
    }


  
    
 return(
    <div className="accordion" id="accordion">
    
        {/*1st accordian*/}
    <div className="accordion-item" >
      <h2 className="accordion-header" id="headingOne" >
        <button ref={firstAcc}
          className={classnames(
            "accordion-button",
            "fw-medium",
            { collapsed: !col1 }
          )}
          type="button"
          onClick={()=>{t_col1();
            window.setTimeout(() => scrollToRef(firstAcc), 500)}}
          style={{ cursor: "pointer" }}
        >
          Pathway Response
        </button>
      </h2>

      <Collapse isOpen={col1} className="accordion-collapse" >
        <div className="accordion-body">
        <GenerateCaseDetails information={injuriesArr}/>
        </div>
      </Collapse>
    </div>
    

    

 
    <div className="accordion-item"  ref={secondAcc} >
      <h2 className="accordion-header" id="headingTwo">
        <button
          className={classnames(
            "accordion-button",
            "fw-medium",
            { collapsed: !col2 }
          )}
          type="button"
          onClick={()=>{t_col2();
            window.setTimeout(() => scrollToRef(secondAcc), 500)}}
          style={{ cursor: "pointer" }}
        >
          Contacts and GDPR
        </button>
      </h2>

      <Collapse isOpen={col2} className="accordion-collapse">
        <div className="accordion-body">
        <GenerateCaseDetails information={contactArr}  />
        </div>
      </Collapse>
    </div>
   
        
        {/*3rd accordian*/}
    <div className="accordion-item" >
      <h2 className="accordion-header" id="headingThree" ref={thirdAcc} >
        <button
          className={classnames(
            "accordion-button",
            "fw-medium",
            { collapsed: !col3 }
          )}
          type="button"
          onClick={()=>{t_col3();
            window.setTimeout(() => scrollToRef(thirdAcc), 500)}}
          style={{ cursor: "pointer" }}
        >
          Referrer
        </button>
      </h2>
      <Collapse isOpen={col3} className="accordion-collapse">
        <div className="accordion-body">
        <GenerateCaseDetails information={referralArr}/>
        </div>
      </Collapse>
    </div>

        {/*4th accordian*/}
    <div className="accordion-item" ref={fourthAcc} >
      <h2 className="accordion-header" id="headingThree" >
        <button
          className={classnames(
            "accordion-button",
            "fw-medium",
            { collapsed: !col4 }
          )}
          type="button"
          onClick={()=>{
            t_col4();
            window.setTimeout(() => scrollToRef(fourthAcc), 500)}}
          style={{ cursor: "pointer" }}
        >
          Action
        </button>
      </h2>
      <Collapse isOpen={col4} className="accordion-collapse" >
        <div className="accordion-body">
        <GenerateCaseDetails information={actionarr}
        radioState={radio}
        buttonChange={val=>buttonChange(val)}
        extraComponents={GenerateActionDetails(
          radio,
        
          Case,
          Dropitems
        )}/>
        </div>
      </Collapse>
    </div>

            {/*5th accordian*/}
            <div className="accordion-item" ref={fifthAcc}  >
      <h2 className="accordion-header" id="headingThree" >
        <button
        ref={fifthAcc}
          className={classnames(
            "accordion-button",
            "fw-medium",
            { collapsed: !col5 }
          )}
          type="button"
          onClick={()=>{t_col5();
            window.setTimeout(() => scrollToRef(fifthAcc), 500)}}
          style={{ cursor: "pointer" }}
        >
          Leaflets
        </button>
      </h2>
      <Collapse isOpen={col5} className="accordion-collapse" >
        <div className="accordion-body">
        <GenerateCaseDetails information={LeafletArr}/>
        </div>
      </Collapse>
    </div>

  </div>
 )
}

Accordians.propTypes = {
    appRole: PropTypes.any,
    
  }
  

export default Accordians;
