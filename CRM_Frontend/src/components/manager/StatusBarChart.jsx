import React, { useEffect, useRef } from "react";

function StatusBarChart({ leads }) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    if (!leads) return;

    // Count leads by status
    const statusCounts = leads.reduce((acc, lead) => {

      const status = lead.status || "Unknown";

      acc[status] = (acc[status] || 0) + 1;

      return acc;

    }, {});

    const labels = Object.keys(statusCounts);
    const values = Object.values(statusCounts);

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart (important for React)
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {

      type: "bar",

      data: {
        labels: labels,
        datasets: [
          {
            label: "Lead Count",
            data: values,
            backgroundColor: [
              "#4f46e5",
              "#10b981",
              "#ef4444",
              "#f59e0b",
              "#06b6d4",
              "#8b5cf6"
            ],
            borderRadius: 5
          }
        ]
      },

      options: {

        responsive: true,

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
            stepSize: 1,
            precision: 0
          }
          }
        }

      }

    });

  }, [leads]);

  return (

    <div className=" p-3" style={{height:"220px"}}>

      <h6 className="mb-3">Lead Status Overview</h6>

      <canvas ref={chartRef}></canvas>

    </div>

  );
}

export default StatusBarChart;