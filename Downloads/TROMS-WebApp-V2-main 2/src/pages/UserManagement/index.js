import React,{useRef,useState,useEffect} from 'react'
import { MetaTags } from 'react-meta-tags'
import { Container, Row ,Col, Card, CardBody,Button,Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    UncontrolledDropdown,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Media,
    ButtonDropdown,
    UncontrolledButtonDropdown,
    ModalFooter
  } from 'reactstrap'
    import * as moment from "moment";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { userManageCreators } from "store/userManagement/reducer"
//redux
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { setClient } from 'utils/apiUtils';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import profileImg from "assets/images/profileLogonew.jpg"
import Select from 'react-select'
import checkPermission from 'functions/checkPermission';

const UserManagement=()=> {

  const [acceptedRow,setAcceptedRow] = useState(null)
  const [selectedFilter, setFilter] = useState('PENDING')
  const [userDate, setUserDate] = useState(null)
  const [userSpecs, setUserSpecs] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [confirm, setConfirm] = useState(false)
  const [reject, setReject] = useState(false)
  const [disable, setDisable] = useState(false)
const dispatch = useDispatch()

const { SearchBar } = Search;

const {userList, token,counts,activeList} = useSelector(state=>({
  userList:state.UserManagementReducer.users,
  token: state.appReducer.token,
  counts: state.UserManagementReducer.users?.counts,
  activeList: state.UserManagementReducer.users?.activeList
}))

console.log("userList",userList)

const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

var node = useRef();

const defaultSorted = [
        {
          dataField: "id",
          order: "desc",
        },
      ];

const availableSpecs = activeList?.map((org)=>{
  return {
    label: org.organisation.name,
    options: org.specialities.map(item => {return {label: item.name +" - "+ org.organisation.orgCode, value: `${org.organisation._id},${item._id}` }})
  }
})

const isAdmin = checkPermission('admin')

const availablePermissions = isAdmin ? [
  { label: 'User Management', value: 'user-management'},
  { label: 'Email admin', value: 'email-admin'},
  { label: 'Staff Admin', value: 'staff-admin'},
  { label: 'Staff member', value: 'staff-member'},
  { label: 'Administrator', value: 'admin'}
] : [
  { label: 'Staff Admin', value: 'staff-admin'},
  { label: 'Staff member', value: 'staff-member'}
]

console.log(availableSpecs)

const rowStyle = (row, rowIndex) => {
        const style = {};
        if (row.id == acceptedRow) {
          style.backgroundColor = '#c8e6c9';
        }
        
      
        return style;
      };

let userlists = userList && userList.users;

let dataSource = generateTableData(userlists);

function generateTableData(userlists){
  let length = 0;
  if(userlists){
    length = userlists.length
  }

  let returnedValue = [];

  for(let i=0; i<length; i++){

    let gmcnum = userlists[i] && userlists[i].consultantCode;
    let name = userlists[i]?.firstName && userlists[i]?.lastName ? userlists[i].firstName + " " + userlists[i].lastName : 'Not Provided';
    let grade = userlists[i]?.grade;
    let org  = userlists[i]?.organisation?.map((item)=>item.name);
    let role = userlists[i]?.accountType == "REVIEWER" ? 'Reviewer' : userlists[i].accountType == "REFERRING" ? 'Referrer' : 'N/A';
    //let date = '23-12-2021';
    let email = userlists[i]?.email;
    let id = userlists[i]._id;

    returnedValue.push({
      Gmcno:gmcnum,
      Name:name,
      Grade:grade,
      Organisation:org,
      org1: org[0],
      Role:role,
      //RegisterDate:date,
      email:email,
      id:id,
      obj: userlists[i],
      status: userlists[i]?.status ? userlists[i].status : ""
    })


  }

  return returnedValue

}

const filters = [
  {
    label: "All",
    value: 'ALL',
    count: counts?.all
  },
  {
    label: 'Active',
    value: 'ACTIVE',
    count: counts?.active
  },
  {
    label: 'Pending review',
    value: 'PENDING',
    count: counts?.pending
  },
  {
    label: 'Disabled',
    value: 'DISABLED',
    count: counts?.disabled
  }
]

//pagination customization
const pageOptions = {
    sizePerPage: 10,
    totalSize: userList.totalPages ?? 0, // replace later with size(orders),
    custom: true,
    page: userList?.page,
    onPageChange: (data)=>{
      dispatch(userManageCreators.requestFetchUsers(data.selected + 1,10,selectedFilter,search.length > 0 ? search : null))
    }
  };

const Columns = [

    // {
    //   dataField: "Gmcno",
    //   text: "GMC/NMC number",
    //   sort: true,
    // },
    {
      text: "Email",
      dataField: "email",
      sort: true,
 
    },
    {
      dataField: "Grade",
      text: "Grade",
      sort: true,
    },
    {
      dataField: 'org1',
      text: 'Organisation',
    },
    {
      dataField: "Role",
      text: "Role",
      sort: true,
    },
    // {
    //   dataField: "RegisterDate",
    //   text: "Registration Date",
    //   sort: true,
    //   // eslint-disable-next-line react/display-name
    //   formatter: (cellContent, row) => handleValidDate(row.joiningDate),
    // },
    {
      dataField: "status",
      text: "Status",
    },
    {
      dataField: "menu",
      isDummyField: true,
      text: "Action",
      // eslint-disable-next-line react/display-name
      formatter: (cellContent, row) => (
        <UncontrolledButtonDropdown >
          <DropdownToggle onClick={(e)=>e.stopPropagation()} color="primary" className="btn-md btn-rounded"
           caret >
              Action{' '}{' '}
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            {row.status == "Pending" && (
                          <DropdownItem
                          href="#"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAcceptedRow(row.id)
                            dispatch(userManageCreators.approveUserSuccess(row.email))
                            dispatch(userManageCreators.requestFetchUsers(pageOptions.page,10,selectedFilter,search.length >0 ? search : null))
                          }}
                        >
                          <i className="fas fa-pencil-alt text-success me-1" />
                          Approve
                        </DropdownItem>
            )}
            {row.status == "Pending" && (
            <DropdownItem
            href="#"
            onClick={(e)=>{
              e.stopPropagation()
            }}
           // onClick={() => handleDeleteCustomer(customer)}
          >
            <i className="fas fa-trash-alt text-danger me-1" />
            Decline
          </DropdownItem>
            )}
            {row.status == "Active" && (
              <DropdownItem
              href="#"
              onClick={(e)=>{
                e.stopPropagation()
                try {
                  if(row.obj?.expiryDate){
                    // alert(row.obj.expiryDate)
                    setUserDate(row.obj?.expiryDate.slice(
                      0,
                      new Date().toISOString().length - 14
                  ))
                  } else {
                    setUserDate(null)
                  }
                  setSelectedUser(row.obj)
                  debugger;
                  let specs = []; 
                  row.obj.referringOrganisationSpecialities?.map((org)=>{
                    org.specialities.map(item => {specs.push( {label: item.name+' - '+org.organisationID.orgCode, value: `${org.organisationID._id},${item._id}`})})
                  })
                  setUserSpecs(specs)
                  let perms = []
                  row.obj.permissions?.map(item => {
                    let perm = availablePermissions.find(it => it.value == item)
                    perms.push(perm)
                  })
                  setUserPermissions(perms)
                } catch (error) {
                  
                }
                //suspend user
              }}
              // onClick={() => handleDeleteCustomer(customer)}
            >
              <i className="fas fa-edit text-primary me-1" />
              Review
            </DropdownItem>
            )}
            {row.status == "Disabled" && (
              <DropdownItem
                href="#"
                onClick={(e)=>{
                  e.stopPropagation()
                }}
              >
                <i className="fas fa-check text-success me-1" />
                Enable
              </DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      ),
    },
  ];


  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({})
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState('')

  const toggle = () => {
    setModal(!modal);
  };

  const handleValidCustomerSubmit = (e, values) => {
{/*  
  if (isEdit) {
      const updateCustomer = {
        id: customerList.id,
        username: values.username,
        phone: values.phone,
        email: values.email,
        address: values.address,
        rating: values.rating,
        walletBalance: values.walletBalance,
        joiningDate: values.joiningDate,
      };

      // update customer
      dispatch(onUpdateCustomer(updateCustomer));
    } else {
      const newCustomer = {
        id: Math.floor(Math.random() * (30 - 20)) + 20,
        username: values["username"],
        phone: values["phone"],
        email: values["email"],
        address: values["address"],
        rating: values["rating"],
        walletBalance: values["walletBalance"],
        joiningDate: values["joiningDate"],
      };
      // save new customer
      dispatch(onAddNewCustomer(newCustomer));
    }
  */}

    toggle();
  };

  const handleCustomerClicks = () => {
    //setCustomerList("");
    //setIsEdit(false);
    toggle();
  };

  useEffect(() => {
    setClient(token)
    dispatch(userManageCreators.requestFetchUsers(1,10,selectedFilter,search.length >0 ? search : null))
  }, [])
  
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    style: { backgroundColor: '#c8e6c9' }
  };

  const tableRowEvents = {
    onClick: (e, row, rowIndex) => {
              try {
                if(row.obj?.expiryDate){
                  // alert(row.obj.expiryDate)
                  setUserDate(row.obj?.expiryDate.slice(
                    0,
                    new Date().toISOString().length - 14
                ))
                } else {
                  setUserDate(null)
                }
                setSelectedUser(row.obj)
                debugger;
                let specs = []; 
                row.obj.referringOrganisationSpecialities?.map((org)=>{
                  org.specialities.map(item => {specs.push( {label: item.name+' - '+org.organisationID.orgCode, value: `${org.organisationID._id},${item._id}`})})
                })
                setUserSpecs(specs)
                let perms = []
                  row.obj.permissions?.map(item => {
                    let perm = availablePermissions.find(it => it.value == item)
                    perms.push(perm)
                  })
                  setUserPermissions(perms)
              } catch (error) {
                
              }
            },
  }



    return (
        <React.Fragment>
            <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
                <MetaTags>
                <title>User Management | TriVice</title>
                </MetaTags>
                <Container fluid>
                   <Breadcrumbs title ="Dashboard" breadcrumbItem="User Management"/>
                   <Row>
                       <Col xs="12">
                           <Card>
                               <CardBody>

                      <ToolkitProvider
                        keyField="id"
                        data={dataSource}
                        columns={Columns}
                        bootstrap4
                        //search
                      >
                        {toolkitProps => (
                          <React.Fragment>
                            <Row className="mb-2">
                              <Col sm="8">
                                <div style={{display:'inline-flex'}}>
                                <div className="search-box ms-2 mb-2 d-inline-block">
                                  <div className="position-relative">
                                    {/* <SearchBar {...toolkitProps.searchProps} onSearch={(string)=>{
                                      dispatch(userManageCreators.requestFetchUsers(1,10,selectedFilter,string))
                                    }} /> */}
                                    <Input type="text" value={search} onChange={(e)=>{
                                        setSearch(e.currentTarget.value)
                                        dispatch(userManageCreators.requestFetchUsers(1,10,selectedFilter,e.currentTarget.value.length > 0 ? e.currentTarget.value : null))
                                    }}
                                    />
                                    <i className="bx bx-search-alt search-icon" />
                                  </div>
                                </div>
                                <div className='ms-2 mb-2 d-inline-block pt-2'>
                                  <div className='position-relative'>
                                    {filters.map((item,key)=>{
                                      if(key == (filters.length -1)){
                                        return(
                                          <a key={key} onClick={()=>{
                                            setFilter(item.value);
                                            dispatch(userManageCreators.requestFetchUsers(1,10,item.value,search.length >0 ? search : null))
                                          }} style={selectedFilter == item.value ? {fontWeight:'bold'} : {color: 'blue'}}>{item.label} {typeof item.count == 'number' ? `(${item.count})` : ''}</a>
                                        )
                                      }
                                      return(
                                        <>
                                        <a key={key} onClick={()=>{
                                            setFilter(item.value);
                                            dispatch(userManageCreators.requestFetchUsers(1,10,item.value,search.length >0 ? search : null))
                                          }} style={selectedFilter == item.value ? {fontWeight:'bold'} : {color: 'blue'}}>{item.label} {typeof item.count == 'number' ? `(${item.count})` : ''}</a> | {" "}
                                        </>
                                      )
                                    })}
                                    {/* <a style={{color:'blue'}}>ALL</a> | <a style={{color:'blue'}}>Accepted</a> | <a style={{fontWeight:'bold'}}>Pending review</a> | <a style={{color:'blue'}}>Inactive</a> */}
                                  </div>
                                </div>
                                </div>
                              </Col>
                              <Col sm="4">
                                {/* <div className="text-sm-end">
                                  <Button
                                    type="button"
                                    color="success"
                                    className="btn-rounded  mb-2 me-2"
                                    onClick={handleCustomerClicks}
                                  >
                                    <i className="mdi mdi-plus me-1" />
                                    New User
                                  </Button>
                                </div> */}
                              </Col>
                            </Row>
                            <Row>
                              <Col xl="12">
                                <div className="table-responsive">
                                  <BootstrapTable
                                    responsive
                                    condensed
                                    bordered={false}
                                    striped={false}
                                    defaultSorted={defaultSorted}
                                    classes={"table align-middle table-nowrap mb-5 mb-1"}
                                    rowStyle={ rowStyle }
                                    headerWrapperClasses={"table-light"}
                                    keyField="id"
                                    rowEvents={tableRowEvents}
                                    {...toolkitProps.baseProps}
                                    //onTableChange={handleTableChange}
                                    ref={node}
                                  />
                                </div>
                                <div style={{float:'right'}}>
                                  <ReactPaginate
                                  previousLabel={"previous"}
                                  nextLabel={"next"}
                                  breakLabel={"..."}
                                  pageCount={pageOptions.totalSize}
                                  onPageChange={pageOptions.onPageChange}
                                  //forcePage={pageOptions.page-1}
                                  pageRangeDisplayed={3}
                                  marginPagesDisplayed={2}
                                  containerClassName={"pagination justify-content-center"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                  />
                                </div>
                                </Col>
                            </Row>
                            {/* <Row className="align-items-md-center mt-30">
                              <Col className="pagination justify-content-end mb-2 inner-custom-pagination">
                                <PaginationListStandalone
                                  {...paginationProps}
                                />
                              </Col>
                            </Row> */}
                          </React.Fragment>
                        )}
                      </ToolkitProvider>
                               </CardBody>
                           </Card>
                       </Col>
                   </Row>
                </Container> 
                </motion.div>
                <Offcanvas
                scrollable={false}
                style={{width:'40vw'}}
                placement={'end'}
                direction={'end'}
                isOpen={JSON.stringify(selectedUser) != "{}"}
                toggle={()=>{setSelectedUser({})}}
            >
              <OffcanvasHeader toggle={()=>{setSelectedUser({})}}>User Details</OffcanvasHeader>
                <OffcanvasBody>
                <UserProfile userDetails={selectedUser} accountType={selectedUser?.accountType == "REVIEWER" ? 'Reviewer' : selectedUser.accountType == "REFERRING" ? 'Referrer' : 'N/A'} orgNames={selectedUser?.organisation?.map((item)=>item.name)} />
                <div className='ms-4'>
                <label className='mt-1' htmlFor='datetimeExpiry'>Expiry date of user</label>
                <Input value={userDate} onChange={(e)=>{
                                      // alert(e.currentTarget.value)
                                      setUserDate(e.currentTarget.value)
                                      }}   type="date" id="datetimeExpiry" className="form-control" />
              {selectedUser.accountType == "REFERRING" && (
                <>
              <label className='mt-1' htmlFor='datetimeExpiry'>Specialities</label>
              <Select 
              menuPlacement="top"
              isMulti
              options={availableSpecs}
              defaultValue={userSpecs}
              onChange={setUserSpecs}
              />
              </>
              )}
              <label className='mt-1' htmlFor='datetimeExpiry'>Permissions/Roles</label>
              <Select 
              menuPlacement="top"
              isMulti
              options={availablePermissions.filter(item => selectedUser?.accountType == "REVIEWER" ? item.value != null : !(item.value == 'staff-admin' || item.value == 'staff-member' ) )}
              defaultValue={userPermissions}
              onChange={setUserPermissions}
              noOptionsMessage={()=>"No permissions or roles available to this user"}
              />

              <div className="mt-4">
                  {selectedUser.status == "Pending" && (
                  <button
                  type="button"
                  className="btn btn-danger me-2"
                  onClick={() => {
                      setReject(!reject)
                  }}
              >
                 Decline
              </button>
                  )}
                  {selectedUser.status == "Pending" && (
                    <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={() => {
                      //setAcceptedRow(selectedUser.id)
                      dispatch(userManageCreators.approveUserSuccess(selectedUser.email,userDate,userSpecs,userPermissions))
                      dispatch(userManageCreators.requestFetchUsers(pageOptions.page,10,selectedFilter,search.length >0 ? search : null))
                      setSelectedUser({})
                    }}
                >
                   Approve
                </button>
                  )}
                  {(['Disabled', 'Active'].includes(selectedUser.status) || selectedUser?.status == undefined) && (
                    <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={() =>{
                      setConfirm(true)
                    }}
                    >
                      Update
                    </button>
                  )}
                  {(['Disabled', 'Active'].includes(selectedUser.status) || selectedUser?.status == undefined) && (
                    <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() =>{
                      setDisable(true)
                    }}
                    >
                      Disable
                    </button>
                  )}
                </div>
                </div>
                </OffcanvasBody>
            </Offcanvas> 
            <Modal centered isOpen={confirm} toggle={()=>setConfirm(!confirm)}>
              <ModalHeader toggle={()=>setConfirm(!confirm)}>Confirmation</ModalHeader>
              <ModalBody>
                Are you sure you want to action this user?
              </ModalBody>
              <ModalFooter>
                <button
                  type='button'
                  className="btn btn-primary"
                  onClick={() =>{
                    dispatch(userManageCreators.approveUserSuccess(selectedUser.email, userDate,userSpecs,userPermissions))
                    debugger;
                    dispatch(userManageCreators.requestFetchUsers(pageOptions.page, 10,selectedFilter,search.length >0 ? search : null))
                    setConfirm(!confirm)
                    setSelectedUser({})
                  }}
                >
                Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>{
                    setConfirm(!confirm)
                  }}
                >
                  No
                </button>
              </ModalFooter>
            </Modal>
            <Modal centered isOpen={reject} toggle={()=>setReject(!reject)}>
              <ModalHeader toggle={()=>setReject(!reject)}>Confirmation</ModalHeader>
              <ModalBody>
                Are you sure you want to reject this user? The account will be archived.
              </ModalBody>
              <ModalFooter>
                <button
                  type='button'
                  className="btn btn-primary"
                  onClick={() =>{
                    dispatch(userManageCreators.rejectUserSuccess(selectedUser.email))
                    debugger;
                    dispatch(userManageCreators.requestFetchUsers(pageOptions.page, 10,selectedFilter,search.length >0 ? search : null))
                    setReject(!reject)
                    setSelectedUser({})
                  }}
                >
                Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>{
                    setReject(!reject)
                  }}
                >
                  No
                </button>
              </ModalFooter>
            </Modal>
            <Modal centered isOpen={disable} toggle={()=>setDisable(!disable)}>
              <ModalHeader toggle={()=>setDisable(!disable)}>Confirmation</ModalHeader>
              <ModalBody>
                Are you sure you want to disable this user?
              </ModalBody>
              <ModalFooter>
                <button
                  type='button'
                  className="btn btn-primary"
                  onClick={() =>{
                    dispatch(userManageCreators.disableUserSuccess(selectedUser.email))
                    debugger;
                    dispatch(userManageCreators.requestFetchUsers(pageOptions.page, 10,selectedFilter,search.length >0 ? search : null))
                    setDisable(!disable)
                    setSelectedUser({})
                  }}
                >
                Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>{
                    setDisable(!disable)
                  }}
                >
                  No
                </button>
              </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

const UserProfile = ({userDetails, accountType,orgNames}) =>{
  return (
    <div tabId="1">
<Media>

<div className="ms-3">
<img    
  src={profileImg}
  alt=""
  className="avatar-md rounded-circle img-thumbnail"
/>
</div>
<Media body className="align-self-center">
<div className="text-muted ms-4 mt-0">
  <h4>{userDetails && userDetails.firstName} {userDetails && userDetails.lastName}</h4> 
</div>

</Media>

</Media>
<Media>

<Media body className="align-self-center">
<div className="ms-4 mt-4">
  <dl className="row mb-0">
   
    <dt className="col-sm-3">Email</dt>
    <dd className="col-sm-9">
     {userDetails && userDetails.email?userDetails.email:"Not Available"}</dd>

    <dt className="col-sm-3">Phone Number</dt>
    <dd className="col-sm-9">{userDetails && userDetails.phoneNumber?userDetails.phoneNumber:"Not Available"}</dd>

    <dt className="col-sm-3">Account Type</dt>
    <dd className="col-sm-9">{accountType?accountType:"Not Available"}</dd>
    
    <dt className="col-sm-3">Organisation</dt>
    <dd className="col-sm-9">{orgNames && orgNames.map((item,key)=>{

      return (<div key={key}>
        <span>{item}{key==orgNames.length-1?"":","}</span>
      
        </div>) 
    })}</dd>

    <dt className="col-sm-3">Grade</dt>
    <dd className="col-sm-9">{userDetails && userDetails.grade?userDetails.grade:"Not Available"}</dd>

   
    <dt className="col-sm-3">Department</dt>
    <dd className="col-sm-9">{userDetails && userDetails.speciality?userDetails.speciality:"Not Available"}</dd>
    
    
    <dt className="col-sm-3">GMC/NMC/GOC No</dt>
    <dd className="col-sm-9">{userDetails && userDetails.consultantCode?userDetails.consultantCode:"Not Available"}</dd>
</dl>
  
</div>
</Media>
</Media>
   
 
  </div>
  )
}

UserProfile.propTypes = {
  userDetails: PropTypes.object,
  accountType: PropTypes.string,
  orgNames: PropTypes.array
}

export default UserManagement
