const GOHOMESAFEURL =  process.env.EXPO_PUBLIC_URL;
const WEATHERAPIKey = process.env.EXPO_PUBLIC_WEATHER_API;
const ORSAPIKey = process.env.EXPO_PUBLIC_ORS_API;

export const safestRoute = async (startLat, startLon, endLat, endLon) => {
    try {
      console.log(`Requesting: ${GOHOMESAFEURL}/route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
      const response = await fetch(`${GOHOMESAFEURL}/route?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
      
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
    console.log(`Requesting: ${GOHOMESAFEURL}/route/fastest?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
    const response = await fetch(`${GOHOMESAFEURL}/route/fastest?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
    
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
    console.log(`Requesting: ${GOHOMESAFEURL}/cctv/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
    const response = await fetch(`${GOHOMESAFEURL}/cctv/area?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
    
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

export const weatherData = async () => {
  try {
    console.log((`Requesting: https://api.openweathermap.org/data/2.5/weather?q=Daejeon&units=metric&appid=...`));
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Daejeon&units=metric&appid=${WEATHERAPIKey}`);
    if (response.ok) {
      const data = await response.json();
      const main = data.weather[0].main;
      const desc = data.weather[0].description; 
      const icon = data.weather[0].icon;
      const sunrise = data.sys.sunrise;
      const sunset = data.sys.sunset;
      const name = data.name;
      const id = data.weather[0].id;
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

export const geocode = async (address) => {
  try {
    console.log((`Requesting: https://api.openrouteservice.org/geocode/search?api_key=...&text=${address}&boundary.circle.lon=127.393975&boundary.circle.lat=36.339886&boundary.circle.radius=9.8&boundary.country=KR`));
    const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORSAPIKey}&text=${address}&boundary.circle.lon=127.393975&boundary.circle.lat=36.339886&boundary.circle.radius=9.8&boundary.country=KR`);
    if (response.ok) {
      const data = await response.json();
      coordinates = data.features[0].geometry.coordinates
      return {
        "latitude": coordinates[1],
        "longitude": coordinates[0],
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