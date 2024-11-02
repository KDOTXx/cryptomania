import axios from 'axios'
import { useRuntimeConfig } from '#app'

export const useAxios = () => {
    const config = useRuntimeConfig()

    const apiClient = axios.create({
        baseURL: config.public.apiBase,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })

    apiClient.interceptors.request.use(
        (request) => {
            return request
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    apiClient.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    return apiClient
}
