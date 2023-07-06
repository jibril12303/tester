import React,{useState} from "react"
import PropTypes from "prop-types"

// availity-reactstrap-validation
import { AvForm, AvField,AvRadioGroup,AvRadio} from "availity-reactstrap-validation"
import {
    Container,
    Row,
    Col,
    Table,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    Form,
    FormGroup,
    Label,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Modal
  } from "reactstrap"
  
//toast
import {showToast} from 'utils/toastnotify'
  
import Slider from "react-slick";
import  { ReactComponent as CloseIcon } from 'assets/icon/modalclose.svg';
import RatingTooltip from "react-rating-tooltip";
import logoLightPng from "../../assets/images/triViceHeaderlogo.svg";

const Revmodal = (props)=>{

    console.log('props',props)
    
  const [slideIndex,setSlideIndex] = useState('')
  const [submitbtn,setSubmitbtn] = useState(false)
  const [def, setdef] = useState("")
  const formResponse = [];
  console.log("formResponse",formResponse)

  const feedbackquestions = props?.qna?.feedback
  console.log("feedbackquestions",feedbackquestions)

  const handleresetSubmit=(e,v)=>{
    console.log("formResponse",formResponse)
        console.log("v=",v)
        setSlideIndex(0)
        props.close(false)
        console.log("v= ",v)
//    feedbackquestions && feedbackquestions.map((item)=>{
//      responsearr.push({
//        question:item.question , answer:v[item.question]
//      })
//    })
  showToast('Thank you very much for your feedback', 'success')
  }

  function renderQuestions(feedbackquestions){
    return(
    <>  
  {   
  feedbackquestions && feedbackquestions.map((item,key)=>{
   
    let ansval = item && item.answers;
    let answers = null;
    if(item.type == "radio"){
    return(
            <div className="mb-3" key={key}>
              <label className="font-size-16">{item.question} <span className="text-danger">*</span></label>
                <AvRadioGroup name={item.question} required errorMessage="Pick one!">
                {Object.keys(item.answers).map((ans)=>{
                  return(
                    <div style={{display:'inline-block',padding:"5px"}} key={key}>
                    <AvRadio label={ans} value={item.answers[ans].score.toString()} key={key}/>
                    </div>
                  )
                })}
                </AvRadioGroup>
            </div>  

        )}

  if(item.type == "textarea"){
      return(
          <div className="mb-3" key={key}>
            <label className="font-size-16">{item.question} <span className="text-danger">*</span></label>
            <AvField
              className="form-control"
              id={item.question}
              name={item.question}
              type="textarea"
              required
            />
          </div>
      )}
  if(item.type=="smallbox"){
    return(
        <div className="mb-1" key={key}>
            <label className="font-size-16">{item.question} <span className="text-danger">*</span></label>
          
            {
                Object.keys(item.answers).map((ans)=>{
                    let index = formResponse && formResponse.findIndex(
                        (rank, index) => rank.question === item.answers
                            );
                    return(<>
                    <div style={{display:'inline-block',padding:"3px"}} key={key}>
                        <AvField
                        className="form-control"
                        name={ans}
                        onChange={(e)=>{formResponse.push({...formResponse[index],ans:e.target.value})}}
                        type="number"
                        />  
                        <p>{ans}</p>
                        </div>
                        </>
                    )
                })
            }
            
        </div>
    )
  }
    
})}
    </>
)}
  
    
const settings = {
    arrows:false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  
  
  let slider= null;
  
  const next=()=> {
    slider.slickNext();
  
  }
  const previous=()=> {
    slider.slickPrev();
  }
  console.log("slider",slider)
  const styleConfig = {
    counterStyle: {
      height: "40px",
      backgroundColor: "#F58220",
      paddingLeft: "12px",
      paddingRight: "12px",
      color: "#FFF",
      lineHeight: "28px"
    },
    starContainer: {
      fontSize: "40px",
      backgroundColor: "#F2F2F2",
      height: "40px"
    },
    statusStyle: {
      height: "40px",
      backgroundColor: "#F58220",
      paddingLeft: "12px",
      paddingRight: "12px",
      color: "#FFF",
      lineHeight: "40px",
      minWidth: "100px",
      fontSize: "18px",
      textAlign: "center"
    },
    tooltipStyle: {
      fontSize: "40px",
      padding: "3px"
    }
  }
  
return(

    <>
      {/*swiper modal*/}
            <Modal
           isOpen={props.open}
           scrollable={true}
           backdrop={'static'}
           centered={true}
           id="staticBackdrop"
           size="lg"
         
       >
           <div className="modal-header">
               <h5 className="modal-title" id="staticBackdropLabel">
                   <i className="fa fa-warning"></i>
                   Feedback
               </h5>
               <button
                   type="button"
                   className="btn"
                   onClick={()=>{props.close(false);  setSlideIndex(0)}}
                   style={{
                     float:'right',
                     cursor:'pointer'
                   }}>
                <div>
                  <CloseIcon style={{color:'black'}}/>
                  </div>
               </button>
           </div>
           <div className="modal-body" style={{overflow:'none',width:'auto',height:'300px'}}>
                <div style={{overflow:'none',width:'auto'}}>
                     <Slider
                      {...settings}
                     ref={c => (slider = c)}
                     afterChange={(index)=>{
                       index==1?setSubmitbtn(true):setSubmitbtn(false);
                       setSlideIndex(index)
                    }}
                     style={{overflow:'none'}} 
                     >
                    <div key={1}>
                              <div className="p-0 text-center">
                              <div className="logo-lg mb-20" >
                                  <img src={logoLightPng} alt="" height="60" style={{margin:'auto'}} />
                              </div>
                                  <h2 className="font-16 mt-3">
                                  How would you rate TriVice?
                                  </h2>
                                  <RatingTooltip
                                    max={5}
                                    styleConfig={styleConfig}
                                    onChange={rate => {
                                      setdef(rate)
                                    }}
                                    ActiveComponent={
                                      <i
                                        className="mdi mdi-star text-primary"
                                        
                                      />
                                    }
                                    InActiveComponent={
                                      <i
                                        className="mdi mdi-star-outline text-muted"
                                        
                                      />
                                    }
                                  />{" "}
                                  <div className="mt-4">
                                  <p className="font-size-18">Your opinion is very important to us.
                                We appreciate your feedback and will use it to make improvements.
                                  This survey takes about 1 minute to complete.</p>
                                  </div>
                                </div> 
                   </div>

                   <div key={2}>
                      {
                            slideIndex == 1 &&
                             <AvForm className="form-horizontal mb-20" id="my-form"
                                  onValidSubmit={(e, v) => { handleresetSubmit(e, v)}}>
                                <div style={{width:"80%",margin:'auto'}}>
                                    {renderQuestions(feedbackquestions)}
                                </div>
                          </AvForm>
                      }
                    </div>
               </Slider>
             </div>
           </div>
           <div className="modal-footer">
                {
                    slideIndex !=1 &&
                      <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                  def==null && showToast('Please select a star rating', 'error')
                                  def && props.close(false)
                                  def && showToast('Thank you very much for your feedback', 'success')
                                  setdef(null)
                                
                              }}
                          >
                              Submit
                          </button>
                }
                {
                    slideIndex==0 &&
                      <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => {
                            next()
                          }}
                      >
                  Take survey 
                    </button>
                }
                {
                    slideIndex ==1 &&
                      <button
                              form = "my-form"
                              type="submit"
                              className="btn btn-primary"
                              onClick={() => {

                                  def && props.close(false)
                                  def && showToast('Thank you very much for your feedback', 'success')
                                  setdef(null)
                                
                              }}
                          >
                              Submit
                          </button>
                }
               
           </div>
       </Modal>
    </>
)

}
Revmodal.propTypes = {
    open:PropTypes.any,
    close:PropTypes.any,
    qna:PropTypes.any,
  }

export default Revmodal;