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
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TagsContainer from "./TagsContainer";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

type Prop = {
  title: string;
  onSave: () => void;
  onCancel: () => void;
};

export default function TagFormHeader({ title, onCancel, onSave }: Prop) {
  return (
    <View style={styles.rowTitle}>
      <Text onPress={onCancel} style={styles.leftText}>
        取消
      </Text>
      <Text style={styles.centerText}>{title}</Text>
      <Text onPress={onSave} style={styles.rightText}>
        确认
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  leftText: {
    flex: 1,
    textAlign: "left",
    fontSize: Fonts.subtitle1.fontSize,
  },
  centerText: {
    flex: 1,
    textAlign: "center",
    fontSize: Fonts.headline6.fontSize,
  },
  rightText: {
    flex: 1,
    textAlign: "right",
    fontSize: Fonts.subtitle1.fontSize,
  },
});
