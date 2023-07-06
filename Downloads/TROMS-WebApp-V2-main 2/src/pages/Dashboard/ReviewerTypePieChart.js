import React, { Component } from "react"
import ReactApexChart from "react-apexcharts"
import "./dashboard.scss"

const ReviewerTypePieChart = (typewise)=>{
	const values = typewise.typewise;
	let tempObj = values;
	let pathWayFilteredData = [];
  let columnname = [];

	for (var key in tempObj) {
		var value = tempObj[key];
		pathWayFilteredData.push(value);
		columnname.push(key);
	}
		
const options= {
				labels:columnname,
				colors: ["#58BC89", "#F5C665", "#FF9758", "#F80E0E"],
				legend: {
					show: true,
					position: "bottom",
					horizontalAlign: "center",
					verticalAlign: "middle",
					floating: false,
					fontSize: "14px",
					offsetX: 0,
					offsetY: -10,
				},
				responsive: [
					{
						breakpoint: 600,
							options: {
							chart: {
								height: 240,
							},
							legend: {
								show: false,
							},
						},
					},
				],
			};
const series= pathWayFilteredData ;
		
	
    return (
      <React.Fragment>
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height="380"
        />
      </React.Fragment>
    )
  }


export default ReviewerTypePieChart
