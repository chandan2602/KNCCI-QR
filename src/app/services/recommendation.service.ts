import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recommendation {
  title: string;
  can_apply_skills: string;
  stipend: number;
  similarity_score: number;
}

export interface RecommendationResponse {
  user_id: string;
  recommendations: Recommendation[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'https://oukaidev.samvaadpro.com/recommendation/';

  constructor(private http: HttpClient) { }

  getRecommendations(sessionId: string, topN: number = 5): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(this.apiUrl, {
      session_id: sessionId,
      top_n: topN
    });
  }
}