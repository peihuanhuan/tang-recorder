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

type Prop = {
  value: string;
  fontSize?: "m" | "s" | "l";
  color: string;
  type: "round_solid" | "round_outline" | "bullet_square" | "drop_shadow";
  closeable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

export default function Tag({
  value,
  color,
  type,
  fontSize = "m",
  closeable = false,
  onClick = () => {},
  onRemove = () => {},
}: Prop) {
  const backgroundStyles = StyleSheet.create({
    round_solid: {
      backgroundColor: color,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 999,
    },
    round_outline: {
      borderColor: color,
      borderWidth: 2,
      borderRadius: 999,
    },
    bullte_square: {},
  });

  let containerStyle = backgroundStyles[type];

  let textColor = Colors.black;
  if (type == "round_solid") {
    textColor = Colors.white;
  }
  let size = 0;
  if (fontSize == "s") {
    size = 12;
  } else if (fontSize == "m") {
    size = 18;
  } else if (fontSize == "l") {
    size = 24;
  }

  let content;
  if (type == "bullet_square") {
    content = (
      <BullteSquareTag
        fontSize={size}
        color={color}
        value={value}
      ></BullteSquareTag>
    );
  } else if (type == "drop_shadow") {
    content = (
      <DropShadowTag
        fontSize={size}
        color={color}
        value={value}
      ></DropShadowTag>
    );
  } else {
    content = (
      <View style={[styles.container, containerStyle]}>
        <Text style={{ fontSize: size, color: textColor }}>{value}</Text>
        {closeable && <Icon name="x" size="s" onPress={onRemove}></Icon>}
      </View>
    );
  }

  return (
    <Pressable id={value} onPress={onClick}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  bullte: {
    backgroundColor: Colors.grey10,
    borderRadius: 8,
  },
  shadowProp: {
    elevation: 5,
    shadowColor: "#52006A",
  },
});

function BullteSquareTag({ fontSize, value, color }) {
  const style = StyleSheet.create({
    border: {
      backgroundColor: color,
      width: 13,
      height: 13,
      borderRadius: 3,
      marginRight: 8,
    },
  });

  return (
    <View
      style={[styles.container, styles.bullte, { backgroundColor: "#f0f0f0" }]}
    >
      <View style={style.border}></View>
      <Text
        style={{
          fontSize: fontSize,
          color: Colors.black,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function DropShadowTag({ fontSize, value, color }) {
  const style = StyleSheet.create({
    border: {
      borderColor: color,
      borderWidth: 3,
      borderRadius: 8,
    },
    offsetChild: {
      top: 3,
      left: 3,
      borderWidth: 5,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      position: "absolute",
    },
  });

  return (
    <View>
      <View
        style={[
          styles.container,
          style.border,
          { width: 90, height: 50, paddingHorizontal: 8 },
        ]}
      >
        <Text
          numberOfLines={1}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          style={{ color: Colors.black }}
        >
          {value}
        </Text>
      </View>
      <View
        style={[
          styles.container,
          style.border,
          { width: 90, height: 50, paddingHorizontal: 8 },
          style.offsetChild,
        ]}
      >
        <Text
          numberOfLines={1}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          style={{ color: Colors.black, opacity: 0 }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
