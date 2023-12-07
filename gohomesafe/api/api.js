const url =  process.env.EXPO_PUBLIC_URL;

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