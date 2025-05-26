import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from '../navigation/AppNavigator'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">

interface Props {
  navigation: HomeScreenNavigationProp
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [exercises] = useState([
    { name: "유산소 운동", progress: 50 },
    { name: "근력 운동", progress: 50 },
    { name: "스트레칭", progress: 50 },
  ])

  const handleStartExercise = () => {
    navigation.navigate("Exercise")
  }

  const handleAnalyzePress = () => {
    navigation.navigate("Analyze")
  }

  const handleChatbotPress = () => {
    navigation.navigate("Chatbot")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Daily Goals */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>오늘 목표: 1시간 운동, 10,000걸음 중 6,500걸음 완료</Text>

            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>운동 시간</Text>
                <Text style={styles.metricValue}>1시간</Text>
                <Text style={styles.metricStatus}>진행 중</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>걸음 수</Text>
                <Text style={styles.metricValue}>6,500걸음</Text>
                <Text style={styles.metricStatus}>진행 중</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Exercise Progress Sections */}
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseSection}>
            <View style={styles.exerciseHeader}>
              <View>
                <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                <Text style={styles.exerciseSubtitle}>현재 진행도</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Text Edit</Text>
                <Text>✏️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{exercise.progress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${exercise.progress}%` }]} />
              </View>
            </View>
          </View>
        ))}

        {/* Add Exercise Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>운동 추가</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 운동</Text>

          <View style={styles.workoutList}>
            <TouchableOpacity style={styles.workoutItem}>
              <View style={styles.workoutImage} />
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>오늘 추천</Text>
                <Text style={styles.workoutSubtitle}>하체 강화 루틴</Text>
                <View style={styles.workoutUser}>
                  <View style={styles.userAvatar} />
                  <Text style={styles.userName}>AI</Text>
                </View>
              </View>
              <Text style={styles.chevron}>▶</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.workoutItem}>
              <View style={styles.workoutImage} />
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>오늘 추천</Text>
                <Text style={styles.workoutSubtitle}>상체 강화 루틴</Text>
                <View style={styles.workoutUser}>
                  <View style={styles.userAvatar} />
                  <Text style={styles.userName}>AI</Text>
                </View>
              </View>
              <Text style={styles.chevron}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chatbot Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.outlineButton} onPress={handleChatbotPress}>
            <Text style={styles.outlineButtonText}>AI 챗봇과 대화하기</Text>
          </TouchableOpacity>
        </View>

        {/* Start Exercise Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartExercise}>
            <Text style={styles.buttonText}>운동 진행</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleAnalyzePress}>
          <Text style={styles.navIcon}>📏</Text>
          <Text style={styles.navText}>체형 분석</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>홈</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>마이페이지</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>설정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginVertical: 4,
  },
  metricStatus: {
    fontSize: 14,
    color: "black",
  },
  exerciseSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
  exerciseSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: "black",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progressText: {
    fontSize: 24,
    color: "black",
    width: 48,
  },
  progressBar: {
    flex: 1,
    height: 30,
    backgroundColor: "#D6D5D5",
    borderRadius: 20,
  },
  progressFill: {
    height: 30,
    backgroundColor: "#28E01E",
    borderRadius: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  outlineButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  workoutList: {
    gap: 16,
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 12,
  },
  workoutImage: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  workoutSubtitle: {
    fontSize: 12,
    color: "black",
  },
  workoutUser: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  userName: {
    fontSize: 12,
    fontWeight: "500",
    color: "black",
  },
  chevron: {
    fontSize: 16,
    color: "gray",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
  },
  navText: {
    fontSize: 10,
    color: "black",
  },
})

export default HomeScreen
