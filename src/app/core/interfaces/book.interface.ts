import { UUID } from '../types/uuid.type'

export interface Book {
  id: UUID
  name: string
  author: string
  publicationYear: number
  publicationPlace: string
  pages: number
  imageSrc?: string
}
