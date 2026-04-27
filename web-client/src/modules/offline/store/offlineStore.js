import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useOfflineStore = defineStore('offline', () => {
  const activeClasses = ref([])
  const answers = ref([])
  const assignmentCompleted = ref()
  const correctAnswers = ref([])
  const defaults = ref([])
  const formKey = ref(0)
  const offlineMode = ref(import.meta.env.VITE_demo_mode === 'true')
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
    const student = localStorage.getItem('username')

    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let classData = data.classes[classId].students[student].assignments[quizId].answers

        if (classData) {
          assignmentCompleted.value = true
        } else {
          assignmentCompleted.value = false
        }
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchActiveClasses = async () => {
    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const student = localStorage.getItem('username')
        let dataArray = []

        let contextObject = data.students[student].activeClasses

        for (const [key] of Object.entries(contextObject)) {
          dataArray.push(key)
        }
        activeClasses.value = dataArray
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchPreviousAssignments = async (classId) => {
    const endDate = new Date().toISOString()

    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let dataArray = []

        let contextObject = data.classes[classId].assignments

        Object.keys(contextObject).forEach((item, index) => {
          const mergedData = {
            ...contextObject[index],
            classId: classId,
            id: index,
          }

          dataArray.push(mergedData)
        })

        const filterDates = (item) => {
          if (endDate.localeCompare(item.dueDate) >= 0) {
            previousAssignments.value.push(item)
            return true
          }
          return false
        }

        dataArray.filter(filterDates)
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchQuiz = async (classId, quizId) => {
    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let questionsArray = []
        let answersArray = []
        let correctAnswersArray = []

        let contextObject = data.classes[classId].assignments[quizId]

        for (const [key, value] of Object.entries(contextObject)) {
          quizContext[key] = value
        }

        let classData = data.classes[classId].assignments[quizId].content

        for (const [key, value] of Object.entries(classData)) {
          questionsArray.push(value.question)

          for (const [answer, index] of Object.entries(value.answers)) {
            answersArray.push(index)

            if (index.correct === true) {
              correctAnswersArray.push(index.content)
            }
          }
        }

        // questions.value -> Proxy array ex. 0: "Who wrote the novel Dawn?"
        questions.value = questionsArray.flat()
        // answers.value -> Proxy array object  ex. 0: Object { content: "Octavia Butler", correct: true}
        answers.value = answersArray.flat()
        // correctAnswers.value -> Proxy array ex. 0: "Octavia Butler"
        correctAnswers.value = correctAnswersArray.flat()

        setDefaultSelections()
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchStudentAnswers = async (classId, assignmentId) => {
    const student = localStorage.getItem('username')

    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let dataArray = []

        let contextObject =
          data.classes[classId].students[student].assignments[assignmentId].answers

        for (const [key, value] of Object.entries(contextObject)) {
          dataArray.push(value)
        }

        studentAssignmentAnswers.value = dataArray

        defaults.value = dataArray
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchStudentAnswersLocal = async (classId, assignmentId) => {
    let dataArray = []

    const student = localStorage.getItem('username')

    const savedData = localStorage.getItem('quizData')
    const parsedData = JSON.parse(savedData)

    if (classId !== parsedData.classes[classId]) {
      return
    }

    let contextObject =
      parsedData.classes[classId].students[student].assignments[assignmentId].answers

    for (const [key, value] of Object.entries(contextObject)) {
      dataArray.push(value)
    }

    studentAssignmentAnswers.value = dataArray

    defaults.value = dataArray
  }

  const fetchStudentsGrade = async (classId, assignmentId) => {
    const student = localStorage.getItem('username')

    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let contextNumber = data.classes[classId].students[student].assignments[assignmentId].grade

        studentAssignmentGrade.value = contextNumber
      })
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchStudentsGradeLocal = async (classId, assignmentId) => {
    const student = localStorage.getItem('username')

    const savedData = localStorage.getItem('quizData')
    const parsedData = JSON.parse(savedData)

    let contextNumber =
      parsedData.classes[classId].students[student].assignments[assignmentId].grade

    studentAssignmentGrade.value = contextNumber
  }

  const fetchUpcomingAssignments = async (classId) => {
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getTime() + 35 * 24 * 60 * 60 * 1000).toISOString()

    fetch('/class-related-data.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let dataArray = []

        let contextObject = data.classes[classId].assignments

        Object.keys(contextObject).forEach((item, index) => {
          const mergedData = {
            ...contextObject[index + 1],
            classId: classId,
            id: item,
          }
          dataArray.push(mergedData)
        })

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
      .catch((error) => {
        // TODO: add error handling
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

    const formattedDefaults = JSON.stringify({ ...defaults.value })

    let quizData = `{"classes":{"${classId}":{"students":{"${student}":{"assignments":{"${quizId}":{"answers": ${formattedDefaults},"grade":${studentAssignmentGrade.value}}}}}}}}`

    localStorage.setItem('quizData', quizData)

    studentAssignmentGrade.value = true
  }

  return {
    activeClasses,
    answers,
    assignmentCompleted,
    defaults,
    formKey,
    offlineMode,
    previousAssignments,
    questions,
    quizContext,
    studentAssignmentAnswers,
    studentAssignmentGrade,
    upcomingAssignments,
    checkIfAssignmentCompleted,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    fetchActiveClasses,
    fetchPreviousAssignments,
    fetchQuiz,
    fetchStudentAnswers,
    fetchStudentAnswersLocal,
    fetchStudentsGrade,
    fetchStudentsGradeLocal,
    fetchUpcomingAssignments,
    returnRelatedAnswers,
    setDefaultSelections,
    showNextQuestion,
    showPreviousQuestion,
    submitForm,
  }
})
