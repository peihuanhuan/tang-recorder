import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Colors } from "../constant/CommonStyles";
import Recorder from "../component/RecordForm";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "../component/Icon";
import { useFocusEffect } from "@react-navigation/native";

import RecordForm from "../component/RecordForm";
import { RecordPO, RecordService } from "../component/RecordPO";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import RecordItem from "../component/RecordItem";

export default function ListRecords({ navigation }) {
  const [records, setRecords] = useState<RecordPO[]>([]);

  const [test, setTest] = useState("asdad");
  const updateRecords = async () => {
    const r = await RecordService.listRecords();
    const fileInfo = await FileSystem.getInfoAsync(r[0].path, {});

    setTest(fileInfo.exists.toString());
    setRecords(r);
  };

  // useEffect(() => {
  //   updateRecords();
  // }, []);

  useFocusEffect(() => {
    updateRecords();
  });

  return (
    <View>
      {records.map((r) => (
        <View key={r.md5}>
          <RecordItem recordPO={r}></RecordItem>
        </View>
      ))}
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
