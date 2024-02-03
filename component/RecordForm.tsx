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
  Pressable,
} from "react-native";
import { Colors, Fonts } from "../constant/CommonStyles";
import * as FileSystem from "expo-file-system";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecordPO, RecordService } from "./RecordPO";
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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import TagFormHeader from "./TagFormHeader";
import CreateTagForm from "./CreateTagForm";

export default function RecordForm({ route, navigation }) {
  const { pathUri, durationMillis } = route.params;

  const [name, setName] = useState<string>(TimeUtils.formatDate(new Date()));
  const [category, setCategory] = useState<string>("默认");
  const [tags, setTags] = useState<string[]>([]);
  const [creatingStatus, setCreatingStatus] = useState<"tag" | "category">(
    null,
  );

  const unSavedCategory = useRef(category);
  const unSavedTags = useRef(tags);

  let initOptions = ["琐事", "技术"];
  let initCategoryOptions = ["默认", "生活"];

  const [allTags, setAllTags] = useState(initOptions);
  const [allCategories, setAllCategories] = useState(initCategoryOptions);

  // ref
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const tagsBottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "50%"], []);

  const maxTagNumber = 6;

  async function saveRecord() {
    const fileInfo = await FileSystem.getInfoAsync(pathUri, {
      md5: true,
    });
    if (!fileInfo.exists) {
      console.warn("文件不存在，跳过保存");
      return;
    }

    const recordPO = new RecordPO(
      name,
      category,
      tags,
      fileInfo.md5,
      pathUri,
      durationMillis,
      fileInfo.size,
      new Date().getTime(),
    );
    await RecordService.storeRecord(recordPO);
    console.log("保存record成功");
    navigation.navigate("RecordList");
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.row}>
          <Icon name="cactus" size="s" />
          <Text style={Fonts.subtitle1}>标题</Text>
        </View>

        <TextInput
          value={name}
          maxLength={20}
          onChangeText={setName}
          style={{
            paddingTop: 10,
            paddingBottom: 32,
            fontSize: Fonts.headline5.fontSize,
          }}
        ></TextInput>

        <View style={styles.row}>
          <Icon name="category" size="s" />
          <Text style={Fonts.subtitle1}>分类</Text>
        </View>
        <Text
          onPress={() => categoryBottomSheetRef.current?.expand()}
          style={{
            paddingTop: 10,
            paddingBottom: 32,
            fontSize: Fonts.headline5.fontSize,
          }}
        >
          {category}
        </Text>

        <View style={styles.row}>
          <Icon name="tag" size="s" />
          <Text style={Fonts.subtitle1}>标签</Text>
        </View>

        <Text
          onPress={() => tagsBottomSheetRef.current?.expand()}
          style={{
            paddingTop: 10,
            paddingBottom: 32,
            paddingHorizontal: 32,
            fontSize: Fonts.subtitle1.fontSize,
          }}
        >
          {tags.length == 0 ? "未选择" : tags.join(", ")}
        </Text>

        <View style={[styles.row, { marginTop: 24 }]}>
          <Text onPress={() => saveRecord()} style={styles.save}>
            保存
          </Text>
          <Icon onPress={saveRecord} name="handsClapping" size="m" />
        </View>

        <BottomSheet
          ref={categoryBottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
        >
          <TagFormHeader
            title={"选择分类"}
            onCancel={() => categoryBottomSheetRef.current?.close()}
            onSave={() => {
              setCategory(unSavedCategory.current);
              categoryBottomSheetRef.current?.close();
            }}
          />

          <BottomSheetScrollView>
            <TagsContainer
              multiSelect={false}
              title={"分类"}
              onCreate={() => setCreatingStatus("category")}
              initSelected={[unSavedCategory.current]}
              onSelectChanged={(values) =>
                (unSavedCategory.current = values[0])
              }
              initOptions={allCategories}
            />
          </BottomSheetScrollView>
        </BottomSheet>

        <BottomSheet
          ref={tagsBottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
        >
          <TagFormHeader
            title={"选择标签"}
            onCancel={() => tagsBottomSheetRef.current?.close()}
            onSave={() => {
              setTags(unSavedTags.current);
              tagsBottomSheetRef.current?.close();
            }}
          />

          <BottomSheetScrollView>
            <TagsContainer
              multiSelect={true}
              title={"标签"}
              onCreate={() => {
                setCreatingStatus("tag");
              }}
              initSelected={unSavedTags.current}
              maxNumber={maxTagNumber}
              onSelectChanged={(values) => (unSavedTags.current = values)}
              initOptions={allTags}
            />
          </BottomSheetScrollView>
        </BottomSheet>

        <CreateTagForm
          open={creatingStatus !== null}
          title={"创建"}
          onCancel={() => setCreatingStatus(null)}
          onSave={(newOption) => {
            if (creatingStatus == "tag") {
              setAllTags([newOption, ...allTags]);
              if (unSavedTags.current.length < maxTagNumber) {
                unSavedTags.current = [...unSavedTags.current, newOption];
              }
            }
            if (creatingStatus == "category") {
              setAllCategories([newOption, ...allCategories]);
              unSavedCategory.current = newOption;
            }
            setCreatingStatus(null);
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    backgroundColor: Colors.helper3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  save: {
    fontSize: Fonts.headline5.fontSize,
    fontWeight: "bold",
    alignItems: "center",
    // marginTop: 32,
  },
});
