export function addValidationError(error) {
  return {
    type: 'ADD_VALIDATION_ERROR',
    payload: error,
  };
}

export function resetValidation() {
  return {
    type: 'RESET_VALIDATION',
  };
}
