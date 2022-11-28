
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function X() {
    const chart_title = "Items being compared"
    type dataItem = {x:String, y:number}
    let chart_data: Array<dataItem> = []

    chart_data.push( { x:"WAAAAAAAAAAAAAA", y:12})
    chart_data.push(  { x:"ooooooooooow", y:210})


    const series = [
      {
        name: "Temperature in Fahrenheit", //will be displayed on the y-axis
        data: [{
            x: "New Delhi",
            y: 218,
          },
          {
            x: "Kolkata",
            y: 149,
          },
          {
            x: "Mumbai",
            y: 184,
          },
          {
            x: "Ahmedabad",
            y: 55,
          },
          {
            x: "Bangaluru",
            y: 84,
          },
          {
            x: "Pune",
            y: 31,
          },
          {
            x: "Chennai",
            y: 70,
          }]
      }
    ];

    let dynamic_series = 
      [{
        name: chart_title,
        data: chart_data     
      }]

    const options = {
      chart: {
        id: "simple-bar",
        toolbar: {
            show: false
          }
      },
      xaxis: {
        categories: [1, 2, 3, 4] //will be displayed on the x-asis
      }
    };

    console.log(series)
    console.log(dynamic_series)
    
    return (
      <div className="treewrap">
        <Chart options={options} type="treemap" series={dynamic_series} width="100%" />
      </div>
    );
  }