import { AdService } from 'src/app/services/ad.service';
import { Component, OnInit } from '@angular/core';
import { Ad } from 'src/app/models/Ad';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TypeAd } from 'src/app/models/TypeAd';
import { Router } from '@angular/router';
import { AdTypesService } from 'src/app/services/ad-types.service';
import { UserService } from 'src/app/services/user.service';
import { Pet } from 'src/app/models/Pet';

@Component({
  selector: 'app-ad',
  templateUrl: './anuncio.component.html',
  styleUrls: [
    'anuncio.component.css'
  ]
})
export class AnuncioComponent implements OnInit {

  public adForm!: FormGroup;
  public adTypes!: Array<TypeAd>;
  public myPets: Array<Pet> = [];

  constructor(
    private ad: AdService,
    private router: Router,
    private adTypeService: AdTypesService,
    private userService: UserService
  ) { }

  private registro: Ad = <Ad>{};
  private userInfos: any = JSON.parse(localStorage.getItem('user') as string);

  ngOnInit(): void {
    this.adForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      photos: new FormControl(''),
      typeAd: new FormControl('', [Validators.required]),
      cep: new FormControl(''),
      road: new FormControl('', [Validators.required]),
      bairro: new FormControl('', [Validators.required]),
      house_number: new FormControl('', [Validators.required]),
      recompense: new FormControl(''),
      pet: new FormControl('', [Validators.required])
    });

    const idUser: string = this.userInfos.id;

    this.getMyPets(idUser);
    this.toggleRecompenseInput();

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }

  get title(): AbstractControl {
    return this.adForm.get('title')!;
  }

  get description(): AbstractControl {
    return this.adForm.get('description')!;
  }

  get photos(): AbstractControl {
    return this.adForm.get('photos')!;
  }

  get typeAd(): AbstractControl {
    return this.adForm.get('typeAd')!;
  }

  get cep(): AbstractControl | null{
    return this.adForm.get('cep');
  }

  get road(): AbstractControl {
    return this.adForm.get('road')!;
  }

  get bairro(): AbstractControl {
    return this.adForm.get('bairro')!;
  }

  get house_number(): AbstractControl {
    return this.adForm.get('house_number')!;
  }

  get recompense(): AbstractControl | null{
    return this.adForm.get('recompense');
  }

  get pet(): AbstractControl{
    return this.adForm.get('pet')!;
  }

  public getMyPets(idUser: string): void {
    const token: string = localStorage.getItem('token') as string;

    this.userService.getMyPets(idUser, token).subscribe(
      (data: any) => {
        data.forEach((pet: Pet) => {
          this.myPets.push(pet);
        })
      }
    );
  }

  public takeMyPosition(): Number[] {
    let location: any = {
      lat: 0,
      long: 0
    };

    if (!navigator.geolocation) {
      window.alert('O seu navegador não suporta a Geolocalização, por favor atualize seu navedor!');
      this.router.navigate(['/home']);
    }

    navigator.geolocation.getCurrentPosition((position) => {
      let lat: Number = position.coords.latitude;
      let logn: Number = position.coords.longitude;

      location.lat = lat;
      location.long = logn;
    }, (error) => {
      window.alert('Habilite a permissão para acessar a localização');
      this.router.navigate(['/home']);
    });

    return location;
  }

  public toggleRecompenseInput(): void {
    const checkboxButton = document.querySelector('.checkbox-box input[type="checkbox"]');

    checkboxButton?.addEventListener('click', (event) => {

    });
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    this.adForm.patchValue({ image: file })
  }

  public insertValuesIntoTheInterface() {
    const user: any = JSON.parse(localStorage.getItem('user') as string);
    const position: any = this.takeMyPosition();

    this.registro.ad_title = this.title.value;
    this.registro.ad_description = this.description.value;
    this.registro.ad_photos = this.photos.value ? this.description!.value : 'Sem Fotos';
    this.registro.ad_recompense = this.recompense!.value ? this.description!.value : 'Sem Recompensa'
    this.registro.ad_latitude = position.lat;
    this.registro.ad_longitude = position.long;
    this.registro.typeAd = this.typeAd.value;
    this.registro.id_pet_fk = parseInt(this.pet.value);
    this.registro.user = user.id;
  }

  submit(): void{
    if (this.adForm.invalid) return;

    this.insertValuesIntoTheInterface();
    const token: string = localStorage.getItem('token') as string;

    this.ad.insertNewAd(this.registro, token).subscribe({
      complete: () => {
        this.adForm.reset();
        this.router.navigate(['/home']);
      }
    });

    console.log(this.registro);
  }
}
