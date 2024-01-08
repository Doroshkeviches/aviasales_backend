import { InternalServerErrorException } from '@nestjs/common';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { I18nContext } from 'nestjs-i18n';

export class ApiException extends InternalServerErrorException {
  constructor(errorCode: ErrorCodes) {
    const i18n = I18nContext.current();
    const message = i18n.t(errorCode);
    super({ message });
  }
}
