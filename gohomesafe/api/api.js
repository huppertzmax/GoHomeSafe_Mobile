const url =  process.env.EXPO_PUBLIC_URL;
const APIKey = process.env.EXPO_PUBLIC_WEATHER_API;

export const safestRoute = async (startLat, startLon, endLat, endLon) => {
    try {
      console.log(`Requesting: ${url}/route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
      const response = await fetch(`${url}/route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
      
      if (response.ok) {
        const data = await response.json();
        const coordinates = data.coordinates.map(coordinate => ({
          latitude: coordinate[1],
          longitude: coordinate[0],
        }));
        const duration = data.duration
        const lenght = data.length
        return {"coordinates": coordinates, "duration": duration, "lenght": lenght}
      } 
      else {
        console.error('Failed to fetch data');
      }
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
};

export const fastestRoute = async (startLat, startLon, endLat, endLon) => {
  try {
    console.log(`Requesting: ${url}/route/fastest?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
    const response = await fetch(`${url}/route/fastest?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
    
    if (response.ok) {
      const data = await response.json();
      const coordinates = data.coordinates.map(coordinate => ({
        latitude: coordinate[1],
        longitude: coordinate[0],
      }));
      const duration = data.duration
      const lenght = data.length
      return {"coordinates": coordinates, "duration": duration, "lenght": lenght}
    } 
    else {
      console.error('Failed to fetch data');
    }
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const cctvLocations = async (startLat, startLon, endLat, endLon) => {
  try {
    console.log(`Requesting: ${url}/cctv/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
    const response = await fetch(`${url}/cctv/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
    
    if (response.ok) {
      const data = await response.json();
      const cctvs = data
      return cctvs
    } 
    else {
      console.error('Failed to fetch data');
    }
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const sensorLocations = async (startLat, startLon, endLat, endLon) => {
  try {
    console.log(`Requesting: ${url}/sensor/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
    const response = await fetch(`${url}/sensor/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
    
    if (response.ok) {
      const data = await response.json();
      const sensorGoodLocations = data.filter(sensor => sensor[2] == 1);
      const sensorBadLocations = data.filter(sensor => sensor[2] == 0);
      return {"sensorGoodLocations": sensorGoodLocations, "sensorBadLocations": sensorBadLocations}
    } 
    else {
      console.error('Failed to fetch data');
    }
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const weatherData = async () => {
  try {
    console.log((`Requesting: https://api.openweathermap.org/data/2.5/weather?q=Daejeon&units=metric&appid=...`));
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Daejeon&units=metric&appid=${APIKey}`);
    if (response.ok) {
      const data = await response.json();
      const main = data.weather[0].main;
      const desc = data.weather[0].description; 
      const icon = data.weather[0].icon;
      const sunrise = data.sys.sunrise;
      const sunset = data.sys.sunset;
      const name = data.name;
      const id = data.weather[0].id;
      console.log(data)
      return {
        "main": main,
        "description": desc,
        "icon": icon,
        "sunrise": sunrise,
        "sunset": sunset,
        "name": name,
        "id": id,
      }
    } 
    else {
      console.error('Failed to fetch data');
    }
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }

}