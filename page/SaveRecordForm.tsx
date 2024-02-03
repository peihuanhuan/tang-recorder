import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "../constant/CommonStyles";
import Recorder from "../component/RecordForm";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "../component/Icon";
import RecordForm from "../component/RecordForm";

export default function App({ ...rest }) {
  return (
    <View>
      <RecordForm {...rest}></RecordForm>
    </View>
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
