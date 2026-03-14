export const STATUS = {
  DRAFT:    'draft',
  WAITING:  'waiting',
  READY:    'ready',
  DONE:     'done',
  CANCELED: 'canceled',
}

export const STATUS_OPTIONS = [
  { value: STATUS.DRAFT,    label: 'Draft'    },
  { value: STATUS.WAITING,  label: 'Waiting'  },
  { value: STATUS.READY,    label: 'Ready'    },
  { value: STATUS.DONE,     label: 'Done'     },
  { value: STATUS.CANCELED, label: 'Canceled' },
]