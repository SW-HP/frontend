import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExerciseScreen from "../screens/ExerciseScreen"
import AnalyzeScreen from "../screens/AnalyzeScreen"
import ChatbotScreen from "../screens/ChatbotScreen"

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Exercise: undefined;
    Analyze: undefined
    Chatbot: undefined
  };

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '홈 화면' }}
      />
      <Stack.Screen 
      name="Exercise" 
      component={ExerciseScreen} 
      options={{ title: "운동 진행" }} />
      <Stack.Screen 
      name="Analyze" 
      component={AnalyzeScreen} 
      options={{ title: "체형 분석" }} />
      <Stack.Screen 
      name="Chatbot" 
      component={ChatbotScreen} 
      options={{ title: "AI 챗봇" }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;