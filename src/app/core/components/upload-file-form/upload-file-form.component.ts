import { ChangeDetectionStrategy,Component, forwardRef, output, signal } from "@angular/core"
import { ControlValueAccessor,NG_VALUE_ACCESSOR } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: 'app-upload-file-form',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './upload-file-form.component.html',
  styleUrl: './upload-file-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileFormComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileFormComponent implements ControlValueAccessor {
  onChange!: (value: unknown) => void
  onTouched!: () => void
  isDisabled = signal(false);

  imageLoaded = output<string>();
  imageLoading = output<boolean>();

  imageSrc!: string;
  fileName!: string;

  onFileSelected(event: Event) {
    if (this.isDisabled()) {
      return;
    }

    if (event.target) {
      if ((event.target as HTMLInputElement).files) {
        this.imageLoading.emit(true);
        const file = (event.target as HTMLInputElement).files![0];
        this.fileName = file.name;

        const reader = new FileReader();

        reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.imageLoaded.emit(this.imageSrc);
          this.imageLoading.emit(false);

          this.onChange(this.imageSrc);
          this.onTouched();
        };
  
        reader.readAsDataURL(file);

      }
    }
  }

  writeValue(imageSrc: unknown): void {
    if (typeof imageSrc === 'string') {
      this.imageSrc = imageSrc;
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
