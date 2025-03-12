import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule } from '@angular/material/tooltip'

import { UploadImageFormComponent } from '../../../core/components/upload-image-form/upload-image-form.component'
import { Book } from '../../../core/interfaces/book.interface'
import { BookDialogData, BookDialogDeleteOnClose } from '../../../core/interfaces/book-dialog-data'

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    UploadImageFormComponent,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent {
  dialogRef = inject(MatDialogRef)
  bookDialogData: BookDialogData = inject(MAT_DIALOG_DATA)
  formBuilder = inject(FormBuilder)

  readonlyMode = signal(this.bookDialogData.mode === 'edit')
  imageSrc = signal(this.bookDialogData.book?.imageSrc ?? '')
  imageLoading = signal(false)

  bookForm = this.formBuilder.nonNullable.group({
    name: [this.bookDialogData.book?.name ?? '', [Validators.required]],
    author: [this.bookDialogData.book?.author ?? '', [Validators.required]],
    publicationYear: new FormControl<number | null>(
      this.bookDialogData.book?.publicationYear ?? null,
      Validators.required,
    ),
    publicationPlace: [this.bookDialogData.book?.publicationPlace ?? '', [Validators.required]],
    pages: new FormControl<number | null>(this.bookDialogData.book?.pages ?? null, [
      Validators.required,
      Validators.min(1),
    ]),
    imageSrc: [{ value: this.bookDialogData.book?.imageSrc ?? '', disabled: this.readonlyMode() }],
  })
  initialBookData = this.bookForm.getRawValue()

  addBook(): Book {
    return {
      id: crypto.randomUUID(),
      ...this.bookForm.getRawValue(),
      publicationYear: this.bookForm.controls.publicationYear.value as number,
      pages: this.bookForm.controls.pages.value as number,
    }
  }

  changeBook(): Book {
    return {
      id: this.bookDialogData.book!.id,
      ...this.bookForm.getRawValue(),
      publicationYear: this.bookForm.controls.publicationYear.value as number,
      pages: this.bookForm.controls.pages.value as number,
    }
  }

  deleteBook(): BookDialogDeleteOnClose {
    return {
      id: this.bookDialogData.book!.id,
      button: 'delete',
    }
  }

  editModeChange(event: MatSlideToggleChange) {
    this.bookForm.setValue(this.initialBookData)
    this.imageSrc.set(this.initialBookData.imageSrc)
    this.readonlyMode.set(!event.checked)

    if (this.readonlyMode()) {
      this.bookForm.controls.imageSrc.disable()
    } else {
      this.bookForm.controls.imageSrc.enable()
    }
  }

  onImageLoaded(imageSrc: string) {
    this.imageSrc.set(imageSrc)
  }

  onImageLoading(isLoading: boolean) {
    this.imageLoading.set(isLoading)
  }
}
