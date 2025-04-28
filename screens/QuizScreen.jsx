import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizScreen = ({ navigation, route }) => {
  // Assuming quiz_id is passed via navigation params
  const { quiz_id } = route.params;
  const [question_text, setquestion_text] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [duration, setduration] = useState(0); // duration will now be dynamic
  const [title, setTitle] = useState(''); // State to store the quiz title
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJiZW5hbGlfc2FyYUBlc2kuZHoiLCJpYXQiOjE3NDU4NTAyNDQsImV4cCI6MTc0NjE3NDI0NH0.hRQxx6wHCwzjNr02NP6AV_6LE22GBZzpXU3A88fU2oE';
  useEffect(() => {
    const interval = setInterval(() => {
      setduration((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Fetch quiz question_text with answers, title, and duration
  const fetchQuizquestion_textWithAnswers = async (quiz_id) => {
    try {
      const response = await fetch(`http://172.20.10.12:7000/api/result/quiz/${quiz_id}/questions`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      console.log('Données du quiz récupérées:', data);
      return data;
  } catch (error) {
      console.error('Erreur fetchquestion_textWithAnswers:', error.message);
      return error;
  }
}

  useEffect(() => {
    if (quiz_id) {
      fetchQuizquestion_textWithAnswers(quiz_id); // Fetch question_text when the component mounts
    }
  }, [quiz_id]);

  const handleAnswer = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text> {/* Display the title fetched from the backend */}
      </View>
      
      {/* Title */}
      <Text style={styles.Text}>My Quiz</Text>

      {/* Question Progress Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            {question_text.map((q, index) => (
              <View key={q.id} style={[styles.progressItem, selectedAnswers[index] ? styles.answered : {}]}>
                <Text style={styles.progressText}>{q.id}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* duration */}
      <Text style={styles.duration}>{formatTime()}</Text>

      {/* Question Box */}
      <View style={styles.questionBox}>
        {question_text.length > 0 && (
          <>
            <Text style={styles.questionText}>Question 0{question_text[currentQuestionIndex].id}</Text>
            <Text style={styles.question}>{question_text[currentQuestionIndex].question}</Text>
            <Text style={styles.questionText2}>Choose an answer</Text>

            {/* Answer Options */}
            {question_text[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionContainer, selectedAnswers[currentQuestionIndex] === option ? styles.selectedOption : {}]}
                onPress={() => handleAnswer(option)}
              >
                <View style={[styles.optionLetter, styles[`optionLetter${index}`]]}>
                  <Text style={styles.letterText}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} style={[styles.button, styles.previousButton]}>
            <Text style={styles.buttonText1}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            if (currentQuestionIndex < question_text.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
              alert('Quiz Finished!');
            }
          }}
          style={[
            styles.button,
            currentQuestionIndex === question_text.length - 1 ? styles.submitButton : {},
            currentQuestionIndex === 0 ? styles.firstNextButton : {},
          ]}
        >
          <Text style={styles.buttonText2}>{currentQuestionIndex === question_text.length - 1 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff',bottom:-30 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menu: { fontSize: 24, fontWeight: 'bold', marginRight: 10 },
  title: { fontSize: 20, fontWeight: 'bold'},
  progressBar: { flexDirection: 'row', justifyContent: 'center' },
  progressItem: { 
    width: 30, height: 30, borderRadius: 0, marginLeft:0,marginRight:0,
    backgroundColor: '#184F78', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' 
  },
  answered: { backgroundColor: '#FEDC62' },
  progressText: { fontSize:18,fontWeight: 'bold', color: '#000' },
  duration: { fontSize: 20, fontWeight: 'bold', color: '#FEDC62', textAlign: 'left', marginBottom: -5,left:10 ,top:10},
  questionBox: { 
    backgroundColor: '#fff', padding: 40, borderRadius: 20, shadowColor: 'rgb(160, 162, 164,1)',weight:900,height:180,top:40,width:350,alignSelf:'center',
    shadowOffset: { width: 4, height: 100}, // Drop shadow direction
    shadowOpacity: -100, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 20, // Required for Android
  },
  questionText: { fontSize: 24, fontWeight: 'bold', marginBottom: 15,top:-10,left:-10 },
  questionText2: { fontSize: 20, fontWeight: 'medium', marginBottom: 10,color:' rgb(173, 168, 168)',left:-10},

  question: { fontSize: 20, color: '#000',fontWeight: 'light', marginBottom: 10 ,left:-10},
  option: {
    padding: 15, borderRadius: 8, borderWidth: 1, Color:' rgba(191, 200, 236, 0.2)', marginTop: 50, alignItems: 'center', marginBottom: -30
  },
  selectedOption: { backgroundColor: '#FEDC62', borderColor: '#FEDC62' },
  optionText: { fontSize: 16, color: '#000', textAlign:'center' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: '#184F78', padding:10,borderRadius: 10 ,top:400,width:162,
    backgroundColor: 'rgba(24, 79, 120, 1)',  // Light blue color
    shadowColor: '#184F78',  // Shadow color
    shadowOffset: { width: 4, height: 4 }, // Drop shadow direction
    shadowOpacity: 0.3, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 5, // Required for Android
    borderRadius: 10, // Optional for rounded corners
  },
  buttonText2: { color: '#fff', fontSize: 18, fontWeight: 'bold' ,textAlign:'center'},
  buttonText1: { color: '#184F78', fontSize: 18, fontWeight: 'bold' ,textAlign:'center'},

  Text: { color: '000', fontSize: 27, fontWeight: 'bold' ,textAlign:'center',marginBottom:10 ,fontFamily:'poppins'},
  underProgressBar: { backgroundColor: '#4f46e5', height: 30, marginTop: -0 },
  submitButton: { backgroundColor: '#FEDC62' }, // Yellow for Submit
  previousButton: { backgroundColor: 'rgba(24, 79, 120, 0.2)' ,
    shadowColor: '#184F78',  // Shadow color
    shadowColor: '#184F78',  // Shadow color
    shadowOffset: { width: 4, height: 4 }, // Drop shadow direction
    shadowOpacity: 0.3, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 14, // Required for Android
    borderRadius: 10, // Optional for rounded corners
  }, // Light blue for Previous
  firstNextButton: { left:210 }, // Alignement à droite pour la première question
  optionContainer: {alignSelf:'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, marginBottom: 25,bottom:-70,width:330 },
  optionLetter: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  optionLetter0: { backgroundColor: '#5B3277',
    shadowColor: '#EB107E', // Adjust color for a soft glow (change per color)
    shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
   },
  optionLetter1: { backgroundColor: '#196F3D' , 
    
    shadowColor: '#277937', // Adjust color for a soft glow (change per color)
    shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
  },
  optionLetter2: { backgroundColor: '#FEDC62',
  shadowColor:'#F1AC20' ,
  shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
  },
  letterText: { color: '#fff', fontWeight:'900' , fontSize: 16 },
  progressBarWrapper: {
    height:30,
    borderRadius:90,
    backgroundColor: '#184F78', // Couleur du rectangle en dessous
    paddingVertical: -20,
    marginBottom: 20,
  },
  
});

export default QuizScreen;