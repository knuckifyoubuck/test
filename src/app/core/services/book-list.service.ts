import { Injectable } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'

import { BOOK_DATA } from '../consts/book-data'

@Injectable({
  providedIn: 'root',
})
export class BookListService {
  bookListSource = new MatTableDataSource(BOOK_DATA)
}
