import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
 
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  
    const secureReq = req.clone({
     
      setHeaders: {
      
        "Authorization":sessionStorage.getItem('stoken')||''
      }
    });

    return next.handle(secureReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          // const {
          //   errors: [{ msg }]
          // } = error.error;
        } else if (error.status === 500) {
          // const { errors } = error.error;
        } else if (error.status === 401) {
        
        }
        return throwError(error);
      })
    );
  }
}
