import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Modal,
  Button,
  Pressable,
} from "react-native";
import { Colors, Fonts } from "../constant/CommonStyles";
import NewRecorder from "../page/NewRecoder";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "./Icon";
import { TimeUtils } from "../util/TimeUtils";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TagsContainer from "./TagsContainer";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Tag from "./Tag";
import { RecordPO } from "./RecordPO";

type Prop = {
  recordPO: RecordPO;
  onClick?: () => void;
  onRemove?: () => void;
};

export default function RecordItem({
  recordPO,
  onClick,
  onRemove = () => {},
}: Prop) {
  const { name, category, tags, md5, path, durationMillis, size, createAt } =
    recordPO;

  return (
    <View key={md5} style={[styles.container, styles.col]}>
      <View style={[styles.row]}>
        <Tag value={category} color={Colors.black} type={"drop_shadow"}></Tag>
        <View style={[styles.col, styles.margin]}>
          <Text style={styles.name}>{name}</Text>
          <View style={[styles.row, { marginTop: 6 }]}>
            <Text style={styles.duration}>
              {TimeUtils.formatAudioDuration(durationMillis)}
            </Text>
            <Text style={styles.createAt}>
              {TimeUtils.formatDate(new Date(createAt))}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tagContainer}>
        {tags.map((e) => (
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

      <View style={styles.line}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    backgroundColor: Colors.helper5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
  },
  margin: {
    marginLeft: 12,
  },
  name: {
    fontSize: Fonts.subtitle1.fontSize,
    fontWeight: Fonts.headline6.fontWeight,
  },
  duration: {
    marginRight: 12,
    fontSize: Fonts.body2.fontSize,
    fontWeight: "300",
  },
  createAt: {
    fontSize: Fonts.body2.fontSize,
    fontWeight: "300",
  },
  tagContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.grey20,
  },
});
