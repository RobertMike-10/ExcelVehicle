import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { Vehicle } from '../models/vehicle';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiTransformService {
  private baseApiUrl: string;
  private apiUploadUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseApiUrl = 'https://localhost:44329/api/Vehicles';
    this.apiUploadUrl = this.baseApiUrl + '/upload';
   }


   getVehicles(filename:string): Observable<Vehicle[]> {
   
    return this.httpClient.get<Vehicle[]>( this.baseApiUrl +`?fileName=${filename}`)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }
   public uploadFile(file: Blob): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.httpClient.request(new HttpRequest(
      'POST',
      this.apiUploadUrl ,
      formData,
      {
        reportProgress: true
      }));
  }

  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
