// src/screens/RegisterPage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


// Easy way to test and change different color schemes/themes
const COLORS = {
  background: "#faf7ef",
  headerBackground: "#0b142a",
  headerText: "#fff",
  filledProgressBar: "#f5c14e",
  unfilledProgressBar: "#333",
  inputBackground: "#f9f6ed",
  border: "#000",
  text: "#000",
};

// Tried to replicate formatting on figma as close as possible
export default function RegisterPage() {
  const navigation = useNavigation();

  // Counter to determine which step of registration we're on
  const [step, setStep] = useState(1);

  // Objects to store text inputs
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");
  const [gender, setGender] = useState("");
  const [classYear, setClassYear] = useState("");
  const [major, setMajor] = useState("");



  // getting insets to apply top padding so header banner can reach iphone notchs 
  const insets = useSafeAreaInsets();

  // Functions for next and back buttons
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigation.navigate("Tabs");
    }
  };

  const handleBackPress = () => {
    if (step === 1) {
      navigation.navigate("Login");
    } else {
      setStep(step - 1);
    }
  };





  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={[styles.headerBannerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerBannerBackground} />
        <Text style={styles.headerBannerTitle}>SIGN UP</Text>

        {/* Progress Bar */}
        {/* Currently only has 3 steps. Margins and sizes might have to change if more need to be added */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.progressStep,
                i <= step && { backgroundColor: COLORS.filledProgressBar },
              ]}
            />
          ))}
        </View>
      </View>


      {/* User info form */}

      {
      /* 
        Keyboard avoiding view and scroll view to
        prevent keyboard from blocking inputs and
        allow users to scroll to next input that
        the keyboard might be blocking
      */
      }
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView edges={["bottom", "left", "right"]} style={styles.formArea}>

          {/* Step 1/page 1 of registering */}
          {step === 1 && (
            <View style={styles.stepContainer}>

              {/* Username input */}
              <Text style={styles.label}>Username</Text>
              <TextInput 
              style={styles.input}
              value={username}
              onChangeText={setusername}
              />

              {/* Password input */}
              <Text style={styles.label}>Password</Text>
              <TextInput 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              />

              {/* Email input */}
              <Text style={styles.label}>Email</Text>
              <TextInput 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              />
            
              {/* First and last name input */}
              <View style={styles.mutlipleFieldsRow}>
                
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>First Name</Text> 
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Last Name</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              {/* Next button */}
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>

              {/* Back button */}
              <TouchableOpacity
                style={[styles.nextButton]}
                onPress={() => { handleBackPress()
                }}
              >
                <Text style={[styles.nextText]}>Back</Text>
              </TouchableOpacity>

            </View>
          )}
            
          {/* Step 2 of registering */}
          {step === 2 && (
            <View style={styles.stepContainer}>

              <Text style={styles.label}>Birthday</Text>

              {/* Birthday row */}
              <View style={styles.mutlipleFieldsRow}>

              {/* Birthday month input */}
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Month</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    placeholder="MM"
                    value={birthdayMonth}
                    onChangeText={setBirthdayMonth}
                  />
                </View>

              {/* Birthday day input */}
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Day</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    placeholder="DD"
                    value={birthdayDay}
                    onChangeText={setBirthdayDay}
                  />
                </View>

              {/* Birthday year input */}
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Year</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    placeholder="YYYY"
                    value={birthdayYear}
                    onChangeText={setBirthdayYear}
                  />
                </View>

              </View>

              {/* Row for gender and graduating class */}
              <View style={styles.mutlipleFieldsRow}>


                {/* 
                    Replace gender section later with dropdown later. 
                    I want to use react-native-picker/picker, but idk how
                    to configure the repository so that there's an automatic
                    npm installation for anyone who fetches. 
                */}
                
                {/* Gender input */}
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Gender</Text> 
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    value={gender}
                    onChangeText={setGender}
                  />
                </View>

                {/* Class Year input */}
                <View style={{flex: 1}}>
                  <Text style={styles.fieldLabel}>Class of</Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 0 }]}
                    placeholder="YYYY"
                    value={classYear}
                    onChangeText={setClassYear}
                  />
                </View>
              </View>
                  
              {/* Input for major.
                  
                  The Figma shows a dropdown menu for major, but
                  that would require a HUGE dropdown and it limits
                  the number of majors that can be represented.
                  We should just keep it to a textbox.

              */}
              <Text style={styles.label}>Major</Text>
              <TextInput 
              style={styles.input}
              value={major}
              onChangeText={setMajor}  
              />
                
              {/* Next Button */}
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>

              {/* Back Button */}
              <TouchableOpacity
                style={[styles.nextButton]}
                onPress={() => { handleBackPress()
                }}
              >
                <Text style={[styles.nextText]}>Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3 of registering */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.imageContainer}>

                {/* Image of bee or whatever is needed */}
                <Image
                  source={require("../../assets/templogo.png")}
                  style={styles.confirmImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.signUpText}>You’re Signed Up!</Text>
              <Text>
                Explore what events Purdue has to offer!
              </Text>

              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBannerContainer: {
    width: "100%",
    backgroundColor: COLORS.headerBackground,
    paddingBottom: 20,
  },
  headerBannerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.headerBackground,
  },
  headerBannerTitle: {
    color: COLORS.headerText,
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 20,
    marginLeft: 25
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  progressStep: {
    width: 120,
    height: 20,
    borderRadius: 100,
    backgroundColor: COLORS.unfilledProgressBar,
    marginHorizontal: 4,
  },
  formArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,

  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    width: "100%",
    marginBottom: 60,
  },
  mutlipleFieldsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",   
    gap: 20,
    width: "100%",
    marginBottom: 60,
  },
  fieldLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
  },
  slash: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  nextButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    width: 120,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  nextText: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },

  imageContainer: {
    backgroundColor: COLORS.inputBackground,
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderColor: COLORS.border,
  },
  confirmImage: {
    width: 200,
    height: 200,
  },
  signUpText: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
});
