import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window')
const API_KEY = "c01224a232b2fd5b9d884e97f861c203";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false)
    }
    
    const {coords: {latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy: 5})
    const location = await Location.reverseGeocodeAsync({latitude,longitude}, {useGoogleMaps:false})
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily)
  }


  useEffect(() => {
    getWeather();
  },[])


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather}
      >
      {days.length === 0 ? (
        //커스텀 스타일로 스타일을 불러오면서 해당 태그에서 직접 스타일을 부여할수 있다.
        <View style={{...styles.day, alignItems:"center"}}>
          <ActivityIndicator color="white" style={{marginTop: 10}} size="large"/>
        </View>
      ) : (
        days.map((day, index)=> 
          <View key={index} style={styles.day}>
            <View style={{
              flexDirection:"row", 
              alignItems:"center",
              width: "100%",
            }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        )
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:"tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName:{
    fontSize: 38,
    fontWeight: "500",
    color: "white"
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: "600",
    color:"white",
  },
  description: {
    marginTop: -30,
    fontSize: 60,
    color:"white",
  },
  tinyText: {
    fontSize: 20,
    color:"white"
  }
})

