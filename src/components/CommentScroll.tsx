import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";
import Comment from "./Comment";

type Comment = {
  id: string;
  user: string;
  text: string;
  date: string;
};

type Props = {
  visible: boolean;
  eventId?: string | null;
  onClose: () => void;
  initialComments?: Comment[];
};

const { height: screenHeight } = Dimensions.get("window");

export default function CommentScroll({
  visible,
  eventId,
  onClose,
  initialComments = [],
}: Props) {
  const sheetHeight = Math.round(screenHeight * 0.65);
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: sheetHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayOpacity, translateY, sheetHeight]);

  if (!visible) {
    // Still render to allow animation to run; overlayOpacity will be 0 and translateY moved down.
  }

  return (
    <View style={styles.wrapper} pointerEvents={visible ? "auto" : "none"}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity } as any]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          { height: sheetHeight, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>Comments</Text>
        <Text style={styles.subtitle}>{eventId ? `Event ID: ${eventId}` : ""}</Text>

        <FlatList
          data={initialComments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Comment id={item.id} user={item.user} text={item.text} date = {item.date}/>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No comments yet.</Text>
            </View>
          )}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })}
        >
          <View style={styles.composer}>
            <Text style={styles.composerPlaceholder}>Write a comment...</Text>
            <Pressable style={styles.sendBtn} onPress={() => {}}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },
  commentRow: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  commentUser: {
    fontWeight: "700",
  },
  commentText: {
    marginTop: 2,
  },
  commentDate:{
    fontSize: 12,
  },
  empty: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
  },
  composerPlaceholder: {
    flex: 1,
    color: "#666",
  },
  sendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007aff",
    borderRadius: 6,
  },
  sendText: {
    color: "white",
    fontWeight: "600",
  },
});
