import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public baseApiUrl = 'http://localhost:3000/api'; // Default API URL

  constructor() { }
}