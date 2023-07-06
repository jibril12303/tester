import SweetAlert from "react-bootstrap-sweetalert"
import { success } from "toastr";
import React, { useEffect, useState } from "react"

export const showNotification = (message)=>{
    console.log("working")

let basic = true;

    if(message){
<SweetAlert
        title={message}
        onConfirm={() => {
        setbasic(false)
                      }}
                    />
    }
      
        



      


}
