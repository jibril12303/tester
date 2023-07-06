import React from "react"
import PropTypes from 'prop-types';
import ReactApexChart from "react-apexcharts"
import moment from "moment";
const StackedColumnChart = ({ periodData }) => {
  //console.log("periodData",periodData);
  const values = periodData;

  let tempObj = values && values.DATE_WISE;
//  console.log("tempObj",tempObj)
  var columnName = [];
  var seriesData = [{
    name: "Local",
    data: values &&
    values.DATE_WISE &&
    values.DATE_WISE.map((e) => e.Local),
  },
  {
    name: "Routine",
    data:
    values &&
    values.DATE_WISE &&
    values.DATE_WISE.map((e) => e.Routine),
    // data: [5, 3, 4, 7, 2],
  },
  {
    name: "Urgent",
    data:
    values &&
    values.DATE_WISE &&
    values.DATE_WISE.map((e) => e.Urgent),
  },
  {
    name: "Immediate",
    data:
    values &&
    values.DATE_WISE &&
    values.DATE_WISE.map((e) => e.Immediate),
  },
];
tempObj && tempObj.map((key)=>{
    //console.log(key.date)
    columnName.push(moment(key.date).format("DD-MM-YYYY"))
  })
  //console.log("columnName",columnName)
	//let pathWayFilteredData = [];
 // let referralData = [];
//	for (var key in tempObj) {
//		var value = tempObj.;
//		referralData.push({
 //     name: key,
//			y: value,
  //  })
   // columnname.push(tempObj.date);
//	}


  const options = {
    chart: {
      stacked: !0,
      toolbar: {
        show: 1
      },
      zoom: {
        enabled: !0
      }
    },
    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "15%"
        // endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: !1
    },
    xaxis: {
      show: true,
      categories: columnName,
      labels: {
        show: true
      }
    },
    colors: ["#58BC89", "#F5C665", "#FF9758", "#F80E0E"],
    legend: {
      position: "bottom"
    },
    fill: {
      opacity: 1
    }
  }
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={seriesData}
        type="bar"
        height="359"
        className="apex-charts"
      />
    </React.Fragment>
  );
}

StackedColumnChart.propTypes = {
  periodData: PropTypes.any
}
export default StackedColumnChart;
