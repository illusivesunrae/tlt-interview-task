import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useOfflineStore = defineStore('offline', () => {
  const activeClasses = ref([])
  const answers = ref([])
  const assignmentCompleted = ref()
  const defaults = ref([])
  const offlineMode = ref(import.meta.env.VITE_demo_mode === 'true')
  const previousAssignments = ref([])
  const questions = ref([])
  const quizContext = reactive({})
  const studentAssignmentAnswers = ref([])
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
        let quizArray = []
        let questionsArray = []
        let answersArray = []

        let contextObject = data.classes[classId].assignments[quizId]

        for (const [key, value] of Object.entries(contextObject)) {
          quizContext[key] = value
        }

        let classData = data.classes[classId].assignments[quizId].content

        for (const [key, value] of Object.entries(classData)) {
          questionsArray.push(value.question)

          for (const [answer, index] of Object.entries(value.answers)) {
            answersArray.push(index)
          }
        }

        // questions.value -> Proxy array ex. 0: "Who wrote the novel Dawn?"
        questions.value = questionsArray.flat()
        // answers.value -> Proxy array object  ex. 0: Object { content: "Octavia Butler", correct: true}
        answers.value = answersArray.flat()

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

        let contextObject = data.classes[classId].students[student].assignments[assignmentId]

        console.log(contextObject)

        for (const [key, value] of Object.entries(contextObject)) {
          quizContext[key] = value
        }

        let classData = data.classes[classId].assignments[assignmentId].content

        console.log(classData)

        // for (const [_, value] of Object.entries(classData)) {
        // }

        // studentAssignmentAnswers.value = dataArray

        // defaults.value = dataArray
      })
      .catch((error) => {
        // TODO: add error handling
      })

    // get(
    //   dbRef(database, `classes/${classId}/students/${student}/assignments/${assignmentId}/answers`),
    // ).then((snapshot) => {
    //   let dataArray = []
    //   if (snapshot.exists()) {
    //     snapshot.forEach((childSnapshot, index) => {
    //       dataArray.push(childSnapshot.val())
    //     })
    //   }

    //   studentAssignmentAnswers.value = dataArray

    //   defaults.value = dataArray
    // })
  }

  const fetchUpcomingAssignments = async (classId) => {
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

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

  return {
    activeClasses,
    answers,
    assignmentCompleted,
    defaults,
    offlineMode,
    previousAssignments,
    questions,
    quizContext,
    studentAssignmentAnswers,
    upcomingAssignments,
    checkIfAssignmentCompleted,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    fetchActiveClasses,
    fetchPreviousAssignments,
    fetchQuiz,
    fetchStudentAnswers,
    fetchUpcomingAssignments,
    returnRelatedAnswers,
    setDefaultSelections,
    showNextQuestion,
    showPreviousQuestion,
  }
})
