export function updateCcDetails(details) {
  return {
    type: 'UPDATE_CC_DETAILS',
    payload: details,
  };
}

export function updateFocusedField(field) {
  return {
    type: 'UPDATE_FOCUSED_FIELD',
    payload: field,
  };
}

export function updateFieldError(error) {
  return {
    type: 'UPDATE_FIELD_ERROR',
    payload: error,
  };
}

export function clickedSubmitButton(status) {
  return {
    type: 'CLICKED_SUBMIT_BUTTON',
    payload: status,
  };
}
