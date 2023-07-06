import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty, map } from "lodash";
import moment from "moment";
import {caseTypes,caseCreators} from "store/caseDeatils/reducer"
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Media,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import images from "assets/images";
import {
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
} from "store/chat/actions";

//redux
import { useSelector, useDispatch } from "react-redux";



const Query = props => {
  const dispatch = useDispatch();

  const { chats, groups, contacts, allmessages,messageload,userDetails } = useSelector(state => ({
    chats: state.chat.chats,
    groups: state.chat.groups,
    contacts: state.chat.contacts,
   // messages: state.chat.messages,
   allmessages: state.caseDetails.messages,
   messageload:state.caseDetails.messageSend,
   userDetails:state.appReducer.userDetails,
  }));


  useEffect(()=>{
    console.log("allmessages",allmessages)
  },[allmessages])

  let firstName = userDetails && userDetails.firstName ;
  let lastName = userDetails && userDetails.lastName;
  let fullName = firstName ? firstName : "" + lastName ? lastName : "";
  let messages  = allmessages && allmessages.messages;

  const [messageBox, setMessageBox] = useState(null);
  // const Chat_Box_Username2 = "Henry Wells"
  const [currentRoomId, setCurrentRoomId] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState({
    name: "Henry Wells",
    isActive: true,
  });
  const [menu1, setMenu1] = useState(false);
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [other_Menu, setother_Menu] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [Chat_Box_Username, setChat_Box_Username] = useState("Steven Franklin");
  // eslint-disable-next-line no-unused-vars
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("online");
  const [curMessage, setcurMessage] = useState("");
  const [messagesent,setmsgsent] = useState(true)
  const [file,setFile] = useState('');
  const [btndisable,setBtndisable] =useState(true)

  useEffect(() => {
    dispatch(onGetChats());
    dispatch(onGetGroups());
    dispatch(onGetContacts());
    dispatch(onGetMessages(currentRoomId));
  }, [onGetChats, onGetGroups, onGetContacts, onGetMessages, currentRoomId]);

  useEffect(() => {
    if (!isEmpty(messages)) scrollToBottom();
  }, [messages]);


  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId) => {
    setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    dispatch(onGetMessages(roomId));
  };

  const addMessage = (roomId, sender) => {
    const message = {
      id: Math.floor(Math.random() * 100),
      roomId,
      sender,
      message: curMessage,
      createdAt: new Date(),
    };
    setcurMessage("");
    dispatch(onAddMessage(message));
  };

  const scrollToBottom = () => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  };

  const onKeyPress = e => {
    const { key, value } = e;
    if (key === "Enter") {
     // setcurMessage(value);
     if(curMessage !==''){
      dispatch(caseCreators.requestSendMessage(props.caseID,curMessage));
     } 
      setcurMessage('');
    }
  };

  let messageID = messages && messages.map(x=>x.sentBy._id).toString()
 // console.log("messageId",JSON.stringify(messageID));
 // console.log("props.userID",props.userID);

  useEffect(()=>{
    dispatch(caseCreators.requestGetMessage(props.caseID))
  },[])

  
  useEffect(()=>{
    if(messageload == false){
      dispatch(caseCreators.requestGetMessage(props.caseID))
    }    
  },[messageload])

  const onChangeFile = (e) =>{
    console.log('event.target.files[0]', e.target.files[0])


    const imgFile = e.target.files[0]
    setFile(imgFile);
    dispatch(caseCreators.requestSendImg(props.caseID,imgFile))

  }


  return (
    <React.Fragment>

          {/* Render Breadcrumb */}
          <Row>
            <Col lg="12">
              <div >

                <div className="w-100 user-chat">
                  <Card >
                   
                    <div>
                      <div className="chat-conversation p-3">
                        <ul className="list-unstyled">
                          <PerfectScrollbar
                            style={{ height: "470px" }}
                            containerRef={ref => setMessageBox(ref)}
                          >
                      {/*      <li>
                              <div className="chat-day-title">
                                <span className="title">Today</span>
                              </div>
                            </li>
                       */}     
                            {messages &&
                              map(messages, message => (
                                <li
                                  key={"test_k" + message._id}
                                  className={
                                    message.sentBy._id === props.userID
                                      ? "right"
                                      : ""
                                  }
                                >
                               
                                
                                  <div className="conversation-list">
                              
                                    <div className="ctext-wrap">
                                      <div className="conversation-name">
                                        {message.sentBy.firstName ? message.sentBy.firstName : ""} {message.sentBy.lastName ? message.sentBy.lastName : ""}
                                      </div>
                                      {(message?.content?.includes('query_image')) ? (
                                         <img
                                         src={message.content}
                                         alt=""
                                         height="200px"
                                         
                                              />
                                      ):(<p>{message.content}</p>)
                                              }
                                     
                                      <p className="chat-time mb-0">
                                        <i className="bx bx-time-five align-middle me-1" />
                                        {moment(message.sentAt).format(
                                          "DD-MM-YY H:mm"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                          </PerfectScrollbar>
                        </ul>
                      </div>
                      <div className="p-3 chat-input-section">
                        <Row>
                          <Col>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={curMessage}
                                onKeyPress={onKeyPress}
                                onChange={e => {setcurMessage(e.target.value)
                                if(e.target.value.trim().length == 0){
                                  setBtndisable(true)
                                }else if(e.target.value !== null && e.target.value !== " "){
                                  setBtndisable(false)
                                }}}
                                className="form-control chat-input"
                                placeholder="Enter Message..."
                              />
                              <div className="chat-input-links">
                                <ul className="list-inline mb-0">
                                
                                  <li className="list-inline-item" >
                                  <label htmlFor="file" style={{height:'15px'}} >
                                      <i 
                                        className="mdi mdi-file-image-outline"
                                        id="Imagetooltip"
                                        style={{color:'#556EF5',cursor:'pointer',fontSize:'17px'}}
                                      />
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="Imagetooltip"
                                      >
                                        Images
                                      </UncontrolledTooltip>
                                    
                                    </label>
                                    <Input type="file" id="file"
                                    onChange={onChangeFile}                                    
                                    style={{display: 'none'}}/>
                                  </li>
                                  
                                </ul>
                              </div>
                              
                            </div>
                          </Col>
                          <Col className="col-auto">
                            <Button
                              type="button"
                              color="primary"
                              disabled={btndisable}
                              onClick={() =>{
                                //addMessage(currentRoomId, currentUser.name)
                                setcurMessage('');
                                if(!curMessage == ''){
                                dispatch(caseCreators.requestSendMessage(props.caseID,curMessage));
                                }
                              }}
                              className="btn btn-primary btn-rounded chat-send w-md "
                            >
                              <span className="d-none d-sm-inline-block me-2">
                                Send
                              </span>{" "}
                              <i className="mdi mdi-send" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
       
     
    </React.Fragment>
  );
};

Query.propTypes = {
  caseID: PropTypes.any,
  userID:PropTypes.any
};

export default Query;
