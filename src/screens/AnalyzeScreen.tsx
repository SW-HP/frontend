"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from '../navigation/AppNavigator'

type AnalyzeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Analyze">

interface Props {
  navigation: AnalyzeScreenNavigationProp
}

const AnalyzeScreen: React.FC<Props> = ({ navigation }) => {
  const handleHomePress = () => {
    navigation.navigate("Home")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* User Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar} />
          <Text style={styles.profileText}>당신의 체형을 분석해보세요!</Text>
        </View>

        {/* Start Analysis Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>체형 분석 시작</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Exercises */}
        <View style={styles.section}>
          <View>
            <Text style={styles.sectionTitle}>추천 운동</Text>
            <Text style={styles.sectionSubtitle}>체형 분석 결과를 토대로 추천되는 운동</Text>
          </View>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🏋️</Text>
            </View>
            <Text style={styles.listItemText}>어깨 균형을 위한 운동</Text>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🦵</Text>
            </View>
            <Text style={styles.listItemText}>다리 근력 운동</Text>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Body Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>체형 지표</Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>어깨 너비</Text>
              <Text style={styles.metricValue}>60%</Text>
              <Text style={styles.metricChange}>+2%</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>허리 둘레</Text>
              <Text style={styles.metricValue}>75%</Text>
              <Text style={styles.metricChange}>-1%</Text>
            </View>
          </View>
        </View>

        {/* View History Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>이전 기록 보기</Text>
          </TouchableOpacity>
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <View>
            <Text style={styles.sectionTitle}>피드백 영역</Text>
            <Text style={styles.sectionSubtitle}>체형 상태에 대한 피드백 및 개선 방안</Text>
          </View>

          <TouchableOpacity style={styles.feedbackItem}>
            <View style={styles.feedbackImage} />
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>자세 교정 필요</Text>
              <Text style={styles.feedbackText}>매일 앉아서 하는 습관 개선이 필요합니다</Text>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.feedbackItem}>
            <View style={styles.feedbackImage} />
            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackTitle}>근육 발달 상태</Text>
              <Text style={styles.feedbackText}>근육 발달이 부족해보입니다</Text>
            </View>
            <Text style={styles.chevron}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>분석 저장</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>결과 공유</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📏</Text>
          <Text style={styles.navText}>체형 분석</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  profileText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  chevron: {
    fontSize: 16,
    color: "gray",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
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
  metricChange: {
    fontSize: 14,
    color: "black",
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    gap: 12,
  },
  feedbackImage: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  feedbackText: {
    fontSize: 12,
    color: "black",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 10,
    color: "black",
    marginTop: 4,
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

export default AnalyzeScreen
