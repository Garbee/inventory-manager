export interface Location {
  id: string;
  name: string;
  area?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface Item {
  id: string;
  industryIdentifiers?: object;
  name?: string;
  title?: string;
  subtitle?: string;
  locationId?: string;
  createdAt?: string;
  updatedAt?: string;
}
