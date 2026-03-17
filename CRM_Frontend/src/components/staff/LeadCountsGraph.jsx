import React , { useEffect , useRef } from 'react'

function LeadCountsGraph({ counts }) {

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(()=>{

    if(!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')

    if(chartInstance.current){
      chartInstance.current.destroy()
    }

    const data = [
      counts.open_ld || 0,
      counts.in_prog || 0,
      counts.won_ld || 0,
      counts.lost_ld || 0
    ]

    const totalLeads = data.reduce((a,b)=>a+b,0)

    chartInstance.current = new Chart(ctx, {

      type : 'pie',

      data : {
        labels : ['Open','In Progress','Won','Lost'],

        datasets : [
          {
            data : data,

            backgroundColor : [
              'rgb(86, 61, 246)',
              'rgb(209, 215, 27)',
              'rgb(10, 152, 110)',
              'rgb(249, 65, 65)'
            ],

            borderColor : '#fff',
            borderWidth : 2
          }
        ]
      },

      options : {

        responsive : true,

        maintainAspectRatio : false,

        plugins : {

          legend : {
            position : 'bottom'
          },

          title : {
            display : true,
            text : `Leads Distribution (Total: ${totalLeads})`,
            font : {
              size : 18
            }
          },

          tooltip : {
            callbacks : {
              label : function(context){
                const value = context.raw
                const percentage = totalLeads ? ((value/totalLeads)*100).toFixed(1) : 0
                return `${context.label}: ${value} (${percentage}%)`
              }
            }
          }

        }

      }

    })

  },[counts])

  return (

    <div style={{ maxWidth:"300px" , maxHeight:"300px" }}>

      <canvas ref={chartRef}></canvas>

    </div>

  )
}

export default LeadCountsGraph