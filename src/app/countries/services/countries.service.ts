import { Injectable } from '@angular/core';
import { Region, Country, SmallCountry } from '../interfaces/country.interfaces';
import { combineLatest, map, Observable, of, tap, } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  constructor(
    private httpClient: HttpClient
  ) { }

  private _regions:Region[] = [Region.Africa,Region.Americas,Region.Asia,Region.Europe,Region.Oceania];

  get regions():Region[]{
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]>{
    if(!region) return of([]);

    const url:string = `${this.baseUrl}/region/${region}/?fields=cca3,name,borders`;

    return  this.httpClient.get<Country[]>(url)
    .pipe(
      map(countries=> countries.map( country=>({
        name:country.name.common,
        cca3:country.cca3,
        borders: country.borders ?? []
      }))),
      tap(resp => console.log(resp))
    )

  }

  getCountryByAlphaCode(alphaCode:string): Observable<SmallCountry>{

    const url:string = `${this.baseUrl}/alpha/${alphaCode}/?fields=cca3,name,borders`;
    return this.httpClient.get<Country>(url)
    .pipe(
      map(country => ({
        name:country.name.common,
        cca3:country.cca3,
        borders:country.borders ??[],
      }))
    )
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]>{
    if( !borders || borders.length === 0 ) return of([]);

    const countriesRequest: Observable<SmallCountry>[] = [];

    borders.forEach(code=>{
      const request = this.getCountryByAlphaCode(code);
      countriesRequest.push(request);
    })

    return combineLatest(countriesRequest);
  }

}
