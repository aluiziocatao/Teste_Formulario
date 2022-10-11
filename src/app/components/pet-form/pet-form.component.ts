import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Color } from 'src/app/models/Color';
import { Fur } from 'src/app/models/Fur';
import { Pet } from 'src/app/models/Pet';
import { Race } from 'src/app/models/Race';
import { CategoryService } from 'src/app/services/category.service';
import { ColorService } from 'src/app/services/color.service';
import { FurService } from 'src/app/services/fur.service';
import { PetService } from 'src/app/services/pet.service';
import { RaceService } from 'src/app/services/race.service';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.component.html',
  styles: [
  ]
})
export class PetFormComponent implements OnInit {

  public petForm!: FormGroup;
  public races: Array<Race> = [];
  public categorys: Array<Category> = [];
  public furs: Array<Fur> = [];
  public colors: Array<Color> = [];

  constructor(
    private pet: PetService,
    private raceService: RaceService,
    private categoryService: CategoryService,
    private furService: FurService,
    private colorService: ColorService,
    private router: Router
  ) { }

  public registro: Pet = <Pet>{};

  ngOnInit(): void {
    this.petForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      photo: new FormControl(''),
      is_lost: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      fur: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      race: new FormControl('', [Validators.required]),
    });

    this.getAllColors();
    this.getAllFurs();
    this.getAllRaces();
    this.getAllCategorys();
  }

  get name(): AbstractControl {
    return this.petForm.get('name')!;
  }

  get description(): AbstractControl | null {
    return this.petForm.get('description');
  }

  get is_lost(): AbstractControl {
    return this.petForm.get('is_lost')!;
  }

  get color(): AbstractControl {
    return this.petForm.get('color')!;
  }

  get fur(): AbstractControl {
    return this.petForm.get('fur')!;
  }

  get category(): AbstractControl {
    return this.petForm.get('category')!;
  }

  get race(): AbstractControl {
    return this.petForm.get('race')!;
  }

  public getAllColors(): void {
    this.colorService.selectAllColors().subscribe(
      (data: any) => {
        data.forEach((color: Color) => {
          this.colors.push(color);
        });
      }
    );
  }

  public getAllFurs(): void {
    this.furService.selectAllFurs().subscribe(
      (data: any) => {
        data.forEach((fur: Fur) => {
          this.furs.push(fur);
        });
      }
    );
  }

  public getAllRaces(): void {
    this.raceService.selectAllRaces().subscribe(
      (data: any) => {
        data.forEach((race: Race) => {
          this.races.push(race);
        });
      }
    );
  }

  public getAllCategorys(): void {
    this.categoryService.selectAllCategorys().subscribe(
      (data: any) => {
        data.forEach((category: Category) => {
          this.categorys.push(category);
        });
      }
    );
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.petForm.patchValue({ photo: file })
  }

  public insertValuesIntoTheInterface() {
    const user = JSON.parse(localStorage.getItem('user') as string);

    this.registro.pet_name = this.name.value;
    this.registro.pet_description = this.description!.value ? this.description!.value : 'Sem descrição';
    this.registro.pet_photo = '';
    this.registro.pet_lost = this.is_lost.value;
    this.registro.colorPelagem = this.color.value;
    this.registro.fur = this.fur.value;
    this.registro.category = this.category.value;
    this.registro.race = this.race.value;
    this.registro.user = user.id;
  }

  public submit(): void {
    if (this.petForm.invalid) return;

    this.insertValuesIntoTheInterface();
    const token: string = localStorage.getItem('token') as string;

    this.pet.insertNewPet(this.registro, token).subscribe({
      complete: () => {
        this.petForm.reset();
        this.router.navigate(['/home']);
      }
    });
  }
}
