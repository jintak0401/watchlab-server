import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NumberPipe implements PipeTransform {
  transform(value: any): number | undefined {
    if (value === undefined) return undefined;
    else if (!isNaN(value)) {
      return Number(value);
    }

    throw new Error('Invalid number');
  }
}
