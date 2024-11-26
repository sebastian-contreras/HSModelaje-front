import Swal from "sweetalert2";

export function AlertaWithConfirmation({title,textMain,textSuccesfull,textError,functionConfirmed}) {
  Swal.fire({
    title: title || '',
    icon: "warning" ,
    text: textMain|| '',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Confirmar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await functionConfirmed()
        Alerta()
          .withTitulo(textSuccesfull || '')
          .withTipo("success")
          .withMini(true)
          .build();
      } catch (error) {
        Alerta()
          .withTitulo(textError || '')
          .withTipo("error")
          .withMini(true)
          .build();
      }
    }
  });
}

export function mostrarAlerta(titulo, mensaje, tipo, html=null, mini=false) {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (mini) {
      Toast.fire({
        title: titulo,
        text: mensaje,
        html: html,
        icon: tipo
      });
    } else {
      Swal.fire({
        title: titulo,
        text: mensaje,
        html: html,
        icon: tipo
      });
    }
  }

  class AlertaBuilder {
    constructor() {
      this.titulo = null;
      this.mensaje = null;
      this.tipo = null;
      this.html = null;
      this.mini = false;
    }
  
    withTitulo(titulo) {
      this.titulo = titulo;
      return this;
    }
  
    withMensaje(mensaje) {
      this.mensaje = mensaje;
      return this;
    }
  
    withTipo(tipo) {
      this.tipo = tipo;
      return this;
    }
  
    withHtml(html) {
      this.html = html;
      return this;
    }
  
    withMini(mini) {
      this.mini = mini;
      return this;
    }
  
    build() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      if (this.mini) {
        Toast.fire({
          title: this.titulo,
          text: this.mensaje,
          html: this.html,
          icon: this.tipo
        });
      } else {
        Swal.fire({
          title: this.titulo,
          text: this.mensaje,
          html: this.html,
          icon: this.tipo
        });
      }
    }
  }
  
  export function Alerta() {
    return new AlertaBuilder();
  }