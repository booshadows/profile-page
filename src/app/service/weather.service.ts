import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  api_url = 'https://api.openweathermap.org/data/2.5/weather';
  api_key = 'dba66d41bb419af9e234fd876dcb2b38';

  constructor(private http: HttpClient) { }
  
  getWeatherByLocation(): Observable<any> {
    return from(new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `${this.api_url}?lat=${lat}&lon=${lon}&appid=${this.api_key}`;
        this.http.get(url).pipe(
          map((data: any) => {
            resolve(data);
          }),
          catchError((error: any) => {
            reject(error);
            return error;
          })
        ).subscribe();
      });
    }));
  }
}
