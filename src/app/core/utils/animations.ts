import { animate, style, transition, trigger } from '@angular/animations'

export const fadeInOut = trigger('fadeInOut', [
  transition(':leave', [
    style({
      opacity: '1',
    }),
    animate(
      '.3s ease-in-out',
      style({
        opacity: '0',
      }),
    ),
  ]),

  transition(':enter', [
    style({
      opacity: '0',
    }),
    animate(
      '.3s ease-in-out',
      style({
        opacity: '1',
      }),
    ),
  ]),
])
