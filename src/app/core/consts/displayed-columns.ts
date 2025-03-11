import { Book } from '../interfaces/book.interface'

export const BOOK_COLUMNS: (keyof Book | 'actions')[] = [
  'name',
  'author',
  'publicationYear',
  'publicationPlace',
  'pages',
  'actions',
]
