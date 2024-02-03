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
  Keyboard,
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

import TagFormHeader from "./TagFormHeader";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

type Prop = {
  open: boolean;
  title: string;
  onSave: (string) => void;
  onCancel: () => void;
};

export default function CreateTagForm({ title, open, onSave, onCancel }: Prop) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "50%"], []);

  const [value, onChangeValue] = React.useState("");
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (open) {
      textInputRef.current?.focus(); // 打开键盘
    } else {
    }
  }, [open]);

  if (!open) {
    return <></>;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={open ? 0 : -1}
      keyboardBehavior="fillParent"
      snapPoints={snapPoints}
    >
      <TagFormHeader
        title={title}
        onCancel={() => {
          onCancel();
          bottomSheetRef.current?.close();
          Keyboard.dismiss(); // 关闭键盘
        }}
        onSave={() => {
          if (value.trim().length > 0) {
            onSave(value.trim());
          } else {
            onCancel();
          }
          onChangeValue("");
          Keyboard.dismiss(); // 关闭键盘
          bottomSheetRef.current?.close();
        }}
      />

      <TextInput
        style={styles.input}
        ref={textInputRef}
        onChangeText={onChangeValue}
        value={value}
        maxLength={5}
        placeholder="请输入名称"
      />
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 16,
    padding: 10,
    backgroundColor: Colors.grey20,
    borderRadius: 10,
  },
});
