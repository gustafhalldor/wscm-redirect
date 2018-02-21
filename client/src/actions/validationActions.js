export default function addValidationError(error) {
  return {
    type: 'ADD_VALIDATION_ERROR',
    payload: error,
  };
}
