const whiteList = [
    "https://www.yoursite.com",
    "http://localhost:5500",
    "http://localhost:3500",
    "http://localhost:3000",
    "http://localhost:3001"
  ];
  
  const corsOption = {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed By CORS"));
      }
    },
    optionalSuccessStatus: 200,
  };
  
  export default corsOption;
  