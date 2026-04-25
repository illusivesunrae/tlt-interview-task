import { get, ref as dbRef, set } from 'firebase/database'
import { db } from '@/firebase'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useQuizStore = defineStore('quiz', () => {
  const router = useRouter()

  const loading = ref(false)
  const database = db
  const defaults = ref([])
  const activeClasses = ref([])
  const upcomingAssignments = ref([])
  const previousAssignments = ref([])
  const studentAssignmentAnswers = ref([])
  const quizContext = reactive({})
  const answers = ref([])
  const quiz = ref([])
  const questions = ref([])
  const formData = ref([])

  const currentQuestion = reactive({
    index: 0,
  })
  const nextQuestion = reactive({
    index: 1,
  })
  const previousQuestion = reactive({
    index: null,
  })

  const setResponse = (type, payload) => {
    type = payload
  }

  const returnRelatedAnswers = (questionIndex) => {
    const startPoint = questionIndex * 4
    const endPoint = startPoint + 4

    return answers.value.slice(startPoint, endPoint)
  }

  const checkIfAssignmentCompleted = (classId, quizId) => {
    loading.value = true
    const student = localStorage.getItem('username')

    get(dbRef(database, `classes/${classId}/students/${student}/assignments/${quizId}/answers`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return true
        }

        return false
      })
      .catch((error) => {
        // TODO: add error handling
      })
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

  const fetchUpcomingAssignments = async (classId) => {
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

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

      studentAssignmentAnswers.value = dataArray
    })
  }

  const fetchQuiz = async (classId, quizId) => {
    loading.value = true

    get(dbRef(database, `classes/${classId}/assignments/${quizId}`))
      .then((snapshot) => {
        let dataObject = {}
        let quizArray = []
        let questionsArray = []
        let answersArray = []

        if (snapshot.exists()) {
          dataObject = snapshot.val()
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.key === 'content') {
              let classData = childSnapshot.val()

              for (const [_, value] of Object.entries(classData)) {
                quizArray.push(value)
                questionsArray.push(value.question)
                answersArray.push(value.answers)
              }
            }
          })
        }
        for (const [key, value] of Object.entries(dataObject)) {
          quizContext[key] = value
        }

        quiz.value = quizArray
        questions.value = questionsArray.flat()
        answers.value = answersArray.flat()

        setDefaultSelections()

        loading.value = false
      })
      .catch((error) => {})
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
    loading.value = true

    const student = localStorage.getItem('username')

    set(dbRef(database, `classes/${classId}/students/${student}/assignments/${quizId}`), {
      answers: defaults.value,
      grade: null,
    }).catch((error) => {
      // TODO: add error handling
    })

    loading.value = true

    router.push(0)
  }

  return {
    activeClasses,
    defaults,
    upcomingAssignments,
    previousAssignments,
    studentAssignmentAnswers,
    quizContext,
    quiz,
    questions,
    answers,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    setDefaultSelections,
    setResponse,
    checkIfAssignmentCompleted,
    fetchActiveClasses,
    fetchUpcomingAssignments,
    fetchPreviousAssignments,
    fetchQuiz,
    fetchStudentAnswers,
    showNextQuestion,
    showPreviousQuestion,
    returnRelatedAnswers,
    submitForm,
  }
})
