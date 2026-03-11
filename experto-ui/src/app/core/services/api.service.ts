import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiagnosisRequest, DiagnosisResponse, QuestionDTO } from '../models/expert.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getQuestions(domainCode: string): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(`/api/expert/${domainCode}/questions`);
  }

 diagnose(payload: DiagnosisRequest, trace = false): Observable<DiagnosisResponse> {
  const url = trace
    ? `/api/expert/diagnose?trace=true`
    : `/api/expert/diagnose`;
  return this.http.post<DiagnosisResponse>(url, payload);
}

}
