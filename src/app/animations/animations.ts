import {
  animate,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const Animations = {
  pinUnpin: trigger('pinUnpin', [
    state(
      'pinned',
      style({
        opacity: '1',
        transform: 'scale(1.1)',
        color: 'var(--red-dark)',
      })
    ),
    state(
      'unPinned',
      style({
        opacity: '0.1',
        transform: 'scale(1.1)',
      })
    ),
    transition('pinned <=> unPinned', [
      style({
        transform: 'scale(1.5)',
        opacity: '0',
      }),
      animate('0.25s'),
    ]),
  ]),

  completeIncomplete: trigger('completeIncomplete', [
    state(
      'complete',
      style({
        opacity: '1',
        transform: 'scale(1.1)',
        color: 'var(--green)',
      })
    ),
    state(
      'inComplete',
      style({
        opacity: '0.1',
        transform: 'scale(1.1)',
      })
    ),

    transition('inComplete <=> complete', [
      style({
        transform: 'scale(1.5)',
        opacity: '0',
      }),
      animate('0.25s'),
    ]),
  ]),

  delete: trigger('delete', [
    state(
      'delete',
      style({
        opacity: '0',
        transform: 'scale(0)',
        height: '0px',
        padding: '0px',
        'margin-top': '0px',
      })
    ),
    transition('void => delete', [
      style({
        opacity: '1',
        transform: 'scale(1.1)',
      }),
      animate('0.15s'),
    ]),
  ]),

  selectNote: trigger('selectNote', [
    transition('void => selectNote', [
      animate(
        '0.15s',
        keyframes([
          style({ transform: 'scale(1)' }),
          style({ transform: 'scale(0.9)' }),
          style({ transform: 'scale(1)' }),
        ])
      ),
    ]),
  ]),

  cta: trigger('cta', [
    transition('void => cta-click', [
      animate(
        '0.15s',
        keyframes([
          style({ transform: 'scale(1)' }),
          style({
            transform: 'scale(0.9)',
            filter: 'brightness(0.55)',
          }),
          style({
            transform: 'scale(1)',
            filter: 'brightness(1)',
          }),
        ])
      ),
    ]),
  ]),

  listAnimation: trigger('listAnimation', [
    transition('* <=> *', [
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          stagger(250, animate(250, style({ opacity: 1 }))),
        ],
        { optional: true }
      ),
    ]),
  ]),
};
