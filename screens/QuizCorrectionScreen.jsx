import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Fetch quiz correction
const fetchQuizCorrection = async (quizId, studentId) => {
    try {
        const response = await fetch(`/api/result/quiz-correction/${quizId}/${studentId}`);
        const data = await response.json();
       
        if (response.ok) {
            return data; // The student's answers and corrections
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching quiz correction:', error);
    }
};

const QuizCorrectionScreen = ({ quizId, studentId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCorrection, setQuizCorrection] = useState(null);

  // Fetch quiz correction when the component mounts
  useEffect(() => {
    const getQuizCorrection = async () => {
      const data = await fetchQuizCorrection(quizId, studentId);
      if (data) {
        setQuizCorrection(data);
      }
    };

    getQuizCorrection();
  }, [quizId, studentId]);

  if (!quizCorrection) {
    return (
      <View style={styles.container}>
        <Text>Loading correction...</Text>
      </View>
    );
  }

  const question = quizCorrection.questions[currentQuestion];
  const selectedAnswer = quizCorrection.userAnswers[question.id];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Quiz 05 : Generalities</Text>
      </View>
      <Text style={styles.Text}>Correction of the Quiz</Text>

      {/* Question Progress Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            {quizCorrection.questions.map((q, index) => {
              const isCorrect = quizCorrection.userAnswers[q.id] === q.correctAnswer;
              return (
                <View 
                  key={q.id} 
                  style={[
                    styles.progressItem, 
                    isCorrect ? styles.correctAnswer : styles.wrongAnswer
                  ]}
                >
                  <Text style={styles.progressText}>{q.id}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={[styles.questionBox, isCorrect ? styles.correctBox : styles.wrongBox]}>
        <Text style={styles.questionText}>Question 0{question.id}</Text>
        <Text style={styles.question}>{question.question}</Text>
        <Text style={styles.questionText2}>Choose an answer</Text>
        <Text style={isCorrect ? styles.correctText : styles.wrongText}>
          {isCorrect ? 'Correct' : 'Wrong'}
        </Text>
      </View>

      {question.options.map((option, index) => {
        const isSelected = option === selectedAnswer;
        const isCorrectOption = option === question.correctAnswer;

        return (
          <View
            key={index}
            style={[
              styles.option,
              isSelected ? (isCorrect ? styles.correct : styles.wrong) : isCorrectOption ? styles.correct : styles.neutral
            ]}
          >
            <View style={[styles.optionLetter, styles[`optionLetter${index}`]]}>
              <Text style={styles.letterText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </View>
        );
      })}

      <View style={styles.navigation}>
        {currentQuestion > 0 && (
          <TouchableOpacity onPress={() => setCurrentQuestion(currentQuestion - 1)} style={styles.button0}>
            <Text style={styles.buttonText1}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestion < quizCorrection.questions.length - 1 ? (
          <TouchableOpacity 
            onPress={() => setCurrentQuestion(currentQuestion + 1)} 
            style={[styles.button1, currentQuestion === 0 && styles.firstQuestionButton]}
          >
            <Text style={styles.buttonText2}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.buttonText1}>End</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};