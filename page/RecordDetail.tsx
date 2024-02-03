import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import {Colors, Fonts} from "../constant/CommonStyles";
import Recorder from "../component/RecordForm";
import {NavigationContainer, useFocusEffect} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "../component/Icon";
import RecordForm from "../component/RecordForm";
import {RecordPO, RecordService} from "../component/RecordPO";
import {useState} from "react";
import * as FileSystem from "expo-file-system";
import Tag from "../component/Tag";

export default function RecordDetail({ route, navigation }) {
  const { id } = route.params;

  const [record, setRecord] = useState<RecordPO>();

  const getRecord = async () => {
    const record = await RecordService.getRecordById(id)
    setRecord(record);
  };

  useFocusEffect(() => {
    getRecord()
  });

  return (
    <View>
      <Text style={styles.name}>{record.name}</Text>

      <View style={styles.tagContainer}>
        {record.tags.map((e) => (
            <View key={e}>
              <Tag
                  value={e}
                  color={Colors.orange30}
                  type={"bullet_square"}
                  fontSize="s"
              />
            </View>
        ))}
      </View>

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

  name: {
    fontSize: Fonts.subtitle1.fontSize,
    fontWeight: Fonts.headline6.fontWeight,
  },
  tagContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
