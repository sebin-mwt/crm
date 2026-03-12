import React , { useEffect , useRef } from "react"

function RevenueChart({ leads }) {

  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(()=>{

    if(!leads || !chartRef.current) return

    const wonAmount = leads
      .filter(ld => ld.status === "Won" || ld.stage === "Post-Sales")
      .reduce((sum , ld)=> sum + (ld.value || 0) , 0)

    const lostAmount = leads
      .filter(ld => ld.status === "Lost")
      .reduce((sum , ld)=> sum + (ld.value || 0) , 0)

    const progressAmount = leads
      .filter(ld =>
        ld.status !== "Lost" &&
        ld.status !== "Won" &&
        ld.stage !== "Post-Sales" &&
        ld.stage !== "New"
      )
      .reduce((sum , ld)=> sum + (ld.value || 0) , 0)

    const ctx = chartRef.current.getContext("2d")

    if(chartInstance.current){
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(ctx , {

      type : "doughnut",

      data : {
        labels : ["Won Amount" , "In Progress Amount" , "Lost Amount"],

        datasets : [
          {
            data : [wonAmount , progressAmount , lostAmount],

            backgroundColor : [
              "#28a745",
              "#ffc107",
              "#dc3545"
            ],

            borderWidth : 1
          }
        ]
      },

      options : {

        responsive : true,

        maintainAspectRatio : false,

        plugins : {

          legend : {
            position : "bottom"
          },

          title : {
            display : true,
            text : "Revenue Distribution",
            font : {
              size : 18
            }
          }

        }

      }

    })

  },[leads])

  return (

    <div style={{ width:"300px" , height:"300px" }}>

      <canvas ref={chartRef}></canvas>

    </div>

  )
}

export default RevenueChart