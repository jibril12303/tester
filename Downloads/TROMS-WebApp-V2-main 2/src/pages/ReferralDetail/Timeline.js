import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const Timeline = (props) => {
    return (
        <div>
            <strong>Contact attempt history:</strong> <br/>
            <div className="hori-timeline">
                <div className="owl-carousel owl-theme  navs-carousel events" id="timeline-carousel">

                       {props?.timeline?.map((item,index)=>{
                           console.log(item)
                           if(item != null && item){
                               return(
                                   <div className="item event-list mt-2" style={{display: "inline-table"}} key={index}>
                                       <div>
                                           <div className="event-date">
                                               <h5 className="mb-1"><i
                                                   className={item?.contactSuccess ? 'mdi mdi-phone-check-outline fa-2x' : "mdi mdi-phone-remove-outline fa-2x"} style={{color: item?.contactSuccess ? 'green' : 'red'}}></i></h5>
                                           </div>
                                           <div className="event-down-icon"><i
                                               className="bx bx-radio-circle-marked h1  down-arrow-icon" style={{color: 'gray'}}></i>
                                           </div>
                                           <div className="mt-1 px-3"><p className="text-muted" style={{color: 'gray'}}>{item?.time}</p></div>
                                       </div>
                                   </div>
                               )
                           }
                       })}
                </div>
                {/*<ul className="list-unstyled mt-2" style={{fontSize:'14px'}}>*/}

                {/*</ul>*/}
            </div>
        </div>
    );
};

Timeline.propTypes = {
    timeline: PropTypes.array.isRequired,
}

export default Timeline;
