import { get, ref as dbRef, set } from 'firebase/database'
import { db } from '@/firebase'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const loading = ref(false)
  const activeClasses = ref([])
  const answers = ref([])
  const assignmentCompleted = ref()
  const correctAnswers = ref([])
  const database = db
  const defaults = ref([])
  const formKey = ref(0)
  const previousAssignments = ref([])
  const questions = ref([])
  const quizContext = reactive({})
  const studentAssignmentAnswers = ref([])
  const studentAssignmentGrade = ref(null)
  const upcomingAssignments = ref([])

  const currentQuestion = reactive({
    index: 0,
  })
  const nextQuestion = reactive({
    index: 1,
  })
  const previousQuestion = reactive({
    index: null,
  })

  const calculateScore = () => {
    const testAnswers = new Set(correctAnswers.value)
    const studentAnswers = new Set(defaults.value)

    const incorrectAnswers = studentAnswers.intersection(testAnswers)
    return +((incorrectAnswers.size / testAnswers.size) * 100).toFixed(2)
  }

  const checkIfAssignmentCompleted = (classId, quizId) => {
    loading.value = true
    const student = localStorage.getItem('username')

    get(dbRef(database, `classes/${classId}/students/${student}/assignments/${quizId}/answers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          assignmentCompleted.value = true
        }
      })
      .catch((error) => {
        // TODO: add error handling
      })

    assignmentCompleted.value = false
  }

  const fetchActiveClasses = async () => {
    const student = localStorage.getItem('username')

    get(dbRef(database, `/students/${student}`)).then((snapshot) => {
      let dataArray = []

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.key === 'activeClasses') {
            let classData = childSnapshot.val()

            for (const [key] of Object.entries(classData)) {
              dataArray.push(key)
            }
          }
        })
      }
      activeClasses.value = dataArray
    })
  }

  const fetchPreviousAssignments = async (classId) => {
    const endDate = new Date().toISOString()

    get(dbRef(database, `classes/${classId}/assignments`)).then((snapshot) => {
      let dataArray = []
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot, index) => {
          const mergedData = {
            ...childSnapshot.val(),
            classId: classId,
            id: childSnapshot.key,
          }

          dataArray.push(mergedData)
        })
      }
      const filterDates = (item) => {
        if (endDate.localeCompare(item.dueDate) >= 0) {
          previousAssignments.value.push(item)
          return true
        }
        return false
      }
      dataArray.filter(filterDates)
    })
  }

  const fetchQuiz = async (classId, quizId) => {
    loading.value = true

    get(dbRef(database, `classes/${classId}/assignments/${quizId}`))
      .then((snapshot) => {
        let dataObject = {}
        let questionsArray = []
        let answersArray = []
        let correctAnswersArray = []

        if (snapshot.exists()) {
          dataObject = snapshot.val()
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.key === 'content') {
              let classData = childSnapshot.val()

              for (const [key, value] of Object.entries(classData)) {
                questionsArray.push(value.question)
                answersArray.push(value.answers)

                value.answers.forEach((type, tag) => {
                  if (type.correct === true) {
                    correctAnswersArray.push(type.content)
                  }
                })
              }
            }
          })
        }
        for (const [key, value] of Object.entries(dataObject)) {
          quizContext[key] = value
        }

        // questions.value -> Proxy array ex. 0: "Who wrote the novel Dawn?"
        questions.value = questionsArray.flat()
        // answers.value -> Proxy array object  ex. 0: Object { content: "Octavia Butler", correct: true}
        answers.value = answersArray.flat()
        // correctAnswers.value -> Proxy array ex. 0: "Octavia Butler"
        correctAnswers.value = correctAnswersArray.flat()

        setDefaultSelections()

        loading.value = false
      })
      .catch((error) => {})
  }

  const fetchStudentAnswers = async (classId, assignmentId) => {
    const student = localStorage.getItem('username')

    get(
      dbRef(database, `classes/${classId}/students/${student}/assignments/${assignmentId}/answers`),
    ).then((snapshot) => {
      let dataArray = []
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot, index) => {
          dataArray.push(childSnapshot.val())
        })
      }

      // studentAssignmentAnswers.value -> Proxy array ex. 0: "Octavia Butler"
      studentAssignmentAnswers.value = dataArray
      defaults.value = dataArray
    })
  }

  const fetchStudentsGrade = async (classId, assignmentId) => {
    const student = localStorage.getItem('username')

    get(
      dbRef(database, `classes/${classId}/students/${student}/assignments/${assignmentId}/grade`),
    ).then((snapshot) => {
      let data
      if (snapshot.exists()) {
        data = snapshot.val()
      }

      studentAssignmentGrade.value = data
    })
  }

  const fetchUpcomingAssignments = async (classId) => {
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getTime() + 35 * 24 * 60 * 60 * 1000).toISOString()

    get(dbRef(database, `classes/${classId}/assignments`)).then((snapshot) => {
      let dataArray = []
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot, index) => {
          const mergedData = {
            ...childSnapshot.val(),
            classId: classId,
            id: childSnapshot.key,
          }

          dataArray.push(mergedData)
        })
      }
      const filterDates = (item) => {
        if (
          startDate.localeCompare(item.dueDate) <= 0 &&
          endDate.localeCompare(item.dueDate) >= 0
        ) {
          upcomingAssignments.value.push(item)
          return true
        }
        return false
      }
      dataArray.filter(filterDates)
    })
  }

  const returnRelatedAnswers = (questionIndex) => {
    const startPoint = questionIndex * 4
    const endPoint = startPoint + 4

    return answers.value.slice(startPoint, endPoint)
  }

  const setDefaultSelections = () => {
    // get all questions, loop through
    let answerLoop = ref([])

    questions.value.forEach((question, index) => {
      // get each set of answers
      for (let i = 0; i < 1; i++) {
        answerLoop.value.push(returnRelatedAnswers(index))
      }
    })

    // for each set, set the first answer as the default
    answerLoop.value.forEach((answer, index) => {
      defaults.value.push(answer[0].content)
    })
  }

  const showNextQuestion = () => {
    previousQuestion.index = currentQuestion.index
    nextQuestion.index = currentQuestion.index + 2
    currentQuestion.index += 1

    if (questions.value[previousQuestion.index] === undefined) {
      previousQuestion.index = null
    }

    if (questions.value[nextQuestion.index] === undefined) {
      nextQuestion.index = null
    }
  }

  const showPreviousQuestion = () => {
    previousQuestion.index = currentQuestion.index - 2
    nextQuestion.index = currentQuestion.index
    currentQuestion.index -= 1

    if (questions.value[previousQuestion.index] === undefined) {
      previousQuestion.index = null
    }

    if (questions.value[nextQuestion.index] === undefined) {
      nextQuestion.index = null
    }
  }

  const submitForm = (classId, quizId) => {
    const student = localStorage.getItem('username')

    studentAssignmentGrade.value = calculateScore()

    set(dbRef(database, `classes/${classId}/students/${student}/assignments/${quizId}`), {
      answers: defaults.value,
      grade: studentAssignmentGrade.value,
    }).catch((error) => {
      // TODO: add error handling
    })
  }

  return {
    activeClasses,
    answers,
    assignmentCompleted,
    defaults,
    formKey,
    previousAssignments,
    questions,
    quizContext,
    upcomingAssignments,
    studentAssignmentAnswers,
    studentAssignmentGrade,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    setDefaultSelections,
    checkIfAssignmentCompleted,
    fetchActiveClasses,
    fetchUpcomingAssignments,
    fetchPreviousAssignments,
    fetchQuiz,
    fetchStudentAnswers,
    fetchStudentsGrade,
    showNextQuestion,
    showPreviousQuestion,
    returnRelatedAnswers,
    submitForm,
  }
})
