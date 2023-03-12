import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class BooleanPipe implements PipeTransform {
  transform(value: any): boolean {
    if (value === undefined || value === 'false') return false;
    else if (value === 'true') return true;
    throw new Error('BoolPipe) Invalid value');
  }
}
