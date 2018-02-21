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
