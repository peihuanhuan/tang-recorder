import { Image, View, StyleSheet, Pressable } from "react-native";

type IconProps = {
  name:
    | "back"
    | "audioStart"
    | "audioStop"
    | "audioPause"
    | "audioResume"
    | "cactus"
    | "category"
    | "x"
    | "search"
    | "plus"
    | "handsClapping"
    | "tag";
  size?: "m" | "s" | "l" | "xl";
  onPress?: () => void;
};
export default function Icon({
  name,
  onPress = () => {},
  size = "m",
}: IconProps) {
  const iconMapping = {
    back: require("../assets/icons/back.png"),
    audioStart: require("../assets/icons/audio-start.png"),
    audioStop: require("../assets/icons/audio-stop.png"),
    audioPause: require("../assets/icons/audio-pause.png"),
    audioResume: require("../assets/icons/audio-resume.png"),
    cactus: require("../assets/icons/cactus.png"),
    category: require("../assets/icons/category.png"),
    tag: require("../assets/icons/tag.png"),
    x: require("../assets/icons/x.png"),
    handsClapping: require("../assets/icons/hands-clapping.png"),
    plus: require("../assets/icons/plus.png"),
    search: require("../assets/icons/search.png"),
  };

  const iconSource = iconMapping[name];

  let length = 0;
  if (size == "m") {
    length = 32;
  } else if (size == "s") {
    length = 16;
  } else if (size == "l") {
    length = 64;
  } else if (size == "xl") {
    length = 80;
  }

  return (
    <Pressable onPress={onPress}>
      <Image
        source={iconSource}
        fadeDuration={0}
        style={{ width: length, height: length, margin: 8 }}
      />
    </Pressable>
  );
}
