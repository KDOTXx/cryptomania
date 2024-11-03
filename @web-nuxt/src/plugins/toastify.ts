
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const toast = useToast();

export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast,
        }
    }
});