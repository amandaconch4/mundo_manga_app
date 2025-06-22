import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiUsuariosService {

  private apiUrlUsuarios = 'https://jsonplaceholder.typicode.com/users';

  constructor(private httpUsuarios: HttpClient) { }

  // Método para obtener la lista de usuarios
  getUsuarios(): Observable<any> {
    return this.httpUsuarios.get(this.apiUrlUsuarios).pipe(
      retry(3), // Se reintenta la solicitud hasta 3 veces en caso de error
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        throw error;
      })
    );
  }

  // Método para agregar un usuario nuevo
  postUsuario(usuario: any): Observable<any> {
    return this.httpUsuarios.post(this.apiUrlUsuarios, usuario).pipe(
      retry(3), // Se reintenta la solicitud hasta 3 veces en caso de error
      catchError((error) => {
        console.error('Error al agregar usuario:', error);
        throw error;
      })
    );
  }

}
