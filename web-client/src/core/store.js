import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useAppStore = defineStore('app', () => {
    const enrollments = reactive([])

    const fetchEnrollments = async (context) => {
        const student = context.rootGetters.studentId;
        const response = await fetch(`https://vue-http-demo-85e9e.firebaseio.com/requests/users/${student}.json`);
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch requests.');
            throw error;
        }

        const requests = [];

        for (const key in responseData) {
            const request = {
                id: key,
                enrollments: responseData[key].enrollments,
            };

        requests.push(request);
        }
        context.commit('setResponse', requests);
    }

    const setEnrollments = (payload) => {
        enrollments = payload;
    }

    return { enrollments, fetchEnrollments, setEnrollments }

})