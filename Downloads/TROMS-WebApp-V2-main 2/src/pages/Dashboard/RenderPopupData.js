import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import image1 from "assets/popupimages/image1.png"
import image2 from "assets/popupimages/image2.png"
import image3 from "assets/popupimages/image3.png"
import image4 from "assets/popupimages/image4.png"
import image5 from "assets/popupimages/image5.png"
import image6 from "assets/popupimages/image6.png"
import image7 from "assets/popupimages/image7.png"
import image8 from "assets/popupimages/image8.png"
import  { ReactComponent as PlayVideoIcon } from 'assets/icon/playvideo.svg';

const RenderPopupData = (props)=>{
   
    if(props.index == 1){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image1}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Welcome to TriVice app</h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>An intelligence triaging and referral app to get advice & guidance from specialist clinicians quickly. </p>
            </div>
        )
    }
    else if(props.index == 2){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image2}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Enter patient & parent details</h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Please tell us about the patient you want to refer so that we notifiy them as and when required. </p>
            </div>
        )
    }
    else if(props.index == 3){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image3}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Select pathway & answer questions</h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Select speciality and pathway for which you want to refer the patient & answer a few simple questions.</p>
            </div>
        )
    }
    else if(props.index == 4){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image4}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Check summary & update</h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Check the summary of your response before proceeding further. You can modify your response. </p>
            </div>
        )
    }
    else if(props.index == 5){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image5}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Upload images, scans &  information</h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Images are integral to Trivice decision making process. Upload or drag & drop images and scans.</p>
            </div>
        )
    }
    else if(props.index == 6){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image6}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Get advice & guidance </h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Based on your response get a specialist advice and guidance. App will advice you on the next steps.</p>
            </div>
        )
    }
    else if(props.index == 7){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image7}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Give advice & guidance </h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>If you are a reviewer(specialist) you can view referrals and give specialist advice and guidance. </p>
            </div>
        )
    }
    else if(props.index == 8){
        return(
            <div >
                <div style={{margin:'auto',textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
                    <img src={image8}/>
                </div>
                <h3 style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>Watch our training video <a href="https://youtu.be/sM13U-PJ3Dk" target="_blank" rel="noreferrer" style={{color:'red'}}><PlayVideoIcon /></a></h3>
                <p style={{margin:'auto',textAlign:'center',marginBottom:'20px'}}>For more information watch our training video. We welcome your feedback to improve our app. </p>
            </div>
        )
    }
    
}

RenderPopupData.propTypes = {
    index: PropTypes.any,
 
  }

export default RenderPopupData