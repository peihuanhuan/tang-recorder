import { StatusBar } from "expo-status-bar";
import { Colors, Fonts } from "../constant/CommonStyles";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";

import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from "../component/Icon";
import { TimeUtils } from "../util/TimeUtils";

enum RecordStatus {
  INIT,
  RECORDING,
  RECORDING_PAUSE,
  RECORDING_STOP,
  PLAYING,
  PLAYING_PAUSE,
}

function hasStartRecord(recordStatus: RecordStatus) {
  return (
    recordStatus == RecordStatus.RECORDING ||
    recordStatus == RecordStatus.RECORDING_PAUSE
  );
}

function hasPlayed(recordStatus: RecordStatus) {
  return (
    recordStatus == RecordStatus.PLAYING ||
    recordStatus == RecordStatus.PLAYING_PAUSE
  );
}

function recordFinished(recordStatus: RecordStatus) {
  return (
    recordStatus == RecordStatus.PLAYING ||
    recordStatus == RecordStatus.PLAYING_PAUSE ||
    recordStatus == RecordStatus.RECORDING_STOP
  );
}

export default function NewRecorder({ navigation }) {
  const AudioRecorder = React.useRef(new Audio.Recording());
  const AudioPlayer = React.useRef(new Audio.Sound());

  const [recordedURI, setRecordedURI] = useState<string>("");
  const [audioPermission, setAudioPermission] = useState<boolean>(false);
  const [mediaPermission, setMediaPermission] = useState<boolean>(false);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>(
    RecordStatus.INIT,
  );
  const [recordingStatus, setRecordingStatus] =
    React.useState<Audio.RecordingStatus>();
  const [playingStatus, setPlayingStatus] =
    React.useState<AVPlaybackStatusSuccess>();

  let background = "";
  switch (recordStatus) {
    case RecordStatus.INIT:
      background = Colors.helper3;
      break;
    case RecordStatus.RECORDING:
      background = Colors.helper3;
      break;
    case RecordStatus.RECORDING_STOP:
      background = Colors.helper3;
      break;
    case RecordStatus.RECORDING_PAUSE:
      background = Colors.helper3;
      break;
  }
  const backgroundStyle = {
    backgroundColor: Colors.helper3,
  };

  // Initial Load to get the audio permission
  useEffect(() => {
    getRecordPermission();
    getMediaPermission();
  }, []);

  // Function to get the audio permission
  const getRecordPermission = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const getAudioPerm = await Audio.requestPermissionsAsync();
    setAudioPermission(getAudioPerm.granted);
  };

  const getMediaPermission = async () => {
    // const getMediaPerm = await MediaLibrary.requestPermissionsAsync();
    // setMediaPermission(getMediaPerm.granted);
    setMediaPermission(true);
  };

  // Function to start recording
  const startRecording = async () => {
    await stopPlaying();
    if (hasStartRecord(recordStatus)) {
      return;
    }
    try {
      // Check if user has given the permission to record
      if (audioPermission === false) {
        // If user has not given the permission to record, then ask for permission
        await getRecordPermission();
      } else if (mediaPermission === false) {
        await getMediaPermission();
      } else {
        try {
          // Prepare the Audio Recorder
          AudioRecorder.current = new Audio.Recording();
          await AudioRecorder.current.prepareToRecordAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY,
          );

          // Start recording
          await AudioRecorder.current.startAsync();
          AudioRecorder.current.setOnRecordingStatusUpdate(
            (status: Audio.RecordingStatus) => setRecordingStatus(status),
          );

          setRecordStatus(RecordStatus.RECORDING);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pauseRecording = async () => {
    try {
      await AudioRecorder.current.pauseAsync();
      setRecordStatus(RecordStatus.RECORDING_PAUSE);
    } catch (error) {
      console.log(error);
    }
  };

  const resumeRecording = async () => {
    try {
      await AudioRecorder.current.startAsync();
      setRecordStatus(RecordStatus.RECORDING);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    try {
      await AudioRecorder.current.stopAndUnloadAsync();

      // Get the recorded URI here
      const result = AudioRecorder.current.getURI();

      // Create a file name for the recording
      const fileName = `tang-recording-${Date.now()}.m4a`;

      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "recordings/",
        { intermediates: true },
      );

      let to = FileSystem.documentDirectory + "recordings/" + `${fileName}`;

      await FileSystem.moveAsync({
        from: result,
        to: to,
      });

      // const resp = await MediaLibrary.createAssetAsync(to);
      setRecordedURI(to);

      setRecordStatus(RecordStatus.RECORDING_STOP);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to play the recorded audio
  const playRecordedAudio = async () => {
    try {
      // Load the Recorded URI
      if (!AudioPlayer.current._loaded) {
        await AudioPlayer.current.loadAsync({ uri: recordedURI }, {}, true);
        await AudioPlayer.current.setIsLoopingAsync(true);
      }
      AudioPlayer.current.setOnPlaybackStatusUpdate(
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            setPlayingStatus(status);
          } else {
            // 播放完成
            // setPlayingStatus(null)
            // setRecordStatus(RecordStatus.RECORDING_STOP)
          }
        },
      );

      await AudioPlayer.current.playFromPositionAsync(
        playingStatus?.positionMillis || 0,
      );
      setRecordStatus(RecordStatus.PLAYING);
    } catch (error) {
      console.log(error);
    }
  };

  const pausePlaying = async () => {
    try {
      // If song is playing then stop it
      await AudioPlayer.current.pauseAsync();
      setRecordStatus(RecordStatus.PLAYING_PAUSE);
    } catch (error) {
      console.log(error);
    }
  };

  const stopPlaying = async () => {
    try {
      // If song is playing then stop it
      await AudioPlayer.current.unloadAsync();
      setPlayingStatus(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={styles.centerContainer}>
        <Text style={[Fonts.headline3, Fonts.center, { marginBottom: 16 }]}>
          {hasPlayed(recordStatus)
            ? TimeUtils.formatAudioDuration(playingStatus?.positionMillis)
            : TimeUtils.formatAudioDuration(recordingStatus?.durationMillis)}
        </Text>

        <View style={styles.rowDirection}>
          {
            // 暂停与恢复录制
            hasStartRecord(recordStatus) && (
              <Icon
                name={
                  recordStatus == RecordStatus.RECORDING
                    ? "audioPause"
                    : "audioResume"
                }
                size="xl"
                onPress={
                  recordStatus == RecordStatus.RECORDING
                    ? pauseRecording
                    : resumeRecording
                }
              />
            )
          }
          {
            // 开始录制与结束录制
            !hasPlayed(recordStatus) &&
              recordStatus != RecordStatus.RECORDING_STOP && (
                <Icon
                  name={
                    !hasStartRecord(recordStatus) ? "audioStart" : "audioStop"
                  }
                  size="xl"
                  onPress={
                    !hasStartRecord(recordStatus)
                      ? startRecording
                      : stopRecording
                  }
                />
              )
          }
          {
            // 播放与暂停播放
            (recordStatus == RecordStatus.RECORDING_STOP ||
              hasPlayed(recordStatus)) && (
              <Icon
                name={
                  recordStatus == RecordStatus.PLAYING_PAUSE ||
                  recordStatus == RecordStatus.RECORDING_STOP
                    ? "audioResume"
                    : "audioPause"
                }
                size="xl"
                onPress={
                  recordStatus == RecordStatus.PLAYING_PAUSE ||
                  recordStatus == RecordStatus.RECORDING_STOP
                    ? playRecordedAudio
                    : pausePlaying
                }
              />
            )
          }
        </View>
        <View
          style={[
            styles.rowDirection,
            { marginTop: 24, opacity: recordFinished(recordStatus) ? 100 : 0 },
          ]}
        >
          <Text
            style={[Fonts.headline6, { marginRight: 24 }]}
            onPress={startRecording}
          >
            重试
          </Text>
          <Text
            style={[Fonts.headline6, { marginLeft: 24 }]}
            onPress={() => {
              navigation.navigate("SaveRecord", {
                pathUri: recordedURI,
                durationMillis: recordingStatus?.durationMillis,
              });
            }}
          >
            继续
          </Text>
        </View>
      </View>

      <View style={styles.endText}>
        <Text style={[Fonts.body2, Fonts.center, { marginBottom: 8 }]}>
          录音时长最多为60min。
        </Text>
        <Text style={[Fonts.caption, Fonts.center, {}]}>
          录音仅存储在设备上，卸载软件自动删除，可将它们同步到服务器。
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  rowDirection: {
    flexDirection: "row",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    padding: 8,
  },
  endText: {
    justifyContent: "flex-end", // 将内容放置在底部
    marginTop: "auto",
    marginBottom: 16,
  },
});
