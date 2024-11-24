export const planetChartData = {
    type: "line", 
    data: {
      labels: [
        "January",
        "Feb",
        "March",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "My profits per Month",
          data: [122, 125, 25, 92, 25, 27, 62, 92, 52, 102, 212, 23],
          backgroundColor: [
 
            "#D0F679", 
          ],
          borderColor: [
            
            "#EF1527", 
          ],
          borderWidth: 2,
        },
      ]},
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