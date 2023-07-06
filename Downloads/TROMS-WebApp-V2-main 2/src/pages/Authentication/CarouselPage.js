import React from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Col } from "reactstrap"
import  Trivicelogo  from 'assets/images/triViceHeaderlogo.svg';
import  bwclogo  from '../../images/bwc.png';
import  artworklogo  from '../../images/BCHartwork.png';

const CarouselPage = (carousel) => {
 
 const size =carousel.carousel;
  //console.log(size)
  return (
    <React.Fragment>
      <Col xl={size?size:9}>
        <div className="auth-full-bg pt-lg-5 p-4" style={{position:'relative'}} >
          <div className="w-100">
              
            <div className="bg-overlay" style={{zIndex:-1}} ></div>
            <div className="d-flex h-100 flex-column justify-content-between ">
                                    {/*1st column*/}
                <div className="m-0 p-0">
                       <div style={{float:'right'}}>
                       <span className="text-primary">
                         <img className="img-fluid"
                            style={{
                              height: "100px",
                              zIndex:100
                            }}
                            src={bwclogo}
                            alt="Birmingham Women's and Children's hospital"
		              				/>
                        </span>
                     </div>
                    </div>
                                  {/*2rd column*/}
                    <div className="row justify-content-center">
                    <div className="text-center">
                       <span className="text-primary">
                         <img
                            style={{
                              height: "100px",
                              width: "105.26px",
                            }}
                            src={Trivicelogo}
                            alt="Birmingham Women's and Children's hospital"
		              				/>
                        </span>
                      <div dir="ltr">
                          <div>
                            <div className="item">
                              <div className="py-3">
                                  <p className="font-size-24 mb-1">Triage, Referral and Advice</p>
                                  <p className="font-size-14 mb-4">Triage, refer a patient and get right advice on the move</p>
                              </div>
                            </div>
                          </div>
                          <div>

                          </div>
                      </div>
                    </div>
                    </div>
                              {/*3rd column*/}

                              <div className="m-0 p-0">
                       <div style={{float:'right'}}>
                       <span className="text-primary">
                         <img
                            style={{
                              height: "100px",
                            }}
                            src={artworklogo}
                            alt="Birmingham Women's and Children's hospital"
		              				/>
                        </span>
                     </div>
                    </div>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  )
}
export default CarouselPage
