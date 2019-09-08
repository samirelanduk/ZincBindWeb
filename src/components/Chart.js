import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

class Chart extends Component {
    
    render() { 
        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    chart: {
                        plotBorderWidth: 1,
                        marginLeft: 50
                    },
                    title: {
                        text: this.props.title
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: this.props.title,
                        data: this.props.data[1],
                        type: "column",
                        color: this.props.color
                    }],
                    xAxis: {
                        categories: this.props.data[0],
                        lineWidth: 0,
                        tickWidth: 0,
                        labels: {
                            autoRotation: false,
                            style: {
                                fontSize: "8px"
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            enabled: false
                        },
                        lineWidth: 0
                    },
                    legend: {
                        enabled: false
                    }
                }}
            />
        );
    }
}
 
export default Chart;