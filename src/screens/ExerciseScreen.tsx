import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from '../navigation/AppNavigator'

type ExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, "Exercise">

interface Props {
  navigation: ExerciseScreenNavigationProp
}

const ExerciseScreen: React.FC<Props> = ({ navigation }) => {
  const [currentSet, setCurrentSet] = useState(1)
  const [totalSets] = useState(5)
  const [timerSeconds, setTimerSeconds] = useState(30)

  // Countdown timer for rest between sets
  useEffect(() => {
    if (timerSeconds <= 0) return

    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timerSeconds])

  // Format timer as MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Exercise Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>운동 경과</Text>

          <TouchableOpacity style={styles.exerciseItem}>
            <View style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>세트 수</Text>
              <Text style={styles.exerciseSubtitle}>
                {currentSet} / {totalSets}
              </Text>
              <Text style={styles.exerciseText}>진행 바 표시</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(currentSet / totalSets) * 100}%` }]} />
              </View>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exerciseItem}>
            <View style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>남은 세트 시간</Text>
              <Text style={styles.exerciseText}>{formatTimer(timerSeconds)}</Text>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Next Exercise */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>다음 운동 안내</Text>
            <Text style={styles.sectionSubtitle}>다음 운동 및 준비 사항</Text>
          </View>

          <TouchableOpacity style={styles.exerciseItem}>
            <View style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>다음 운동</Text>
              <Text style={styles.exerciseText}>스쿼트</Text>
              <View style={styles.exerciseIconContainer}>
                <Text style={styles.exerciseIcon}>🏋️</Text>
              </View>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Camera Frame */}
        <View style={styles.cameraSection}>
          <View style={styles.cameraFrame}>
            <Text style={styles.cameraText}>카메라 프레임</Text>
          </View>
        </View>

        {/* Voice Chatbot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>음성 챗봇</Text>
            <TouchableOpacity style={styles.voiceButton}>
              <Text style={styles.voiceButtonText}>음성 활성화</Text>
              <Text>✏️</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.voiceChip}>
            <View style={styles.voiceIconContainer}>
              <Text style={styles.voiceIcon}>🎤</Text>
            </View>
            <Text style={styles.voiceChipText}>음성 안내</Text>
          </TouchableOpacity>
        </View>

        {/* Chat History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>대화 기록</Text>

          <View style={styles.chatItem}>
            <View style={styles.chatIconContainer}>
              <Text style={styles.chatIcon}>💬</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatTitle}>챗봇</Text>
              <Text style={styles.chatSubtitle}>안내 받음</Text>
            </View>
            <Text style={styles.chatTime}>10:25</Text>
          </View>
        </View>

        {/* Recent Chat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 대화</Text>

          <View style={styles.recentChatCard}>
            <View style={styles.chatUser}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>AI</Text>
            </View>
            <Text style={styles.chatMessage}>오늘 운동 목표는 30분입니다.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>재시작</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>완료</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>일시 중지</Text>
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 12,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  exerciseSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  exerciseText: {
    fontSize: 12,
    color: "black",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#D6D5D5",
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#28E01E",
    borderRadius: 4,
  },
  exerciseIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  exerciseIcon: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 16,
    color: "gray",
  },
  cameraSection: {
    padding: 16,
  },
  cameraFrame: {
    height: 240,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  voiceButtonText: {
    fontSize: 12,
    color: "black",
  },
  voiceChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 12,
    gap: 8,
  },
  voiceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceIcon: {
    fontSize: 16,
  },
  voiceChipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 8,
  },
  chatIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  chatIcon: {
    fontSize: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 14,
    color: "black",
  },
  chatSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
  },
  chatTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  recentChatCard: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 6,
    padding: 12,
  },
  chatUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  userName: {
    fontSize: 12,
    fontWeight: "500",
    color: "black",
  },
  chatMessage: {
    fontSize: 14,
    color: "black",
  },
  controlButtons: {
    padding: 16,
    gap: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 8,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  primaryButton: {
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
})

export default ExerciseScreen
