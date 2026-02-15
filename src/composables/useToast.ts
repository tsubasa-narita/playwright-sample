import { ref } from 'vue';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const toasts = ref<Toast[]>([]);
let idCounter = 0;

export function useToast() {
    function show(message: string, type: Toast['type'] = 'info') {
        const id = idCounter++;
        const toast: Toast = { id, message, type };
        toasts.value.push(toast);

        setTimeout(() => {
            remove(id);
        }, 3000);
    }

    function remove(id: number) {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    return {
        toasts,
        show,
        remove
    };
}
