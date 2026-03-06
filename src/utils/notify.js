let notifyRef = null
let queue = []

export function setNotify(ref) {
  notifyRef = ref

  queue.forEach((n) => notifyRef.show(n.message, n.type))
  queue = []
}

function send(message, type) {
  if (!notifyRef) {
    queue.push({ message, type })
    return
  }

  notifyRef.show(message, type)
}

export function notifySuccess(message) {
  send(message, 'success')
}

export function notifyError(message) {
  send(message, 'error')
}

export function notifyWarning(message) {
  send(message, 'warning')
}

export function notifyInfo(message) {
  send(message, 'info')
}
