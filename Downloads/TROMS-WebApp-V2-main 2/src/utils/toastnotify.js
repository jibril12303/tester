import React, { useState } from "react";

import { Button, Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import toastr from "toastr";
import "toastr/build/toastr.min.css";


export function showToast(msg,type) {
    let toastType = type ? type :"info";
    const title ='';
    let message = msg ? msg : '';
    const position ="toast-bottom-center";
    const showEasing = "swing";
    const hideEasing = "linear";
    const showMethod ="fadeIn";
    const hideMethod = "fadeOut";
    const showDuration ="300";
    const hideDuration = "1000";
    const timeOut = "5000";
    const extendedTimeOut = "1000";
    let positionClass = "toast-top-right";

    //Fetch checked Type
   // for (let i = 0; i < ele.length; i++) {
   //   if (ele[i].checked) toastType = ele[i].value;
  //  }

    toastr.options = {
      positionClass: positionClass,
      timeOut: timeOut,
      extendedTimeOut: extendedTimeOut, 
      showEasing: showEasing,
      hideEasing: hideEasing,
      showMethod: showMethod,
      hideMethod: hideMethod,
      showDuration: showDuration,
      hideDuration: hideDuration
    };

    // setTimeout(() => toastr.success(`Settings updated `), 300)
    //Toaster Types
    if (toastType === "info") toastr.info(message, title);
    else if (toastType === "warning") toastr.warning(message, title);
    else if (toastType === "error") toastr.error(message, title);
    else if (toastType === "success") toastr.success(message, title);
  } 