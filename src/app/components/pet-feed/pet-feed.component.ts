import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Pet } from 'src/app/models/Pet';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-pet-feed',
  templateUrl: './pet-feed.component.html',
  styles: [
  ]
})
export class PetFeedComponent implements OnInit {

  pets: Pet[] = Array<Pet>();

  constructor(
    private http: HttpClient,
    private petService: PetService
  ) { }

  public getAllPets(): void {
    this.petService.selectAllPets().subscribe(
      (data: any) => {
        data.forEach((pet: Pet) => {
          this.pets.push(pet);
        });
      }
    );
  }

  ngOnInit(): void {
    this.getAllPets();
  }

}
