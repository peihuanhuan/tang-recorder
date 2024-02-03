import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "./constant/CommonStyles";
import NewRecorder from "./page/NewRecoder";
import SaveRecordForm from "./page/SaveRecordForm";
import ListRecords from "./page/ListRecords";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "./component/Icon";
import TagFormHeader from "./component/TagFormHeader";
import NavigatorTitle from "./component/NavigatorTitle";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RecordList"
        screenOptions={{
          title: "",
          headerStyle: {
            backgroundColor: Colors.helper3,
          },
        }}
      >
        <Stack.Screen
          name="RecordList"
          component={ListRecords}
          options={{
            headerRight: (props) => <NavigatorTitle/>,
            headerSearchBarOptions: {
              placeholder: "dddd",
            },
          }}
        />
        <Stack.Screen name="NewRecord" component={NewRecorder} />
        <Stack.Screen name="SaveRecord" component={SaveRecordForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
