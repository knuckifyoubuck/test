import { NgClass } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, WritableSignal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'

import { BOOK_COLUMNS } from '../../../core/consts/displayed-columns'
import { Book } from '../../../core/interfaces/book.interface'
import { BookDialogDeleteOnClose } from '../../../core/interfaces/book-dialog-data'
import { YearPipe } from '../../../core/pipes/year.pipe'
import { BookListService } from '../../../core/services/book-list.service'
import { DialogService } from '../../../core/services/dialog.service'
import { fadeInOut } from '../../../core/utils/animations'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgClass,
    YearPipe,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  bookListSource = inject(BookListService).bookListSource
  private formBuilder = inject(FormBuilder)
  private dialogService = inject(DialogService)
  private cdr = inject(ChangeDetectorRef)

  editForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    author: ['', [Validators.required]],
    publicationYear: new FormControl<number | null>(null, Validators.required),
    publicationPlace: ['', [Validators.required]],
    pages: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  })

  searchForm = new FormControl('', { nonNullable: true })

  bookColumns = BOOK_COLUMNS
  editMode: WritableSignal<string | null> = signal('')

  constructor() {
    this.bookListSource.filterPredicate = function (data, filter: string): boolean {
      return (
        data.name.toLowerCase().includes(filter.toLowerCase()) ||
        data.author.toLowerCase().includes(filter.toLowerCase())
      )
    }

    this.searchForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((searchValue) => {
      this.bookListSource.filter = searchValue
    })
  }

  addBook() {
    const addBookRef = this.dialogService.openBookDialog()

    addBookRef.afterClosed().subscribe((newBook?: Book) => {
      if (newBook) {
        this.bookListSource.data = [newBook, ...this.bookListSource.data]
      }
    })
  }

  openBook(book: Book) {
    if (!this.editMode()) {
      const editBookRef = this.dialogService.openBookDialog(book)

      editBookRef.afterClosed().subscribe((changedBook?: Book | BookDialogDeleteOnClose) => {
        if (changedBook) {
          if ('button' in changedBook) {
            if (changedBook.button === 'delete') {
              this.deleteBook(book.id)
            }
          } else {
            this.bookListSource.data.forEach((book) => {
              if (book.id === changedBook.id) {
                book.name = changedBook.name
                book.author = changedBook.author
                book.publicationYear = changedBook.publicationYear
                book.publicationPlace = changedBook.publicationPlace
                book.pages = changedBook.pages
                book.imageSrc = changedBook.imageSrc

                this.cdr.markForCheck()
              }
            })
          }
        }
      })
    }
  }

  deleteBook(id: string) {
    this.bookListSource.data = this.bookListSource.data.filter((book) => book.id !== id)
  }

  editBook(book: Book) {
    this.editMode.set(book.id)
    this.editForm.setValue({
      name: book.name,
      author: book.author,
      publicationYear: book.publicationYear,
      publicationPlace: book.publicationPlace,
      pages: book.pages,
    })
  }

  confirmEditChanges(id: string) {
    this.bookListSource.data.forEach((book) => {
      if (book.id === id) {
        book.name = this.editForm.controls.name.value
        book.author = this.editForm.controls.author.value
        book.publicationYear = this.editForm.controls.publicationYear.value!
        book.publicationPlace = this.editForm.controls.publicationPlace.value
        book.pages = this.editForm.controls.pages.value!
      }
    })

    this.editMode.set(null)
  }

  cancelEditChanges() {
    this.editMode.set(null)
  }
}
