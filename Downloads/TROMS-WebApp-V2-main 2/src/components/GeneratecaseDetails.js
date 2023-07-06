// Div (Color, Text1)
// CustomHeader (Text2[])
// Divider
// Text (Text3[][])
// Div

import React,{useEffect,useState} from "react";
import styled from "styled-components";



const Container = styled.div`

	border-radius: 0px 0px 15px 15px;
`;

const ContactText = styled.div`
	color: #495057;

`;

const ColoredContainer = styled.div`
	display: flex;
	border-radius: 15px 15px 0px 0px;
	width: 100%;
	padding: 5px 5px 0px 10px;
`;

const TextContainer = styled.div`
	overflow-y: scroll;
	padding: 10px;
	border-radius: 0px 0px 15px 15px
	font-size: 20px;
	width: 100%;

`;

const StyledSpan = styled.span`
	font-weight: normal;
`;

let Yes = 'Yes';
let No = 'No';




const generateProps = (info,onChange,setBtnSelected,btnSelected) => {
	const rendered = [];
	if (info && info?.pathway) {
		for (let index = 0; index < info?.pathway?.length; index++) {
			const element = info && info?.pathway[index];
			Object.keys(element).forEach((e) => {
				rendered.push(
					<div style={{ marginTop: "0" }}>
						<div
							style={{
								margin: "0",
								padding: "0",
							}}
						>
							{element[e]}
						</div>
						<hr/>
					</div>
				);
			});
		}
	} else {
		info.forEach((e) => {
			if (e.buttons == "Yes") {
				rendered.push(
					<>
						 <div>
                            <div
                              className="btn-group btn-group-example mb-3"
                              role="group"
                            >
                              <button onClick ={(e)=>{
								  onChange('Yes');
								  setBtnSelected('Yes')
							  }}
                                type="button"
                                className="btn btn-success w-xs "
								style={{color:btnSelected == 'Yes'? 'green':'white'}}
                              >
                                <i className="mdi mdi-thumb-up mdi-18px"></i>
                              </button>
                              <button onClick ={(e)=>{
								  onChange('No');
								  setBtnSelected('No')
								}}
                                type="button"
                                className="btn btn-danger w-xs"
								style={{color:btnSelected == 'No'?'red':'white'}}
                              >
                                <i className="mdi mdi-thumb-down mdi-18px"></i>
                              </button>
                            </div>
                          </div>
						<hr/>
					</>
				);
			} else {
				rendered.push(
					<>
						<h5 style={{color:'#495057'}}>
							{e.header}
						</h5>
						<h5>
							{e.question}
						</h5>
						<ContactText>{e.answer ? e.answer : ''}</ContactText>
						<contactText>{e.priority ?<h6 className="bold">{e.priority}</h6>  : '' }</contactText>
						<ContactText>{e.discripthead? <h6 className="bold">{e.discripthead}</h6>: ''}</ContactText>
						<ContactText>{e.contactName ? e.contactName : ''}</ContactText>
						<ContactText>{e.contactEmail ? e.contactEmail : ''}</ContactText>
						<ContactText>{e.contactNumber? e.contactNumber: ''}</ContactText>
						<ContactText>{e.HospitalName? e.HospitalName: ''}</ContactText>
						<ContactText>{e.HospitalId? e.HospitalId: ''}</ContactText>
						<ContactText>{				
						e.Leaflet =="Not Available"?"Not Available": e.Leaflet?.map((item,key)=>{return(
							<div key={key}><a  target="_blank"  rel="noreferrer"  href={item.link}>
								<span className="bx bx-book-open p-1"/> {item.name}</a></div>)
						}) }</ContactText>
						<ContactText>
						{e.description && e.description.split('\n').map((i,ind) =>{
                                return <p key={ind}>{i}</p>
                            })}</ContactText>
					
						<hr/>
					</>
				);
			}
		});
	}

	return rendered;
};

const generateCaseDetails = (props) => {

const [btnSelected,setBtnSelected] = useState('')

	return (
		<div>
			<TextContainer
	className="textcontain"
			>
				{generateProps(props?.information,props?.buttonChange,setBtnSelected,btnSelected	)}
				{props.radioState !== -1 ? props.extraComponents : ""}

				
			</TextContainer>
		</div>
	);
};

export default generateCaseDetails;
