import { useToast } from 'primevue/usetoast';

class MessageService {
    constructor() {
        this.toast = useToast();
    }

    showSuccess(msg, detail) {
        this.toast.add({ severity: 'success', summary: msg, detail: detail, life: 3000 });
    }

    showInfo(msg, detail) {
        this.toast.add({ severity: 'info', summary: msg, detail: detail, life: 3000 });
    }

    showWarn(msg, detail) {
        this.toast.add({ severity: 'warn', summary: msg, detail: detail, life: 3000 });
    }

    showError(msg, detail) {
        this.toast.add({ severity: 'error', summary: msg, detail: detail, life: 3000 });
    }
}

export default MessageService;