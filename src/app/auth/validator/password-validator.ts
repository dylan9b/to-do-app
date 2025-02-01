import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('reTypePassword')?.value;
    
    // Check if passwords match
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}