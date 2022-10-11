import { TypeAd } from './TypeAd';
import { Pet } from "./Pet";

export interface Ad {
  id_ad: number,
  ad_title: string,
  ad_description: Text,
  ad_photos: string,
  ad_latitude: number,
  ad_longitude: number,
  ad_recompense: string,
  typeAd: TypeAd,
  id_pet_fk: number,
  user: number,
}
