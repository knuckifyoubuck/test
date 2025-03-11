import { Injectable, signal } from '@angular/core';

import { BOOK_DATA } from '../consts/book-data'

@Injectable({
  providedIn: 'root'
})
export class BookListService {
  bookList = signal(BOOK_DATA);
}
