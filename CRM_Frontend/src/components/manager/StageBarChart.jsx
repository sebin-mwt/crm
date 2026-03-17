import React, { useEffect, useRef } from "react";

function StageBarChart({ leads }) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    if (!leads) return;

    const stages = ["Pre-Sales", "Opportunity", "Post-Sales", "Closing"];

    const values = stages.map(stage =>

      leads.filter(lead => lead.stage === stage).length

    );

    const labels = stages;

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
              "#06b6d4",
              "#10b981",
              "#f59e0b"
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

    <div className="p-3 mb-2" style={{ maxHeight: "300px", width: "100%" }}>
      <h6 className="mb-3">Lead Status Overview</h6>
      <canvas ref={chartRef} style={{ height: "100%", width: "100%" }}></canvas>
    </div>

  );
}

export default StageBarChart;