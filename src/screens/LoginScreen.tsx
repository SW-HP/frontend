
import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from '../navigation/AppNavigator'

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface Props {
  navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // In a real app, you would validate and authenticate here
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>로그인</Text>

          {/* Email/Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일 또는 사용자 이름</Text>
            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.textField}
                placeholder="이메일 또는 사용자 이름을 입력해주세요"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.textField}
                placeholder="비밀번호를 입력해주세요"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>비밀번호 보기 아이콘을 클릭하여 비밀번호를 확인할 수 있습니다</Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialLoginContainer}>
            <Text style={styles.sectionTitle}>다른 방법으로 로그인</Text>
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>구글</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>페이스북</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>애플</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Registration */}
          <View style={styles.actionContainer}>
            <View>
              <Text style={styles.sectionTitle}>계정이 없으신가요?</Text>
              <Text style={styles.sectionSubtitle}>지금 가입하세요!</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionRow}>
                <Text style={styles.actionText}>회원가입</Text>
              </View>
              <Text>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Password Recovery */}
          <View style={styles.actionContainer}>
            <View>
              <Text style={styles.sectionTitle}>비밀번호를 잊으셨나요?</Text>
              <Text style={styles.sectionSubtitle}>비밀번호 찾기</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionRow}>
                <Text style={styles.actionText}>비밀번호 찾기</Text>
              </View>
              <Text>▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  textFieldContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  textField: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  eyeIcon: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  socialLoginContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginBottom: 4,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  actionContainer: {
    gap: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: "black",
  },
})

export default LoginScreen