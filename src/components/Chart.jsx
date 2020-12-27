import React from "react";
import { useQuery } from "react-apollo";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { ClipLoader } from "react-spinners";

const Chart = props => {

  const { query, title, color } = props;

  let chartOptions = {
    chart: {
      plotBorderWidth: 1,
      marginLeft: 50
    },
    title: {
      text: title
    },
    credits: {
      enabled: false
    },
    series: [{
        name: title,
        data: [],
        type: "column",
        color: color
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

  const { data, loading } = useQuery(query);

  if (loading) {
      return <div style={{
        height: "400px", display: "flex", alignItems: "center", justifyContent: "center",
      }}><ClipLoader size="100px" color="#482c54"/></div>
  }

  let points = data.stats[Object.keys(data.stats)[0]];
  let labels = []; let counts = [];
  for (let point of points) {
    labels.push(point.label);
    counts.push(point.count);
  }
  let options = {...chartOptions};
  options.series[0].data = counts;
  options.xAxis.categories = labels;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
  />
  );
}
 
export default Chart;