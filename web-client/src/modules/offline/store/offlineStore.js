import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useOfflineStore = defineStore('offline', () => {
  const activeClasses = ref([])
  const answers = ref([])
  const assignmentCompleted = ref()
  const correctAnswers = ref([])
  const currentTerm = ref(4268)
  const defaults = ref([])
  const formKey = ref(0)
  const offlineMode = ref(import.meta.env.VITE_demo_mode === 'true')
  const previousAssignments = ref([])
  const questions = ref([])
  const quizContext = reactive({})
  const studentAssignmentAnswers = ref([])
  const studentAssignmentGrade = ref(null)
  const upcomingAssignments = ref([])
  const upcomingCompletedAssignments = ref([])

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
    fetch('/data-restructured.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const student = localStorage.getItem('username')
        let dataArray = []

        let contextObject = data.students[student].classes

        for (const [key, value] of Object.entries(contextObject)) {
          if (value.term === currentTerm.value) {
            dataArray.push(key)
          }
        }
        activeClasses.value = dataArray
      })
      .then(() => {})
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchPreviousAssignments = async (classId) => {
    const endDate = new Date().toISOString()

    fetch('/data-restructured.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let dataArray = []
        let allPreviousAssignmentsArray = []

        let contextObject = data.classes[classId].assignments

        Object.keys(contextObject).forEach((_, index) => {
          const mergedData = {
            ...contextObject[index],
            classId: classId,
            id: index,
          }

          dataArray.push(mergedData)
        })

        dataArray.forEach((assignment) => {
          allPreviousAssignmentsArray = filterDates(null, endDate, assignment)
        })

        allPreviousAssignmentsArray.forEach((assignment) => {
          // For active classes, I want all assignments either previous in time or completion,
          // organized by most recent completion or due date
          // pass the student
          // get students current classes -> all assignments
          // remove assignments that are uncompleted and have a due date in the future
        })
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

  const fetchUpcomingAssignments = async () => {
    const student = localStorage.getItem('username')
    const startDate = new Date().toISOString()
    const endDate = new Date(new Date().getTime() + 35 * 24 * 60 * 60 * 1000).toISOString()

    fetch('/data-restructured.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const allUpcomingAssignmentsArray = []
        const upcomingAssignmentsWithSubmissionsArray = []
        let dataArray = []

        activeClasses.value.forEach((activeClass, index) => {
          let assignmentsObject = data.classes[activeClass].assignments

          Object.entries(assignmentsObject).forEach(([id, assignment]) => {
            const mergedData = {
              ...assignmentsObject[+id],
              classId: activeClass,
              index: +id,
            }

            dataArray.push(mergedData)

            if (assignment.submissions) {
              Object.entries(assignment.submissions).forEach((submission, index) => {
                if (submission[1].studentId === student) {
                  upcomingAssignmentsWithSubmissionsArray.push(mergedData)
                }
              })
            }
          })
        })
        allUpcomingAssignmentsArray.push(...filterDates(startDate, endDate, dataArray))
        const allUpcomingAssignmentsSet = new Set(allUpcomingAssignmentsArray)
        const upcomingAssignmentsWithSubmissionsSet = new Set(
          upcomingAssignmentsWithSubmissionsArray,
        )

        upcomingAssignments.value.push(
          ...allUpcomingAssignmentsSet.difference(upcomingAssignmentsWithSubmissionsSet),
        )

        upcomingCompletedAssignments.value.push(
          ...allUpcomingAssignmentsSet.intersection(upcomingAssignmentsWithSubmissionsSet),
        )
      })

      .catch((error) => {
        // TODO: add error handling
      })
  }

  const filterDates = (startDate = null, endDate, assignments) => {
    let allAssignmentsArray = []

    assignments.forEach((assignment, index) => {
      if (startDate) {
        if (
          startDate.localeCompare(assignment.dueDate) <= 0 &&
          endDate.localeCompare(assignment.dueDate) >= 0
        ) {
          allAssignmentsArray.push(assignment)
        } else {
          return
        }
      } else {
        if (endDate.localeCompare(assignment.dueDate) >= 0) {
          allAssignmentsArray.push(assignment)
        } else {
          return
        }
      }
    })

    return allAssignmentsArray
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
    currentTerm,
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
