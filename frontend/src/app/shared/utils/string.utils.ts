import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Pega o valor digitado no input
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const isValid = regex.test(value);

    return isValid ? null : { cpfFormatInvalid: true };
  };
}