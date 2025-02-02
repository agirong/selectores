import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ){}

  ngOnInit(): void {
    this.onRegionChange();
  }

  public myForm: FormGroup = this.fb.group({
    region:['',Validators.required],
    country:['',Validators.required],
    borders:['',Validators.required],
  })

  get regions():Region[]{
    return this.countriesService.regions;
  }

  onRegionChange():void{
    this.myForm.get('region')?.valueChanges
    .subscribe( region=>{
      console.log({region})
    })
  }
}
