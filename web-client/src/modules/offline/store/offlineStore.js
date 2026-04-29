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
        // use data to set activeClasses.value
        const student = localStorage.getItem('username')
        let dataArray = []

        // get all classes that the student is currently taking
        let contextObject = data?.students?.[student]?.classes

        for (const [key, value] of Object.entries(contextObject)) {
          if (value?.term === currentTerm.value) {
            dataArray.push(+key)
          }
        }
        activeClasses.value = dataArray
      })
      .then(() => {})
      .catch((error) => {
        // TODO: add error handling
      })
  }

  const fetchDashboard = async () => {
    const student = localStorage.getItem('username')
    const oneMonthFromNow = new Date(new Date().getTime() + 35 * 24 * 60 * 60 * 1000).toISOString()

    fetch('/data-restructured.json')
      .then((response) => {
        return response.json()
      })
      // create upcoming assignments for the dashboard
      .then((data) => {
        // use data to set upcomingAssignments.value
        // then pass relevant data used to portion for
        let allUpcomingAssignmentsArray = []
        let upcomingAssignmentsWithSubmissionsArray = []
        let dataArray = []
        let classArray = []

        activeClasses.value.forEach((activeClass, index) => {
          // get classObject for providing courseId and class topic
          let classObject = data?.classes?.[activeClass]

          // get all assignments for the classes that the student is currently taking
          let assignmentsObject = data?.classes?.[activeClass]?.assignments

          Object.entries(assignmentsObject).forEach(([id, assignment]) => {
            // for each assignment get the object, include a classId and an index
            const mergedData = {
              ...assignmentsObject[+id],
              courseTopic: classObject.topic,
              courseId: classObject.courseId,
              classId: activeClass,
              index: +id,
            }

            dataArray.push(mergedData)

            if (assignment.submissions) {
              Object.entries(assignment?.submissions).forEach((submission, index) => {
                // if the assignment has submissions attached, check to see if the current student already submitted it
                if (submission[1]?.studentId === student) {
                  upcomingAssignmentsWithSubmissionsArray.push(mergedData)
                }
              })
            }
          })
        })

        // filter out any past due assignments
        // sets future assignments inclusive of today
        allUpcomingAssignmentsArray.push(...filterDates(dataArray, oneMonthFromNow))

        const allUpcomingAssignmentsSet = new Set(
          allUpcomingAssignmentsArray.sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          ),
        )

        const upcomingAssignmentsWithSubmissionsSet = new Set(
          upcomingAssignmentsWithSubmissionsArray.sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          ),
        )

        upcomingAssignments.value.push(
          // if any upcoming assignments have already been submitted, remove them
          ...allUpcomingAssignmentsSet.difference(upcomingAssignmentsWithSubmissionsSet),
        )

        // create an object with the applicable data for the previous assignments handler
        const assignments = {
          allAssignments: dataArray,
          completedAssignments: upcomingAssignmentsWithSubmissionsArray,
        }

        return assignments
      })
      // create previous assignments for the dashboard
      .then((assignments) => {
        // use assignments object from previous portion to set previousAssignments.value
        let allPreviousAssignmentsArray = []

        // filter out any assignments due today or in the future
        // sets past assignments exclusive of today
        allPreviousAssignmentsArray.push(...filterDates(assignments.allAssignments))

        const allPreviousAssignmentsSet = new Set(
          allPreviousAssignmentsArray.sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          ),
        )

        const upcomingCompletedAssignmentsSet = new Set(
          assignments.completedAssignments.sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          ),
        )

        previousAssignments.value.push(
          // if any upcoming assignments have already been submitted, include them
          ...allPreviousAssignmentsSet.union(upcomingCompletedAssignmentsSet),
        )
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

  const filterDates = (assignments, endDate = null) => {
    let allAssignmentsArray = []

    const today = new Date().toISOString()

    assignments.forEach((assignment, index) => {
      if (endDate !== null) {
        if (
          // if the due date is on or after today
          assignment.dueDate.localeCompare(today) >= 0 &&
          // if the due date is before a month from now
          assignment.dueDate.localeCompare(endDate) < 0
        ) {
          allAssignmentsArray.push(assignment)
        } else {
          return
        }
      } else {
        // if end date is before due date
        if (assignment.dueDate.localeCompare(today) < 0) {
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
    fetchDashboard,
    fetchQuiz,
    fetchStudentAnswers,
    fetchStudentAnswersLocal,
    fetchStudentsGrade,
    fetchStudentsGradeLocal,
    returnRelatedAnswers,
    setDefaultSelections,
    showNextQuestion,
    showPreviousQuestion,
    submitForm,
  }
})
