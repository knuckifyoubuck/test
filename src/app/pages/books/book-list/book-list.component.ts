import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip'

import { BOOK_COLUMNS } from '../../../core/consts/displayed-columns'
import { Book } from '../../../core/interfaces/book.interface'
import { BookDialogDeleteOnClose } from '../../../core/interfaces/book-dialog-data'
import { YearPipe } from "../../../core/pipes/year.pipe";
import { BookListService } from '../../../core/services/book-list.service'
import { DialogService } from '../../../core/services/dialog.service'
import { rowAddDelete } from '../../../core/utils/animations'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatRippleModule, NgClass, YearPipe],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  animations: [rowAddDelete],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent {
  bookListService = inject(BookListService);
  private formBuilder = inject(FormBuilder);
  private dialogService = inject(DialogService);

  editForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publicationYear: ['', [Validators.required]],
    publicationPlace: ['', [Validators.required]],
    pages: ['', [Validators.required, Validators.min(1)]]
  });

  bookColumns = BOOK_COLUMNS;
  editMode: WritableSignal<string | null> = signal('');

  addBook() {
    const addBookRef = this.dialogService.openBookDialog();

    addBookRef.afterClosed().subscribe((newBook?: Book) => {
      if (newBook) {
        this.bookListService.bookList.update((books) => [newBook, ...books]);
      }
    });
  }

  openBook(book: Book) {
    if (!this.editMode()) {
      const editBookRef = this.dialogService.openBookDialog(book);
    
      editBookRef.afterClosed().subscribe((changedBook?: Book | BookDialogDeleteOnClose) => {
        if (changedBook) {
          if ('button' in changedBook) {
            if (changedBook.button === 'delete') {
              this.deleteBook(book.id);            
            }
          } else {
            this.bookListService.bookList.update((books) => books.map((book) => {
              if (book.id === changedBook.id) {
                return ({
                  id: book.id,
                  name: changedBook.name,
                  author: changedBook.author,
                  publicationYear: changedBook.publicationYear,
                  publicationPlace: changedBook.publicationPlace,
                  pages: changedBook.pages,
                  imageSrc: changedBook.imageSrc
                });
              } else {
                return book;
              }
            }));
          }
        }
      });
    }
  }

  deleteBook(id: string) {
    this.bookListService.bookList.update((books) => books.filter(book => book.id !== id));
  }
  
  editBook(book: Book) {
    this.editMode.set(book.id);
    this.editForm.setValue({
      name: book.name,
      author: book.author,
      publicationYear: String(book.publicationYear),
      publicationPlace: book.publicationPlace,
      pages: String(book.pages),
    })
  }

  confirmEditChanges(id: string) {
    this.bookListService.bookList.update((books) => books.map((book) => {
      if (book.id === id) {
        return ({
          id: book.id,
          name: this.editForm.controls.name.value as string,
          author: this.editForm.controls.author.value as string,
          publicationYear: Number(this.editForm.controls.publicationYear.value) as number,
          publicationPlace: this.editForm.controls.publicationPlace.value as string,
          pages: Number(this.editForm.controls.pages.value) as number,
        });
      } else {
        return book;
      }
    }));
    
    this.editMode.set(null);
  }

  cancelEditChanges() {
    this.editMode.set(null);
  }
}
