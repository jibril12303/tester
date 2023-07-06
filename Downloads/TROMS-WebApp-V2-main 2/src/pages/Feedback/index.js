import React, { useEffect, useState } from "react"
import { withRouter, Link } from "react-router-dom"
import { isEmpty } from "lodash"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

import { motion } from "framer-motion"


import { Button, Card, CardBody, Col, Row, Badge,Container } from "reactstrap"
import { MetaTags } from 'react-meta-tags'
//redux
import { useSelector, useDispatch } from "react-redux"
import Breadcrumbs from "components/Common/Breadcrumb";

const Feedback = props => {

  const dispatch = useDispatch()

  const selectRow = {
    mode: "checkbox",
  }

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [isEdit, setIsEdit] = useState(false)


  const { SearchBar } = Search

  // const toggleModal = () => {
  //   setModal1(!modal1)
  // }
  const toggleViewModal = () => setModal1(!modal1)

  const Columns = [
    {
      dataField: "orderId",
      text: "caseID",
      sort: true,
      // eslint-disable-next-line react/display-name
      formatter: (cellContent, row) => (
        <Link to="#" className="text-body fw-bold">
          {row.orderId}
        </Link>
      ),
    },
    {
      dataField: "billingName",
      text: "Name",
      sort: true,
    },
    {
      dataField: "orderdate",
      text: "Date",
      sort: true,
    },
    {
      dataField: "rating",
      text: "Rating",
      sort: true,
      formatter:(cellContent,row)=>(
        <Badge color="success" className="bg-success font-size-12">
            <i className="mdi mdi-star me-1" />
            {row.rating}
        </Badge>
      ),
    },

    {
      dataField: "view",
      isDummyField: true,
      text: "View Details",
      sort: true,
      // eslint-disable-next-line react/display-name
      formatter: () => (
        <Button
          type="button"
          color="primary"
          className="btn-sm btn-rounded"
          onClick={toggleViewModal}
        >
          View Feedback
        </Button>
      ),
    },
  ]

  const orders = [
    {
      id: '1',
      orderId: '#SK2540',
      billingName: 'Neal Matthews',
      orderdate: '2019-10-08',
      rating: '4.2',
      total: '$400',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-mastercard',
      paymentMethod: 'Mastercard'
    },
    {
      id: '2',
      orderId: '#SK2541',
      billingName: 'Jamal Burnett',
      orderdate: '2019-10-07',
      rating: '3.2',
      total: '$380',
      badgeclass: 'danger',
      paymentStatus: 'Chargeback',
      methodIcon: 'fa-cc-visa',
      paymentMethod: 'Visa'
    },
    {
      id: '3',
      orderId: '#SK2542',
      billingName: 'Juan Mitchell',
      orderdate: '2019-10-06',
      rating: '3.8',
      total: '$384',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-paypal',
      paymentMethod: 'Paypal'
    },
    {
      id: '4',
      orderId: '#SK2543',
      billingName: 'Barry Dick',
      orderdate: '2019-10-05',
      rating: '5',
      total: '$412',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-mastercard',
      paymentMethod: 'Mastercard'
    },
    {
      id: '5',
      orderId: '#SK2544',
      billingName: 'Ronald Taylor',
      orderdate: '2019-10-04',
      rating: '4.5',
      total: '$404',
      badgeclass: 'warning',
      paymentStatus: 'Refund',
      methodIcon: 'fa-cc-visa',
      paymentMethod: 'Visa'
    },
    {
      id: '6',
      orderId: '#SK2545',
      billingName: 'Jacob Hunter',
      orderdate: '2019-10-04',
      rating: '4.1',
      total: '$392',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-paypal',
      paymentMethod: 'Paypal'
    },
    {
      id: '7',
      orderId: '#SK2546',
      billingName: 'William Cruz',
      orderdate: '2019-10-03',
      rating: '4.7',
      total: '$374',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fas fa-money-bill-alt',
      paymentMethod: 'COD'
    },
    {
      id: '8',
      orderId: '#SK2547',
      billingName: 'Dustin Moser',
      orderdate: '2019-10-02',
      rating: '3.9',
      total: '$350',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-paypal',
      paymentMethod: 'Mastercard'
    },
    {
      id: '9',
      orderId: '#SK2548',
      billingName: 'Clark Benson',
      orderdate: '2019-10-01',
      rating: '4.4',
      total: '$345',
      badgeclass: 'warning',
      paymentStatus: 'Refund',
      methodIcon: 'fa-cc-paypal',
      paymentMethod: 'Visa'
    },
    {
      id: '10',
      orderId: '#SK2540',
      billingName: 'Neal Matthews',
      orderdate: '2019-10-08',
      rating: '4.8',
      total: '$400',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-mastercard',
      paymentMethod: 'Mastercard'
    },
    {
      id: '11',
      orderId: '#SK2541',
      billingName: 'Jamal Burnett',
      orderdate: '2019-10-07',
      rating: '5',
      total: '$380',
      badgeclass: 'danger',
      paymentStatus: 'Chargeback',
      methodIcon: 'fa-cc-visa',
      paymentMethod: 'Visa'
    },
    {
      id: '12',
      orderId: '#SK2542',
      billingName: 'Juan Mitchell',
      orderdate: '2019-10-06',
      rating: '3.5',
      total: '$384',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-paypal',
      paymentMethod: 'Paypal'
    },
    {
      id: '13',
      orderId: '#SK2543',
      billingName: 'Barry Dick',
      orderdate: '2019-10-05',
      rating: '4.6',
      total: '$412',
      badgeclass: 'success',
      paymentStatus: 'Paid',
      methodIcon: 'fa-cc-mastercard',
      paymentMethod: 'Mastercard'
    }
  ]

    //pagination customization
    const pageOptions = {
        sizePerPage: 6,
        totalSize: orders.length, // replace later with size(orders),
        custom: true,
        prePageText: 'Previous',
        nextPageText:'next',
        
      }

  const toLowerCase1 = str => {
    return str.toLowerCase()
  }

  const defaultSorted = [
    {
      dataField: "orderId",
      order: "desc",
    },
  ]


  return (
    <React.Fragment>
        <motion.div className="page-content" exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
        <MetaTags>
                <title>Feedback | TriVice</title>
        </MetaTags>
        <Container fluid>
        <Breadcrumbs title ="Dashboard" breadcrumbItem="Feedback"/>
        <Row>
            <Col xs="12">
            <Card>
            <CardBody>
            <PaginationProvider
           pagination={paginationFactory(pageOptions)}
            keyField="id"
            columns={Columns}
            data={orders}
          >
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={orders}
                columns={Columns}
                bootstrap4
                search
              >
                {toolkitProps => (
                  <React.Fragment>
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField="id"
                            responsive
                            bordered={false}
                            striped={false}
                            defaultSorted={defaultSorted}
                            selectRow={selectRow}
                            
                            classes={
                              "table align-middle table-nowrap table-check"
                            }
                            headerWrapperClasses={"table-light"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="pagination justify-content-end">
                      <PaginationListStandalone {...paginationProps} />
                    </div>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
     
            </CardBody>
            </Card>
            </Col>
        </Row>
        </Container>
        </motion.div>

    </React.Fragment>
  )
}


export default Feedback
