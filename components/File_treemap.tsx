
import dynamic from 'next/dynamic';
import { useState } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function File_treemap() {

    const red_threshold: number = 10
    const highest_red: number = 100

    const chart_title = "Items being compared"
    type dataItem = {x:String, y:number}  //x and y are required for apexcharts data item
   // const [chart_data, set_chart_data] = useState<Array<dataItem>>([])
    let chart_data: Array<dataItem> = []
    fetch('http://localhost:3000/api/data', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
     })
    .then((response) => response.json())
    .then((json)=> {
       let l = json
       l.forEach((xy:{x:String, y:number}) => {
          chart_data.push(xy)
       });
       chart_data.sort((a , b)=>b.y-a.y)
    })
    
    //sort with biggest first
    
    let dynamic_series = 
      [{
        name: chart_title,
        data: chart_data     
      }]

    const options = {
      chart: {
        id: "treemap",
        toolbar: {
            show: false
          }
      },
      xaxis: {
        categories: [1, 2, 3, 4] //will be displayed on the x-asis
      },
      plotOptions: {
        treemap: {
          colorScale: {
            ranges: [
              {
                from: red_threshold + 0.1,
                to: highest_red,
                color: '#ff0000'
              },
               {
                from: 0,
                to: red_threshold,
                color: '#00ff00'
              } 
            ]
          }
        }
      }
    };
    
    return (
      <div className="treewrap">
        <Chart options={options} type="treemap" series={dynamic_series} width="100%" />
      </div>
    );
  }