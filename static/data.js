[
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