import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'; 

const STRAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text,setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  },[])

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload)
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STRAGE_KEY ,JSON.stringify(toSave))
  }
  const loadToDos = async() => {
    const result = await AsyncStorage.getItem(STRAGE_KEY)
    setToDos(JSON.parse(result))
  }


  const addToDo = async() => {
    if(text === "") {
      return
    }
    const newToDos = {
      ...toDos, 
      [Date.now()] : {text, working},
    }
    await saveToDos(newToDos);
    setToDos(newToDos);
    setText("");
  }

  const deleteToDo = async(key) => {
    Alert.alert("Delete to do", "Are you sure?", [
      {text:"Cancel"},
      {
        text:"Sure", 
        onPress : async () => {
        const newToDos = {...toDos}
        delete newToDos[key] //해당 키 제거 필터 기능
        setToDos(newToDos);
        await saveToDos(newToDos);        
      }},
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType='done'
        value={text}
        placeholder={working ? "Add a to do": "whrere do you want to go?"} 
        style={styles.input}
      />
      <ScrollView>{
        Object.keys(toDos).map((key) => 
        toDos[key].working === working ? (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Fontisto name="trash" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ) : null )}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius: 30,
    marginVertical:20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor : theme.grey,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  toDoText: {
    color:"white",
    fontSize: 16,
    fontWeight: "500"
  }
});
