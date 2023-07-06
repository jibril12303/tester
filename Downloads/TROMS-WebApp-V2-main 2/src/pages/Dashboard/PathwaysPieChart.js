import React, { Component } from "react"
import ReactApexChart from "react-apexcharts"
import "./dashboard.scss"

const PathwaysPieChart = (caseAmounts)=> {

	const values =caseAmounts.caseAmounts.caseAmounts;
	let tempObj = values && values.PATHWAYS_WISE;
	let pathWayFilteredData = [];
  let columnname = [];
	for (var key in tempObj) {
		var value = tempObj[key];
		pathWayFilteredData.push(value);
    columnname.push(key);
	}
	const series = pathWayFilteredData;
		const options =  {
				labels:columnname,
				colors: [
					"#556ee6",
					"#AFC234",
					"#50a5f1",
					"#f1b44c",
					"#f46a6a",
					"#343a40",
					"#74788d",
					"#8C7384",
					"#8092EC"],
				legend: {
					show: true,
					position: "bottom",
					horizontalAlign: "left",
					verticalAlign: "left",
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

export default PathwaysPieChart