import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'

import { BookDialogComponent } from '../../pages/books/book-dialog/book-dialog.component'
import { Book } from '../interfaces/book.interface'

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogService = inject(MatDialog);

  openBookDialog(bookData: Book | null = null) {
    return this.dialogService.open(BookDialogComponent, {
      data: {
        book: bookData,
        mode: bookData ? 'edit' : 'add'
      },
      maxWidth: '100vw',
    })
  }
}
