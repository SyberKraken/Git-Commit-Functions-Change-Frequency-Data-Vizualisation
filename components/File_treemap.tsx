
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import getGitLog from '../jsscripts/gitlogtext'
import { useRouter } from 'next/router';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function File_treemap(props:any) {
    //useEffect(()=>{console.log(props)},[props])
    const red_threshold: number = 20
    const highest_red: number = 100
    const router = useRouter()
    const chart_title = "Items being compared"
    type dataItem = {x:String, y:number}  //x and y are required for apexcharts data item
   // const [chart_data, set_chart_data] = useState<Array<dataItem>>([])
    let chart_data: Array<dataItem> = []
    //this refreshes tree on new data
    let [dynamic_series, setdynamic_series] = useState([{name: chart_title, data: chart_data}])

    let apiUrl = props.remote
    let checkboxMap:Map<string,boolean> = props.checkboxMap

    checkboxMap.forEach((value, key) =>{
      apiUrl = apiUrl + "&" + key + "=" + value
    })
  
    if(props.checkboxMap.get("BugFixList") === true){
      apiUrl = apiUrl + "&bugList=" + props.bugList
    }
    //console.log(apiUrl)
    //console.log(props.remote)
    //console.log(props.bugList)
    //console.log("prefetch")
    //this stops us from going infinite on re renders
    let [fetched_data, setfetched_data] = useState('')
    if(props.remote !== '' && props.remote && fetched_data != props.remote){
      //console.log(props.remote)
      fetch(apiUrl, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((json)=> {
        let mapFromJson = new Map<String, number>(Object.entries(json))
        //console.log("midfetch")
        //console.log(mapFromJson)
       
        mapFromJson.forEach((value,key)=>{
          chart_data.push(({x:key,y:Math.round(value*100)/100}))
        })
     /*    let l = json
        l.forEach((xy:{x:String, y:number}) => {
            chart_data.push(xy)
        });
      */
       /*  let l : dataItem[]= [{x:"TITTLE", y:200}] 
        chart_data = l.concat(chart_data) */

        //sort with biggest first 
        //chart_data.sort((a , b)=>b.y-a.y)
        
        setdynamic_series(
          [{
            name: chart_title,
            data: chart_data  
          },//MULTICHART here
         /*  {
            name: chart_title,
            data: chart_data  
          } */]
        )
        setfetched_data(props.remote)
        //console.log("donefetch") 

      })
    }

    //console.log("postfetch")
    const options = {
      chart: {
        id: "treemap",
        /* toolbar: {
            show: false
          } */
      },
      title: {
        text: 'Colors are files, squares are functions',
        align: 'center'
      },
      xaxis: {
        categories: [1, 2, 3, 4] //will be displayed on the x-asis
      },dataLabels: {
        enabled: true,
        dropShadow: {
            enabled: true,
            left: 2,
            top: 2,
            opacity: 0.5
        }
      } ,
      plotOptions: {
        treemap: {
          useFillColorAsStroke: true,

          /*,
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
          } */
        }
      } 
    };
    
    return (
      <>     
   
      <div className="treewrap">
        {/* options is red in vscode but still works, typescript error somewhere */}
        <Chart options={options} type="treemap" series={dynamic_series} width="100%" />
      </div>
 
      </>
    );
  }