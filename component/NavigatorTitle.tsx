import { Image, View, StyleSheet, Pressable, Text, Button } from "react-native";
import React from "react";
import { Fonts } from "../constant/CommonStyles";
import Icon from "./Icon";
import { useNavigation } from '@react-navigation/native';

export default function NavigatorTitle() {
    const navigation = useNavigation();

    return (
    <View style={styles.rowTitle}>
      <Icon
        size="s"
        name="plus"
        onPress={() => navigation.navigate("NewRecord")}
      ></Icon>

      <Icon
        size="s"
        name="search"
        onPress={() => navigation.navigate("SaveRecord")}
      ></Icon>
    </View>
  );
}

const styles = StyleSheet.create({
  rowTitle: {
    flexDirection: "row",
    // marginVertical: 8,
    // marginHorizontal: 16,
  },
});
