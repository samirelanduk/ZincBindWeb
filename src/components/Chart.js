import React, { Component } from "react";
import { Query } from "react-apollo";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

class Chart extends Component {
    
    render() {
        let chartOptions = {
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
                data: [],
                type: "column",
                color: this.props.color
            }],
            xAxis: {
                categories: [],
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
        }
        return (
            <Query query={this.props.query} >
                {
                    ({data, loading}) => {
                        if (loading) {
                            return <div style={{height: "400px"}} />
                        } else {
                            let points = data.stats[Object.keys(data.stats)[0]];
                            let labels = []; let counts = [];
                            for (let point of points) {
                                labels.push(point.label);
                                counts.push(point.count);
                            }
                            let options = {...chartOptions};
                            options.series[0].data = counts;
                            options.xAxis.categories = labels;
                            return <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                            />
                        }
                    }
                } 
            </Query>
        );
    }
}
 
export default Chart;