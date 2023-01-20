
import dynamic from 'next/dynamic';
import { useState } from 'react';
import getGitLog from '../jsscripts/gitlogtext'
import { useRouter } from 'next/router';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function File_treemap(props:any) {
   // 
    const red_threshold: number = 30
    const highest_red: number = 100
    const router = useRouter()
    const chart_title = "Items being compared"
    type dataItem = {x:String, y:number}  //x and y are required for apexcharts data item
   // const [chart_data, set_chart_data] = useState<Array<dataItem>>([])
    let chart_data: Array<dataItem> = []
    //this refreshes tree on new data
    let [dynamic_series, setdynamic_series] = useState([{name: chart_title, data: chart_data}])
    console.log("prefetch")
    //this stops us from going infinite on re renders
    let [fetched_data, setfetched_data] = useState('')
    if(props.remote !== '' && props.remote && fetched_data != props.remote){
      fetch(props.remote, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((json)=> {
        console.log("midfetch")
        let l = json
        l.forEach((xy:{x:String, y:number}) => {
            chart_data.push(xy)
        });
        //sort with biggest first 
        chart_data.sort((a , b)=>b.y-a.y)
        setdynamic_series(
          [{
            name: chart_title,
            data: chart_data  
          }]
        )
        setfetched_data(props.remote)
        console.log("donefetch")
      })
    }
    console.log("postfetch")
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
                color: '#000000'
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