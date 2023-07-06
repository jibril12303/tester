import React,{useState,useEffect} from 'react'
//redux
import { useSelector, useDispatch } from "react-redux"


const profileupdateValidator = ()=> {

    const {userDetails,incompletProfile} = useSelector(state => ({
    userDetails:state.appReducer.userDetails,
    incompletProfile:state.appReducer.incompletProfile,
    }))

    const [value ,setValue] = useState(null)
  

      useEffect(()=>{
              
        if(userDetails?.consultantCode == null ||userDetails?.firstName == null || userDetails?.lastName == null
        ||userDetails?.email == null || userDetails?.phoneNumber == null || userDetails?.grade == null
        || userDetails?.speciality == null || userDetails?.speciality == false  ){
            setValue(true)
          
      }
      },[userDetails,incompletProfile])


    return value;
}

export default profileupdateValidator
