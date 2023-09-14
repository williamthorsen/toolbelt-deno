/**
 * Validates that the given text has matching opening and closing delimiters.
 * TODO: Add support for multicharacter delimiters.
 */
export function validateDelimiters(text: string, params: Params): ValidationResult {
  const { opening, closing } = params;

  if (opening === closing) {
    throw new Error('Opening and closing delimiters must be different.');
  }

  let openedCount = 0;
  for (const char of text) {
    if (char === opening) {
      openedCount++;
    } else if (char === closing) {
      if (openedCount === 0) {
        return {
          isValid: false,
          errors: [{
            code: 'UNMATCHED_CLOSING_DELIMITER',
            message: `Text has unmatched closing delimiter "${closing}".`,
          }],
        };
      }
      openedCount--;
    }
  }

  if (openedCount !== 0) {
    return {
      isValid: false,
      errors: [{
        code: 'UNMATCHED_OPENING_DELIMITER',
        message: `Text has unmatched opening delimiter "${opening}".`,
      }],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

interface Params {
  opening: string;
  closing: string;
}

interface ValidationError {
  code: 'UNMATCHED_OPENING_DELIMITER' | 'UNMATCHED_CLOSING_DELIMITER';
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
