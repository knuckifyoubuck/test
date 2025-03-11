import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-other',
  standalone: true,
  templateUrl: './other.page.html',
  styleUrl: './other.page.scss',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OtherPage {
  title = 'other'
}
