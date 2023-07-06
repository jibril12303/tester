import React, { useEffect, useState } from 'react';
import PropTypes, { any } from 'prop-types';
import {
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux';
import { createReferralCreators } from 'store/create-referral/reducer';
import noImage from 'assets/images/NO-IMAGE-AVALAIBLE.png'
import img1 from 'assets/images/product/img-1.png'
import classnames from "classnames";
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import caseDetails, {caseTypes,caseCreators } from "store/caseDeatils/reducer"
import ClipLoader from 'react-spinners/ClipLoader'
import { Label } from 'recharts';
import { height, width } from '@mui/system';
import OffCanvasRheuImages from './OffCanvasRheuImages';

const Images = (props) => {
  const [currentIMG,setcurrentIMG] = useState({src: noImage, type:'image/png'});
  const [activeTab, setActiveTab] = useState("1")
  const [currentIMGTitle, setCurrentIMGTitle]= useState("")
  const [showLightbox, setLightbox] = useState(false);
  const [REImages, setREImages] = useState([])
  const [LEImages, setLEImages] = useState([])
  const [plasImages, setPlasImages] = useState([])
  const [_, force] = useState();
  const [showRheuScreenImages , setShowRheuScreenImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]); // for offcanvas rheu images
  const [selectedImgCatogory, setSelectedImgCatory] = useState("");

  const handleSelectImages = (category)=>{
    debugger;
      setSelectedImgCatory(category);
      let uploadedImages =  props?.images || [];
      let rheuInves2 = props?.rheuImages?.rheuInves2 || [];
      let rheuInves3 = props?.rheuImages?.rheuInves3 || [];

      switch(category) {
        case "Uploaded images":
          if(uploadedImages.length >0){

            setSelectedImage(uploadedImages.map((item,id)=>({
              id,
              url:item?.src,
              ...item
            })))
            setShowRheuScreenImages(true);
          }
          break;
        case "2nd Investigation":

          if(Object.keys(rheuInves2)?.length >0){

            let rheu2Images = [];

            Object.keys(rheuInves2).map((fieldName,id)=>{
              rheuInves2[fieldName].map((img,id)=>{
                rheu2Images.push({
                  id:rheu2Images.length,
                  url:img.src,
                })
              })
            })

            if(rheu2Images.length >0){
              setSelectedImage(rheu2Images); 
              setShowRheuScreenImages(true);
            }
          }
          break;
        case "3rd Investigation":
          if(Object.keys(rheuInves3)?.length >0){

            let rheu3Images = [];

            Object.keys(rheuInves3).map((fieldName,id)=>{
              rheuInves3[fieldName].map((img,id)=>{
                rheu3Images.push({
                  id:rheu3Images.length,
                  url:img.src,
                })
              })
            })

            if(rheu3Images.length >0){
              setSelectedImage(rheu3Images); 
              setShowRheuScreenImages(true);
            }
          }
          break;

       }
      }

  const {loading} =useSelector( state=>({
    loading: state.caseDetails.downloading

  }))
    useEffect(()=>{
      setcurrentIMG({src: noImage, type:'image/png'})
    },[])
    useEffect(()=>{
      if(loading) setcurrentIMG({src:noImage, type:'image/png'})
      if(!loading){
        try {
          if(props.speciality == "Plastic Surgery"){
            setcurrentIMG(props.images[0])
          } else if(props.speciality == "Ophthalmology"){
            setcurrentIMG(props.images.rightEye[0] || props.images.leftEye[0] ||{src:noImage, type:'image/png'} )
          } 
        } catch (error) {
          setcurrentIMG({src:noImage, type:'image/png'})
        }
      }
    },[loading])

    useEffect(()=>{
      debugger;
      if(props.rheuImages && props.speciality == "Rheumatology"){
        const {rheuInves2,rheuInves3} = props.rheuImages;

            if(Object.keys(rheuInves2).length>0){
              try {
                setcurrentIMG({src: rheuInves2[Object.keys(rheuInves2)[0]][0], type:'image/png'} || {src:noImage, type:'image/png'});
              } catch (error) {
                setcurrentIMG({src:noImage, type:'image/png'});
              }
             
            }
            else if(Object.keys(rheuInves3).length>0){
              try {
                setcurrentIMG({src: rheuInves2[Object.keys(rheuInves3)[0]][0], type:'image/png'} || {src:noImage, type:'image/png'});
              } catch (error) {
                setcurrentIMG({src:noImage, type:'image/png'});
              }
              
            }
      }
    },[props.rheuImages])
    
    const toggleTab = (tab)=> {
        if (activeTab !== tab) {
          setActiveTab(tab)
        }
      }
    if (loading) return (
      <div className='text-center'>
        <span>
          <ClipLoader loading={loading} size={150}/>
        </span>
      </div>
      
      )
    if(props.speciality == "Plastic Surgery" ){
    // if(props.speciality == "Plastic Surgery" ){

        return (
            <div className="product-detai-imgs">
            <Row>
              <Col md="2" xs="3">
                <Nav className="flex-column" pills>
                
                  {
                        props && props.images && props?.images?.map((item,key)=>
                       <>                          
                          <NavItem>
                          <NavLink 
                            className={classnames({
                              active: item == currentIMG,
                            })}
                            onClick={() => {
                              toggleTab("1")
                              setcurrentIMG(item)
                            }}
                          >
                            {item?.type?.includes('image') ? (
                              <img
                              src={item.src}
                              alt=""
                              onClick={() => {
                                setcurrentIMG(item)
                              }}
                              className="img-fluid mx-auto d-block rounded"
                            />
                            ) : (
                              <i className='bx bx-video' />
                            )}
                            
                          </NavLink>
                        </NavItem>
                    </>
                        )
                    
                  }
    
                </Nav>
              </Col>
              <Col md={{ size: 7, offset: 1 }} xs="9">
                <TabContent activeTab={activeTab} >
                  <TabPane tabId="1">
                    <div>
                    {currentIMG?.type?.includes('image') && (
                      <img
                      src={currentIMG.src ? currentIMG.src :Defaultimg}
                      alt={currentIMG.src ? "img" :"No image found"}
                      id="expandedImg1"
                      className="img-fluid mx-auto d-block"
                      onClick={()=>setLightbox(true)}
                    />
                      )} {currentIMG?.type.includes('video') && (
                        <video controls  className="ratio ratio-16x9" height="240" widht="320">
                          <source  src={currentIMG.src} type={currentIMG.type}/>
                            Your Browser does not support video
                        </video>
                      )}
                    </div>
                  </TabPane>
                </TabContent>
              
              </Col>
            </Row>
            {showLightbox && (
                <Lightbox
                    mainSrc={currentIMG.src}
                    onCloseRequest={()=>setLightbox(false)}
                    enableZoom={true}
                />
            )}
            
            </div>
        );
    }
    if(props.speciality == "Ophthalmology"){
        return (
            <div className="product-detai-imgs">
            <Row>
              <Col md="2" xs="3">
              <h4 style={{textAlign:'center'}}>Right Eye</h4>
                <Nav className="flex-column" pills>
                
                  {
                        props.images && props.images.rightEye && props?.images?.rightEye.map((item,key)=>
                       <>
                  
                          
                          <NavItem>
                          <NavLink 
                            className={classnames({
                              active: item == currentIMG,
                            })}
                            onClick={() => {
                              toggleTab("1")
                              setcurrentIMG(item)
                            }}
                          >
                            {item?.type?.includes('image') ? (
                              <img
                              src={item.src}
                              alt=""
                              onClick={() => {
                                setcurrentIMG(item)
                              }}
                              className="img-fluid mx-auto d-block rounded"
                            />
                            ) : (
                              <i className='bx bx-video' />
                            )}
                            <label>{props.images.rightEye[key].exam}</label>
                          </NavLink>
                        </NavItem>
                    </>
                        )
                    
                  }
    
                </Nav>
              </Col>
              <Col md={{ size: 8,}} xs="6">
                <TabContent activeTab={activeTab} >
                  <TabPane tabId="1">
                    <div>
                      {currentIMG?.type?.includes('image') && (
                      <img
                      src={currentIMG.src ? currentIMG.src :Defaultimg}
                      alt={currentIMG.src ? "img" :"No image found"}
                      id="expandedImg1"
                      className="img-fluid mx-auto d-block"
                      onClick={()=>setLightbox(true)}
                    />
                      )} {currentIMG?.type.includes('video') && (
                        <video controls  className="ratio ratio-16x9" height="240" widht="320">
                          <source  src={currentIMG.src} type={currentIMG.type}/>
                            Your Browser does not support video
                        </video>
                      )}

                    </div>
                  </TabPane>
                </TabContent>
              
              </Col>
              <Col md="2" xs="3">
              <h4 style={{textAlign:'center'}}>Left Eye</h4>
                <Nav className="flex-column" pills>
                
                  {
                        props.images && props.images.leftEye && props?.images?.leftEye.map((item,key)=>
                       <>
                  
                          
                          <NavItem>
                          <NavLink 
                            className={classnames({
                              active: item == currentIMG,
                            })}
                            onClick={() => {
                              toggleTab("1")
                              setcurrentIMG(item)
                            }}
                          >
                            {item?.type?.includes('image') ? (
                              <img
                              src={item.src}
                              alt=""
                              onClick={() => {
                                setcurrentIMG(item)
                              }}
                              className="img-fluid mx-auto d-block rounded"
                            />
                            ) : (
                              <i className='bx bx-video' />
                            )}
                            <label>{props.images.leftEye[key].exam}</label>
                          </NavLink>
                        </NavItem>
                    </>
                        )
                    
                  }
    
                </Nav>
              </Col>
            </Row>
            {showLightbox && (
                <Lightbox
                    mainSrc={currentIMG.src}
                    imageTitle={currentIMGTitle}
                    onCloseRequest={()=>setLightbox(false)}
                    enableZoom={true}
                />
            )}
            
            </div>
        );
    }
    if(props.speciality == "Rheumatology"){
      return (
        <div className="product-detai-imgs">
        <Row>
          <Col md="12">
          <h3 >Uploaded images: </h3>
          <Nav className="flex-row" pills>
          {
                     props?.images?.length >0 ?
                      props?.images?.map((image)=>{
                        return(
                          <>
                            <NavItem style={{width:"fit-content"}} >
                              <NavLink 
                                className={classnames({
                                  active: image == currentIMG
                                })}
                                onClick={() => {
                                  toggleTab("1")
                                  // setcurrentIMG(image)
                                  handleSelectImages("Uploaded images");
                                }}
                              >
                                <div >
                                  <img
                                  src={image.src}
                                  alt=""
                                  onClick={() => {
                                    // setcurrentIMG(image)
                                    
                                  }}
                                  className="img-fluid d-block rounded"
                                  style={{width:"100px",height:"80px",objectFit:"cover"}}
                                  />
                                  </div>
                                
                                
                                {/* <label>{props.images.leftEye[key].exam}</label> */}
                              </NavLink>
                            </NavItem>
                          </>
                        )
                      })
                      :
                      <img src={noImage} height="100px" width="100px"/>
                    }

            </Nav>
          </Col>
          </Row>
        <Row>
          <Col md="12">
          <h3 >2nd Investigation: </h3>
          <Nav className="flex-row" pills>
            {
               typeof(props?.rheuImages?.rheuInves2) === "object" && Object.keys(props?.rheuImages?.rheuInves2).length >0 ?
                    props.rheuImages && props.rheuImages.rheuInves2 && Object.keys(props.rheuImages.rheuInves2).map((fieldName)=>{
                   return (<>
                      {/* <h5 style={{marginLeft:"20px"}} >{fieldName}{":"}</h5> */}
                     {
                       props.rheuImages.rheuInves2[fieldName].map((image)=>{
                         return(
                           <>
                             <NavItem style={{width:"fit-content"}}>
                               <NavLink 
                                 className={classnames({
                                   active: image == currentIMG,width:"fit-content"
                                 })}
                                 onClick={() => {
                                   toggleTab("1")
                                  //  setcurrentIMG(image)
                                  handleSelectImages("2nd Investigation");

                                 }}
                               >
                                   <img
                                   src={image.src}
                                   alt=""
                                   onClick={() => {
                                    //  setcurrentIMG(image)
                                   }}
                                   className="img-fluid d-block rounded"
                                   style={{width:"100px",height:"80px",objectFit:"cover"}}

                                 />
                                
                                
                                 {/* <label>{props.images.leftEye[key].exam}</label> */}
                               </NavLink>
                             </NavItem>
                           </>
                         )
                       })
                     }
                     </>
                   )
                 })
                 :
                 <img src={noImage} height="100px" width="100px"/>
               }

             </Nav>
          </Col>
        </Row>
        <Row>
        <Col md="12">
        <h3>Gastrointestinal specifics investigation: </h3>
            <Nav className="flex" pills>
              {
                typeof(props?.rheuImages?.rheuInves3) === "object" && Object.keys(props.rheuImages.rheuInves3).length >0 ?
                props.rheuImages && props.rheuImages.rheuInves3 && Object.keys(props.rheuImages.rheuInves3).map((fieldName)=>{
                  return (<>
                  <div style={{display: 'flex', flexDirection: 'column'}}>

                    {
                      props.rheuImages.rheuInves3[fieldName].map((image)=>{
                        return(
                          <>
                            <NavItem style={{width:"fit-content"}} >
                              <NavLink 
                                className={classnames({
                                  active: image == currentIMG,width:"fit-content"
                                })}
                                onClick={() => {
                                  toggleTab("1")
                                  // setcurrentIMG(image)
                                  handleSelectImages("3rd Investigation");
                                }}
                              >
                                  <img
                                  src={image.src}
                                  alt=""
                                  onClick={() => {
                                    // setcurrentIMG(image)
                                  }}
                                  className="img-fluid d-block rounded"
                                  style={{width:"100px",height:"80px",objectFit:"cover"}}
                                />
                                
                                
                                {/* <label>{props.images.leftEye[key].exam}</label> */}
                              </NavLink>
                            </NavItem>
                          </>
                        )
                      })
                    }
                    {/* <h5 style={{marginLeft:"20px"}} className="fw-medium">{fieldName}</h5> */}

                  </div>
                   
                    </>
                  )
                })
                :
                <img src={noImage} height="100px" width="100px"/>
              }

            </Nav>
        </Col>
        </Row>  
        {showLightbox && (
                <Lightbox
                    mainSrc={currentIMG.src}
                    onCloseRequest={()=>setLightbox(false)}
                    enableZoom={true}
                />
            )}
          <OffCanvasRheuImages showRheuScreenImages={showRheuScreenImages} toggleRheuScreen={()=>setShowRheuScreenImages(false)} selectedImage={selectedImage} selectedImgCatogory={selectedImgCatogory}
          setHighlightImage={setcurrentIMG} setLightbox={setLightbox} />
        </div>
    );
    }

    return <p>loading...</p>
};
Images.propTypes = {
    images: PropTypes.array,
    speciality: PropTypes.string,
    rheuImages:any
}

export default Images;
