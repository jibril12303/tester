import React,{ useEffect, useState} from 'react'
import ClinicalFeature from "./clinicalFeature";
import InvestigationToDate from './investigationToDate';
import TreatmentToDate from "./treatmentToDate";
import { useSelector, useDispatch } from 'react-redux';
import { createReferralTypes, createReferralCreators } from "store/create-referral/reducer";

const RenderReauScreens = () => {

    const dispatch = useDispatch();
    //for changing reumatology screens
    const {reauScreensIndex,reauScreens} = useSelector((state)=>({
        reauScreensIndex:state.CreateReferral.reauScreensIndex,
        reauScreens:state.CreateReferral.reauScreens
    }))

    const renderClinicalField  = (field)=>{
      const data = field.find((item=>item.screenType == "rheuClini"))
      return data;
    }
    const renderInvestigateField  = (field)=>{
      const data = field.find((item=>item.screenType == "rheuInves"))
      return data;
    }
    const renderTreatMentField  = (field)=>{
      const data = field.find((item=>item.screenType == "rheuTreat"))
      return data;
    }


  return (
      <>
    {reauScreensIndex == "1" && <ClinicalFeature fields={reauScreens && renderClinicalField(reauScreens)} /> }
    {reauScreensIndex == "2" && <InvestigationToDate fields={reauScreens && renderInvestigateField(reauScreens)} /> }
    {reauScreensIndex == "3" && <TreatmentToDate fields={reauScreens && renderTreatMentField(reauScreens)} /> }
    </>
  )
}

export default RenderReauScreens;