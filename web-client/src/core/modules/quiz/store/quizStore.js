import { child, endAt, get, orderByChild, query, ref as dbRef, startAt } from "firebase/database";
import { db } from "@/firebase";
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';


export const useQuizStore = defineStore('quiz', () => {
    const database = db;
    const activeClasses = ref([])
    const upcomingAssignments = ref([])
    const previousAssignments = ref([])
    const studentAssignmentAnswers = ref([])
    const quizContext = reactive({})
    const answers = ref([])
    const quiz = ref([])
    const questions = ref([])

    const currentQuestion = reactive({
        index: null
    })
    const nextQuestion = reactive({
        index: null
    })
    const previousQuestion = reactive({
        index: null
    })

    const setResponse = (type, payload) => {
        type = payload;
    }

    const returnRelatedAnswers = (questionIndex, allAnswers) => {
        const startPoint = questionIndex * 4;
        const endPoint = startPoint + 4;

        return allAnswers.slice(startPoint, endPoint);
    }

    const fetchActiveClasses = async () => {
        const student = localStorage.getItem('username');

        get(dbRef(database, `/students/${student}`)).then((snapshot) => {
            let dataArray = [];

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key === 'activeClasses') {
                        let classData = childSnapshot.val();

                        for (const [key] of Object.entries(classData)) {
                            dataArray.push(key);
                        }
                    }
                });
            }
            activeClasses.value = dataArray;
        });
    }

    const fetchUpcomingAssignments = async (classId) => {
        const startDate = new Date().toISOString();
        const endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        get(dbRef(database, `classes/${classId}/assignments`)).then((snapshot) => {
            let dataArray = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot, index) => {

                    const mergedData = {
                        ...childSnapshot.val(),
                        'classId': classId,
                        id: childSnapshot.key
                    }

                    dataArray.push(mergedData);
                });
            }
            const filterDates = (item) => {
                if (startDate.localeCompare(item.dueDate) <= 0 && endDate.localeCompare(item.dueDate) >= 0) {
                    upcomingAssignments.value.push(item);
                    return true;
                }
                return false;
            }
            dataArray.filter(filterDates)
        });
    }

    const fetchPreviousAssignments = async (classId) => {
        const endDate = new Date().toISOString();

        get(dbRef(database, `classes/${classId}/assignments`)).then((snapshot) => {
            let dataArray = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot, index) => {

                    const mergedData = {
                        ...childSnapshot.val(),
                        'classId': classId,
                        id: childSnapshot.key
                    }

                    dataArray.push(mergedData);
                });
            }
            const filterDates = (item) => {
                if (endDate.localeCompare(item.dueDate) >= 0) {
                    previousAssignments.value.push(item);
                    return true;
                }
                return false;
            }
            dataArray.filter(filterDates)
        });
    }

    const fetchStudentAnswers = async (classId, assignmentId) => {
        const student = localStorage.getItem('username');

        get(dbRef(database, `classes/${classId}/students/${student}/assignments/${assignmentId}/answers`)).then((snapshot) => {
            let dataArray = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot, index) => {
                    dataArray.push(childSnapshot.val());
                });
            }
            
            studentAssignmentAnswers.value = dataArray;
            console.log(dataArray)
        });
    }

    const fetchQuiz = async (classId, quizId) => {

        get(dbRef(database, `classes/${classId}/assignments/${quizId}`)).then((snapshot) => {
            let dataObject = {};
            let quizArray = [];
            let questionsArray = [];
            let answersArray = [];

            if (snapshot.exists()) {
                dataObject = snapshot.val();
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key === 'content') {
                        let classData = childSnapshot.val();

                        for (const [key, value] of Object.entries(classData)) {
                            quizArray.push(value)
                            questionsArray.push(value.question)
                            answersArray.push(value.answers)

                        }
                    }
                });
            }
            for (const [key, value] of Object.entries(dataObject)) {
                quizContext[key] = value;
            }

            quiz.value = quizArray;
            questions.value = questionsArray.flat();
            answers.value = answersArray.flat();
        });
    }

    const showNextQuestion = (currentIndex) => {
        currentQuestion.index = currentIndex + 1;
        previousQuestion.index = currentIndex;
        nextQuestion.index = currentIndex + 2;

        if (questions.value[previousQuestion.index] === undefined) {
            previousQuestion.index = null;
        }

        if (questions.value[nextQuestion.index] === undefined) {
            nextQuestion.index = null;
        }
    }

    const showPreviousQuestion = (currentIndex) => {
        currentQuestion.index = currentIndex - 1;
        previousQuestion.index = currentIndex - 2;
        nextQuestion.index = currentIndex;

        if (questions.value[previousQuestion.index] === undefined) {
            previousQuestion.index = null;
        }

        if (questions.value[nextQuestion.index] === undefined) {
            nextQuestion.index = null;
        }
    }

    const setInitialQuestion = (currentIndex) => {
        currentQuestion.index = currentIndex;
        previousQuestion.index = currentIndex - 1;
        nextQuestion.index = currentIndex + 1;

        if (questions.value[previousQuestion.index] === undefined) {
            previousQuestion.index = null;
        }

        if (questions.value[nextQuestion.index] === undefined) {
            nextQuestion.index = null;
        }
    }

    return { activeClasses, upcomingAssignments, previousAssignments, studentAssignmentAnswers, quizContext, quiz, questions, answers, currentQuestion, nextQuestion, previousQuestion, setResponse, fetchActiveClasses, fetchUpcomingAssignments, fetchPreviousAssignments, fetchQuiz, fetchStudentAnswers, showNextQuestion, showPreviousQuestion, setInitialQuestion, returnRelatedAnswers }

})