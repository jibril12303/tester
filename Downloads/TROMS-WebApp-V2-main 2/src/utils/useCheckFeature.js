import React from 'react';
import {Features} from "./features"
import { useSelector } from 'react-redux'

export default function useCheckFeatures(){

    const user = useSelector(state=>state.appReducer.userDetails);
    
    const checkFeature = (featureName)=>{
       switch(featureName){
        case "onCallRegistrar":
            const accountType = user?.accountType ?? "";
            const speciality = user?.speciality ?? "";
            const {onCallRegistrar} =  Features;
            if(onCallRegistrar.speciality.includes(speciality) && onCallRegistrar.accountType.includes(accountType)){
                return true;
            }
            else{
                return false;
            }
            break;
        default:
            return false;
       }
    }

    return [checkFeature]

}