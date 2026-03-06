let confirmRef = null

export function setConfirm(ref) {
  confirmRef = ref
}

export function confirmDialog(title, message) {
  if (!confirmRef) {
    console.warn('Confirm dialog não inicializado')
    return Promise.resolve(false)
  }

  return confirmRef.show(title, message)
}
