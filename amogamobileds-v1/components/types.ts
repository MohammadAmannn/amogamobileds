export interface GalleryEntry {
  id: string;
  name: string;
  title?: string;
  category?: string;
  file?: string;
  tag?: string;
  description?: string;
  [key: string]: any;
}

