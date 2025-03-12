import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, output, signal, ViewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-upload-image-form',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './upload-image-form.component.html',
  styleUrl: './upload-image-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImageFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UploadImageFormComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadImageFormComponent implements ControlValueAccessor {
  onChange!: (value: unknown) => void
  onTouched!: () => void
  isDisabled = signal(false)

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef

  imageLoaded = output<string>()
  imageLoading = output<boolean>()

  imageSrc?: string
  fileType?: string

  onFileSelected(event: Event) {
    if (this.isDisabled()) {
      return
    }

    if (event.target) {
      if ((event.target as HTMLInputElement).files) {
        const file = (event.target as HTMLInputElement).files![0]
        this.fileType = file.type

        const reader = new FileReader()

        reader.onloadstart = () => {
          this.imageLoading.emit(true)
        }
        reader.onload = () => {
          this.imageSrc = reader.result as string
          this.imageLoaded.emit(this.imageSrc)
          this.imageLoading.emit(false)

          this.onChange(this.imageSrc)
          this.onTouched()
        }

        reader.readAsDataURL(file)
      }
    }
  }

  writeValue(imageSrc: unknown): void {
    if (typeof imageSrc === 'string') {
      this.imageSrc = imageSrc

      this.fileInput.nativeElement.value = ''
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
  }

  validate() {
    if (this.fileType) {
      const isNotImage = this.fileType.split('/')[0] !== 'image'
      return (
        isNotImage && {
          isNotImage: true,
        }
      )
    } else return null
  }
}
