import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' }; // Modelo para el nuevo usuario
  usuarioModificar: Usuario = { id: 0, nombre: '', email: '', empresa: '' }; // Modelo para el usuario a modificar
  usuarioEliminarId: number | null = null; // ID del usuario a eliminar

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  // Método para obtener los usuarios
  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id, // Aseguramos que capturamos el ID
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  // Método para agregar un nuevo usuario con POST
  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post<{ id: number }>('https://jsonplaceholder.typicode.com/users', body) // Aseguramos que la respuesta tenga un 'id'
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push({ ...this.nuevoUsuario, id: response.id || this.usuarios.length + 1 }); // Simulamos el ID
        this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; // Limpiamos el formulario
      });
  }

  // Método para modificar un usuario existente con PUT
  modificarUsuario() {
    if (this.usuarioModificar.id !== 0) { // Verifica que el ID sea válido
      const body = {
        name: this.usuarioModificar.nombre,
        email: this.usuarioModificar.email,
        company: {
          name: this.usuarioModificar.empresa
        }
      };

      this.http.put(`https://jsonplaceholder.typicode.com/users/${this.usuarioModificar.id}`, body) // Asegúrate de usar la URL correcta
        .subscribe(response => {
          console.log('Usuario modificado:', response);
          const index = this.usuarios.findIndex(usuario => usuario.id === this.usuarioModificar.id);
          if (index !== -1) {
            this.usuarios[index] = { ...this.usuarioModificar }; // Actualiza el usuario en el arreglo local
          }
          this.usuarioModificar = { id: 0, nombre: '', email: '', empresa: '' }; // Limpiamos el formulario
        });
    }
  }

  // Método para eliminar un usuario con DELETE
  eliminarUsuario() {
    if (this.usuarioEliminarId !== null) {
      this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.usuarioEliminarId}`)
        .subscribe(response => {
          console.log('Usuario eliminado:', response);
          // Remover el usuario del arreglo localmente
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== this.usuarioEliminarId);
          this.usuarioEliminarId = null; // Limpiar el ID del usuario a eliminar
        });
    }
  }
}
