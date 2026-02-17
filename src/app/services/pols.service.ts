import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from './../../environments/environment'
import { constants } from '../constants';
const url = environment.serviceUrl
@Injectable({
  providedIn: 'root'
})
export class PolsService {
  userId = sessionStorage.getItem('UserId');
  constructor(private http: HttpClient) { }

  getPolls() {
    let apiUrl=constants['Getpolls']||'Getpolls'
    let uri = url +apiUrl+ '/' + this.userId;
    return this.http.get(uri)
  }

  getPollQuestions(id) {
    let apiUrl=constants['GetPollQuestions']||'GetPollQuestions'
    let uri = url +apiUrl+ '/' +  this.userId + '/' + id
    return this.http.get(uri)
  }
  savePolls(data) {
    let apiUrl=constants['SavePolls']||'SavePolls'
    let uri=url+apiUrl;
     data.UserId= this.userId
     return this.http.post(uri,data)
  }

   ///////////////////////////survey///////////////////////////
    getSurveys(){
      let apiUrl=constants['GetSurveys']||'GetSurveys'
      let uri = url+apiUrl + '/' + this.userId;
      return this.http.get(uri)
    }
    
    getSurveyQuestions(id){
      let apiUrl=constants['GetSurveyQuestions']||'GetSurveyQuestions'
      let uri = url + apiUrl+'/' +  this.userId + '/' + id
      return this.http.get(uri)   
    }

    setSurveys(data){
      // SetSurveys
      let apiUrl=constants['SetSurveys']||'SetSurveys'
      let uri=url+apiUrl;
      data.UserId= this.userId
      return this.http.post(uri,data)
    }
   ///////////////////////////survey///////////////////////////



}
