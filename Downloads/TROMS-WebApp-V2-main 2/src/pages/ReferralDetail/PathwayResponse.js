import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CardTitle,
    Form,
    FormGroup,
    Label,
    Col,
    Collapse,
    Table
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import CdBasicInfo from './CdBasicInfo';
import GenerateCaseDetails from 'components/GeneratecaseDetails';
import ViewIcon from "assets/icon/viewIcon.svg"
import moment from 'moment'


const PathwayResponse = ({openCaseCanvas,setOffCanvasCustomActiveTab}) => {
    const dispatch = useDispatch()

    
    const {caseDetail,updateloading,organisation,userDetails} =useSelector( state=>({
        caseDetail: state.caseDetails.caseDetails,
        updateloading:state.caseDetails.updateloading,
        userDetails:state.appReducer.userDetails,
        organisation:state.appReducer.userDetails.organisation
      }))

      let injuriesArr = []; //pathway response array
      let injurylength = caseDetail && caseDetail.case && 
                        caseDetail.case.summary && caseDetail.case.summary.length;
      let i = 0;
      for (i = 0; i < injurylength; i++) {
    
    
        if(caseDetail?.case?.summary[i]?.type?.toLowerCase() != "visual"){
    
          injuriesArr.push(caseDetail && caseDetail.case && caseDetail.case.summary[i]);
        }
        //injuriesArr.push(caseDetail && caseDetail.case && caseDetail.case.summary[i]);
      }

    return (
        <div>
            <Table className="table table-striped mb-0" responsive>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {injuriesArr.map((item, index)=>{
                        let type;
                        let id;
                        try {
                            type = item.currentQuestion.answers.type.toLowerCase()
                            id = item.currentQuestion.id
                        } catch (error) {
                            try{
                                type = item.type.toLowerCase()
                                id = item.questionID
                            } catch (error) {
                                return(
                                    <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td>{typeof item.answer == 'string' ? item.answer : ""}</td>
                                    </tr>
                                )
                            }
                        }
                        if((type) == "visual") {
                            return(
                                <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td></td>
                                </tr>
                            )
                        }
                        if((type) == "images"){
                            console.log("summ img",item.answer)
                            return(
                                <tr key={id}>
                                    <td scope="row">Uploaded Images</td>
                                    <td>
                                        {item.answer?.images?.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    
                                </tr>
                            )
                        }
                        if(type == "opthoimages") {
                            return(
                                <>
                                <tr key={id} >
                                    <td scope="row">Uploaded Images Left Eye</td>
                                    <td>
                                        {item.answer?.images?.leftEye.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    
                                </tr>
                                <tr key={id}>
                                    <td scope="row">Uploaded Images Right Eye</td>
                                    <td>
                                        {item.answer?.images?.rightEye.map(f=>{
                                            return (<img
                                            key={f.name}
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                        />);
                                        })}
                                    </td>
                                    
                                </tr>
                                </>
                            )
                        }
                        if((type)== "checkbox"){
                            if (Array.isArray(item.answer)){
                                return(
                                    <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td>{item?.answer?.map(i=>{
                                        if (i == item.answer[item.answer.length -1]) return `${i}`
                                        return `${i}, `
                                    })}</td>
                                    
                                </tr>
                                )
                            } else if(typeof item.answer == "string"){
                                return(
                                    <tr key={id}>
                                        <td scope="row">{item.question}</td>
                                        <td style={{wordWrap:'break-word'}}>{item.answer}</td>
                                        
                                    </tr>
                                )
                            }
                        }
                        if(type == "datetime"){
                            return(
                                <tr key={id}>
                                    <td scope="row">{item.question}</td>
                                    <td style={{wordWrap:'break-word'}}>{(item.answer)}</td>
                                    
                                </tr>
                            )
                        }            
                        if(type == "rheuclini" ||type =="rheutreat"||type == "rheuinves" ||type == "rheuinves2" ||type == "rheuinves3"||type == "rheuvital" ){
                            return(
                                <tr key={id}>
                                <td scope="row">{item.question}</td>
                                <td>
                                    <div onClick={()=>{
                                        if(type=="rheuclini"){
                                            setOffCanvasCustomActiveTab("1")
                                        }
                                        else if(type=="rheuinves"){
                                            setOffCanvasCustomActiveTab("2")
                                        }
                                        else if(type=="rheuinves3"){
                                            setOffCanvasCustomActiveTab("4")
                                        }
                                        else if(type=="rheuinves2"){
                                            setOffCanvasCustomActiveTab("3")
                                        }
                                        else if(type=="rheutreat"){
                                            setOffCanvasCustomActiveTab("5")
                                        }
                                        else if(type=="rheuvital"){
                                            setOffCanvasCustomActiveTab("6")
                                        }
                                        openCaseCanvas();
                                    }} 
                                    style={{display: "flex",cursor:'pointer', flexDirection:"row",alignItems:"center",gap:"5px"}} >
                                    <img src={ViewIcon} height="22px" width="22px"/> View</div></td>
                            </tr>
                            )

                        }
                        return(
                            <tr key={id}>
                                <td scope="row">{item.question}</td>
                                <td>{item.answer}</td>
                                
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {/* <Collapse isOpen={true} navbar={false} className="accordion-collapse" >
                <div className="accordion-body">
                    <GenerateCaseDetails information={injuriesArr}/>
                </div>
            </Collapse> */}
        </div>
    );
};

PathwayResponse.propTypes = {
    Case: PropTypes.object.isRequired,
    openCaseCanvas:PropTypes.any,
    setOffCanvasCustomActiveTab:PropTypes.any,
}

export default PathwayResponse;
