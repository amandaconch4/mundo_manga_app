import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ApiUsuariosService } from 'src/app/services/api-usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {

  usuarios: any[] = []; // Arreglo para almacenar los usuarios
  newUsuario = {name: '', correo: ''}; // Nuevo usuario

  constructor(private alertController: AlertController,
    private apiUsuariosService: ApiUsuariosService,
    private menu: MenuController) { }

  ngOnInit() {

    this.apiUsuariosService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data; // Asigna los usuarios obtenidos al arreglo
      },
      (error) => {
        this.mostrarAlerta('Error', 'No se pudieron cargar los usuarios.');
      }
    );
  }

  // Método para añadir un usuario nuevo
  nuevoUsuario() {
    this.apiUsuariosService.postUsuario(this.newUsuario).subscribe(
      (response) => {
        this.mostrarAlerta('Usuario añadido correctamente:', response);
        this.usuarios.push(response); // Añade el nuevo usuario al arreglo
        this.newUsuario = { name: '', correo: '' }; // Resetea el formulario
      },
      (error) => {
        this.mostrarAlerta('Error', 'No se pudo añadir el usuario.');
      }
    );
  }

  //Método para mostrar alerta
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}
