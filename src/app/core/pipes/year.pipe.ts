import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'year',
  standalone: true,
})
export class YearPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'number') {
      if (value === 0) {
        return '1 BC'
      }

      return value < 0 ? `${Math.abs(value)} BC` : value
    } else {
      throw Error('Piped value must be number')
    }
  }
}
