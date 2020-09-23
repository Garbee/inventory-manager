import { LocationsRepository } from "./Locations";
import { ItemsRepository } from "./Items";

interface IExtensions {
  locations: LocationsRepository;
  items: ItemsRepository;
}

export { IExtensions, LocationsRepository, ItemsRepository };
