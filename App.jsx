import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen'; // Assuming you have a SplashScreen component
import QuizScreen from './screens/QuizScreen';

const Stack = createNativeStackNavigator();
const quiz_id=1;
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3-second splash screen
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QuizScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="QuizScreen" 
          component={QuizScreen} 
          initialParams={{ quiz_id }} // Pass params here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
