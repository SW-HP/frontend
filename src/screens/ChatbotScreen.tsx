import type React from "react"
import Config from "react-native-config";
import axios from "axios"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from '../navigation/AppNavigator'
import AsyncStorage from "@react-native-async-storage/async-storage";
type ChatbotScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chatbot">

interface Props {
  navigation: ChatbotScreenNavigationProp
}

// 파일 내에서 직접 정의된 메시지 인터페이스
interface Message {
  id: string
  thread_id: string
  sender_type: "user" | "assistant"
  content: string
  created_at: string
}

// API 설정
const API_BASE_URL = Config.API_BASE_URL;


// 기본 설정으로 axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청에 인증 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const ChatbotScreen: React.FC<Props> = ({ navigation }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  const scrollViewRef = useRef<FlatList>(null)

  // 컴포넌트가 마운트될 때 초기 메시지 로드
  useEffect(() => {
    loadInitialMessages()
  }, [])

  // API에서 초기 메시지 로드
  const loadInitialMessages = async () => {
    try {
      setIsLoading(true)

      // 먼저 스레드가 있는지 확인
      await getOrCreateThread()

      // 그 다음 메시지 가져오기
      const response = await api.get("/assistant/messages")

      if (response.data && Array.isArray(response.data)) {
        // 시간순으로 정렬하기 위해 created_at으로 메시지 정렬
        const sortedMessages = [...response.data].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )

        // 첫 번째 로드인 경우 메시지 설정
        // 그렇지 않으면 목록에 없는 새 메시지만 추가
        if (!initialLoadDone) {
          setMessages(sortedMessages)
          setInitialLoadDone(true)
        } else {
          // 목록에 없는 메시지 찾기
          const existingIds = new Set(messages.map((m) => m.id))
          const newMessages = sortedMessages.filter((m) => !existingIds.has(m.id))

          if (newMessages.length > 0) {
            setMessages((prev) => [...prev, ...newMessages])
          }
        }

        // 예상보다 적은 메시지를 받았다면 더 이상 로드할 메시지가 없을 수 있음
        if (sortedMessages.length < 20) {
          setHasMoreMessages(false)
        }
      } else if (!initialLoadDone) {
        // 메시지가 없고 첫 번째 로드인 경우 환영 메시지 추가
        setMessages([
          {
            id: "welcome",
            thread_id: "",
            sender_type: "assistant",
            content: "안녕하세요! 운동에 관해 무엇이든 물어보세요.",
            created_at: new Date().toISOString(),
          },
        ])
        setInitialLoadDone(true)
        setHasMoreMessages(false)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      Alert.alert("오류", "메시지를 불러오는 중 문제가 발생했습니다.")

      // 메시지를 로드할 수 없고 첫 번째 로드인 경우 환영 메시지 추가
      if (!initialLoadDone) {
        setMessages([
          {
            id: "welcome",
            thread_id: "",
            sender_type: "assistant",
            content: "안녕하세요! 운동에 관해 무엇이든 물어보세요.",
            created_at: new Date().toISOString(),
          },
        ])
        setInitialLoadDone(true)
        setHasMoreMessages(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 위로 스크롤할 때 더 많은 메시지 로드 (페이지네이션)
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      // 페이지네이션을 위한 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (page >= 3) {
        setHasMoreMessages(false)
      }
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error("Error loading more messages:", error)
      Alert.alert("오류", "이전 메시지를 불러오는 중 문제가 발생했습니다.")
    } finally {
      setIsLoadingMore(false)
    }
  }

  // 당겨서 새로고침 - 기존 메시지를 지우지 않고 새 메시지 로드
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadInitialMessages() // 기존 메시지를 보존하도록 수정됨
    setRefreshing(false)
  }

  // 스레드 가져오기 또는 생성
  const getOrCreateThread = async () => {
    try {
      await api.get("/assistant/threads")
      return true
    } catch (error) {
      console.error("Error getting thread:", error)
      return false
    }
  }

  // 어시스턴트에게 메시지 전송
  const sendMessageToAssistant = async (userMessage: string) => {
    try {
      // FastAPI 엔드포인트를 사용하여 메시지 전송
      const response = await api.post("/assistant/message", {
        content: userMessage,
      })

      if (response.data && response.data.content) {
        // 어시스턴트의 응답을 메시지에 추가
        const assistantMessage: Message = {
          id: Date.now().toString(),
          thread_id: "",
          sender_type: "assistant",
          content: response.data.content,
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // API 호출이 실패한 경우 대체 응답 추가
      const errorMessage: Message = {
        id: Date.now().toString(),
        thread_id: "",
        sender_type: "assistant",
        content: "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 메시지 전송 처리
  const handleSend = async () => {
    if (message.trim() === "" || isLoading) return

    // UI에 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      thread_id: "",
      sender_type: "user",
      content: message,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    const sentMessage = message
    setMessage("")
    setIsLoading(true)

    // 새 메시지를 보여주기 위해 맨 아래로 스크롤
    scrollViewRef.current?.scrollToEnd({ animated: true })

    // FastAPI 서버로 전송
    try {
      await sendMessageToAssistant(sentMessage)
    } catch (error) {
      console.error("Error in send message flow:", error)
      setIsLoading(false)
    }
  }

  // 표시용 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  // 메시지 그룹용 날짜 포맷
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // 날짜만 비교하기 위해 시간 초기화
    today.setHours(0, 0, 0, 0)
    yesterday.setHours(0, 0, 0, 0)
    const messageDate = new Date(date)
    messageDate.setHours(0, 0, 0, 0)

    if (messageDate.getTime() === today.getTime()) {
      return "오늘"
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "어제"
    } else {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    }
  }

  // 날짜 구분선을 표시할지 확인
  const shouldShowDateSeparator = (currentMessage: Message, previousMessage: Message | undefined) => {
    if (!previousMessage) return true

    const currentDate = new Date(currentMessage.created_at)
    const previousDate = new Date(previousMessage.created_at)

    return (
      currentDate.getFullYear() !== previousDate.getFullYear() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getDate() !== previousDate.getDate()
    )
  }

  // 사용자 운동 프로그램 가져오기
  const handleGetTrainingProgram = async () => {
    try {
      setIsLoading(true)

      // 사용자의 운동 프로그램 가져오기
      const response = await api.get("/assistant/user_train_program")

      if (response.data) {
        // 표시용 운동 프로그램 데이터 포맷
        const programDetails = formatTrainingProgram(response.data)

        // 어시스턴트 메시지로 추가
        const programMessage: Message = {
          id: Date.now().toString(),
          thread_id: "",
          sender_type: "assistant",
          content: programDetails,
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, programMessage])

        // 새 메시지를 보여주기 위해 맨 아래로 스크롤
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    } catch (error) {
      console.error("Error getting training program:", error)
      Alert.alert("오류", "운동 프로그램을 불러오는 중 문제가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 표시용 운동 프로그램 포맷
  const formatTrainingProgram = (program: any) => {
    if (!program) return "운동 프로그램이 없습니다."

    let formattedText = `📋 운동 프로그램 (${program.training_cycle_length}일 주기)\n\n`

    program.cycles.forEach((cycle: any) => {
      formattedText += `🔹 Day ${cycle.day_index}: ${cycle.exercise_type}\n`

      cycle.sets.forEach((set: any) => {
        formattedText += `  • ${set.focus_area}\n`

        set.exercises.forEach((exercise: any) => {
          const weightInfo = exercise.weight_type ? `${exercise.weight_value}${exercise.weight_type}` : "자체 무게"

          formattedText += `    - ${exercise.name}: ${exercise.sets}세트 x ${exercise.reps}${exercise.unit} (${weightInfo}, 휴식: ${exercise.rest}초)\n`
        })

        formattedText += "\n"
      })
    })

    formattedText += `📝 참고사항: ${program.notes}\n`

    return formattedText
  }

  // 메시지 아이템 렌더링
  const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined
    const showDateSeparator = shouldShowDateSeparator(item, previousMessage)

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>{formatMessageDate(item.created_at)}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, item.sender_type === "user" ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, item.sender_type === "user" ? styles.userText : styles.botText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, item.sender_type === "user" ? styles.userTimestamp : styles.botTimestamp]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </>
    )
  }

  // 페이지네이션용 로딩 인디케이터 렌더링
  const renderListHeader = () => {
    if (!isLoadingMore) return null

    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingMoreText}>이전 메시지 불러오는 중...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI 운동 코치</Text>
            <Text style={styles.headerSubtitle}>운동에 관한 질문을 해보세요</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={handleGetTrainingProgram}>
              <Text style={styles.headerButtonText}>운동 프로그램</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messagesContainer}
          renderItem={renderMessageItem}
          ListHeaderComponent={renderListHeader}
          onEndReached={() => {
            // 끝에 도달했을 때 더 로드할 필요가 없으므로 의도적으로 비워둠
            // 위에서 아래로 당길 때 더 로드함
          }}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
            />
          }
          onScroll={({ nativeEvent }) => {
            // 맨 위로 스크롤할 때 더 많은 메시지 로드
            if (nativeEvent.contentOffset.y <= 0 && hasMoreMessages && !isLoadingMore) {
              loadMoreMessages()
            }
          }}
          inverted={false} // 뒤집지 않음, 따라서 가장 오래된 메시지가 맨 위에 있음
          contentContainerStyle={styles.messagesContentContainer}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>AI가 응답을 생성 중입니다...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading || message.trim() === ""}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerButtonText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    padding: 16,
    paddingBottom: 32, // 하단에 추가 패딩
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: "white",
  },
  botText: {
    color: "black",
  },
  timestamp: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  botTimestamp: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
  },
  loadingMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginBottom: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.6)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    alignSelf: "flex-end",
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
})

export default ChatbotScreen