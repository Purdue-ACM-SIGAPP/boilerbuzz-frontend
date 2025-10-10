// components/Header.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  rightElement?: React.ReactNode;
};

const HeaderBanner: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchChange,
  rightElement,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftArea}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            >
              <Text style={styles.backText}>{"<"}</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightElement ? (
          <View style={styles.rightArea}>{rightElement}</View>
        ) : null}
      </View>

      {showSearch ? (
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#999"
            onChangeText={onSearchChange}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            // avoid large auto-capitalization on iOS
            textContentType={Platform.OS === "ios" ? "none" : undefined}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07112a", // same as before
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 12,
    padding: 6,
    borderRadius: 6,
  },
  backText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 2,
  },
  rightArea: {
    // place for any custom right-side button(s)
    alignItems: "flex-end",
    justifyContent: "center",
  },
  searchRow: {
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#222",
  },
});

export default HeaderBanner;
