export const planetChartData = {
    type: "pie", 
    data: {
      labels: [
        "January",
        "Feb",
        "March",
      ],
      datasets: [
        {
          label: "xxx-xxx",
          data: [122, 125, 125],
          backgroundColor: [
            "#BC9B2A", 
            "#BC9B2A", 
            "#BC9B2A",   
          ],
          borderColor: [
            "white", 
            "white", 
            "white", 
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }
        ]
      }
    }
  };
  
  export default planetChartData;