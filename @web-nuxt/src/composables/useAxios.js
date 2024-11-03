import axios from 'axios'

export const fetchXsrfCookie = async () => {
    const config = useRuntimeConfig();

    await axios.get(`${config.public.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true, withXSRFToken: true });
}

export const useAxios = () => {
    const config = useRuntimeConfig();
    const baseURL = config.public;

    const apiClient = axios.create({
        baseURL: config.public.apiUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        withXSRFToken: true
    })

    apiClient.interceptors.request.use(
        (request) => request,
        (error) => Promise.reject(error)
    )

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => Promise.reject(error)
    )

    return apiClient
}
