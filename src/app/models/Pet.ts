import { Color } from './Color';
import { User } from './User';
import { Fur } from './Fur';
import { Category } from './Category';
import { Race } from './Race';
export interface Pet {
  id_pet: number,
  pet_name: string,
  pet_description: Text,
  pet_photo: string,
  pet_date_register: string,
  pet_lost: number,
  colorPelagem: Color,
  fur: Fur,
  category: Category,
  race: Race,
  user: User,
}
