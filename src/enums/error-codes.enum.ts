export enum ErrorCodes {
  FieldShouldBeString = 'errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.field-invalid.should-be-email',
  FieldShouldBeArray = 'errors.field-invalid.should-be-array',
  InvalidForm = 'errors.invalid-form',
  NotAuthorizedRequest = 'errors.not-authorized.request',
  InvalidPassword = 'errors.invalid-password',
  ExpiredToken = 'errors.expired-token',
  AlreadyRegistered = 'errors.alredy-registered',
  CreateUserError = 'errors.create-user',
  NotExists_User = 'errors.auth.not-exists.user',
  Error = 'errors.error'
}