import QualifierError from "./_qualifierError"

export const webSocket = new WebSocket('ws://127.0.0.1:3003/auth/admin/authenticate')

webSocket.error = e => {
    QualifierError(e);
}

window.onbeforeunload = (e) => {
    if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
    }
}

webSocket.onclose = () => {
    webSocket.onclose = webSocket.onerror = webSocket.onopen = webSocket.onmessage = null;
}