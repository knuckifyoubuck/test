import { UUID } from '../types/uuid.type'

import { Book } from './book.interface'

export interface BookDialogData {
  book: Book | null
  mode: 'add' | 'edit'
}

export interface BookDialogDeleteOnClose {
  id: UUID
  button: 'delete'
}
