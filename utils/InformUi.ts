export const MsgBox = {
  info: async (message: string) => await showMessageBox(message, 'info'),
  success: async (message: string) => await showMessageBox(message, 'success'),
  warning: async (message: string) => await showMessageBox(message, 'warning'),
  error: async (message: string) => await showMessageBox(message, 'error'),
  debugError: async (error: unknown) => await showDebugError(error),
  confirmWarning: async (query: string, actionLabel?: string) =>
    await showConfirmMessageBox(query, 'warning', actionLabel),
}

type MsgBoxType = 'success' | 'info' | 'warning' | 'error'
async function showMessageBox(message: string, type: MsgBoxType) {
  await ElMessageBox.alert(message, {
    type: type,
    confirmButtonText: 'OK',
  })
}

async function showDebugError(error: unknown) {
  if (error instanceof Error) {
    await ElMessageBox.alert(error.message, error.name, {
      type: 'error',
      confirmButtonText: 'OK',
    })
  } else {
    await ElMessageBox.alert(String(error), 'Unspecified Error', {
      type: 'error',
      confirmButtonText: 'OK',
    })
  }
}

async function showConfirmMessageBox(query: string, type: MsgBoxType, actionLabel: string = 'OK') {
  try {
    await ElMessageBox.confirm(query, {
      confirmButtonText: actionLabel,
      type: type,
    })
  } catch (e) {
    return false
  }
  return true
}
