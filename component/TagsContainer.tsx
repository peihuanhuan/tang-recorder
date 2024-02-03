import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { Colors, Fonts } from "../constant/CommonStyles";
import NewRecorder from "../page/NewRecoder";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "./Icon";
import { TimeUtils } from "../util/TimeUtils";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import _ from "lodash/array";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Tag from "./Tag";
import CreateTagForm from "./CreateTagForm";

type Props = {
  title: string;
  initSelected: string[];
  initOptions: string[];
  multiSelect: boolean;
  maxNumber?: number;
  onCreate: () => void;
  onSelectChanged: (selected: string[]) => void;
};
export default function TagsContainer({
  title,
  initOptions,
  initSelected,
  multiSelect = true,
  onCreate,
  onSelectChanged,
  maxNumber = 5,
}: Props) {
  initOptions = initOptions.map((v) => v.trim());

  const [selectedTags, setSelectedTags] = useState<string[]>(
    initSelected.map((v) => v.trim()),
  );

  useEffect(() => {
    if (multiSelect) {
      setSelectedTags(
        _.uniq([...initSelected.map((v) => v.trim()), ...selectedTags]),
      );
    } else {
      setSelectedTags(initSelected.map((v) => v.trim()));
    }
  }, [initSelected]);

  const trigleTagStatus = (name) => {
    let newSelected = [];

    if (multiSelect) {
      if (selectedTags.indexOf(name) == -1) {
        if (selectedTags.length >= maxNumber) {
          return;
        }
        newSelected = [...selectedTags, name];
      } else {
        newSelected = selectedTags.filter((element) => element !== name);
      }
    } else {
      newSelected = [name];
    }
    setSelectedTags(newSelected);

    onSelectChanged(newSelected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        <Tag
          value={`添加`}
          color={Colors.main}
          onClick={onCreate}
          type={"round_outline"}
        ></Tag>

        {initOptions.map((option, index) => (
          <Tag
            key={index}
            value={option}
            color={Colors.helper4}
            onClick={() => {
              trigleTagStatus(option);
            }}
            type={
              selectedTags.indexOf(option) == -1
                ? "round_outline"
                : "round_solid"
            }
          ></Tag>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  tagContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
