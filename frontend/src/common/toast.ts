import { toast as svelteToast } from "@zerodevx/svelte-toast";

export type ToastKind = 'info' | 'success' | 'error'

type ToastOptions = {
    id?: number,
    type?: ToastKind,
    duration?: number,
    dismissable?: boolean;
    message: string;
    pausable?: boolean;
    onPop?: () => void,
}

function show(options: ToastOptions) {
    const { type, message, onPop, ...rest } = options;

    let theme: Record<string, string | number> = {}

    switch (type) {
        case 'success':
            theme = {
                "--toastColor": "white",
                "--toastBackground": "#23ba5b",
                "--toastBarBackground": "#11823a",
                "--toastBarHeight": 0,
            }
            break;
        case 'error':
            theme = {
                "--toastColor": "white",
                "--toastBackground": "#de1709",
                "--toastBarBackground": "#5e0b05",
            }
            break;
        case 'info':
            break;
        default:
            break;
    }

    return svelteToast.push({
        ...rest,
        theme,
        onpop: onPop,
        msg: message,
    })
}

export default {
    show,
    error(options: Omit<ToastOptions, 'type'>) {
        show({ type: 'error', ...options })
    },
    success(options: Omit<ToastOptions, 'type'>) {
        show({ type: 'success', ...options })
    }
}