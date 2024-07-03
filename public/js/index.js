
const socket =io();

let message = document.getElementById("message");
let messageLog= document.getElementById ("messageLog");

//declaro una b=variable sin ningun valor
let user;
//Primero pedios una lerta para que el usuario ponga su nombre bay sweet alert
Swal.fire({
  title: "Indentificate",
  input: "text",
  text: "Ingresa el usuario para identificarse en el chat",
  inputValidator: (value) => {
    return !value && "Por favor ingrese el nombre de usuario";
  },
  allowOutsideClick: false,
  //con el then voy a guardar el valor (nombre)que me pongan en el input
}).then((result) => {
  user = result.value;
  // Enviamos el usuarios conectado al servidor
  socket.emit("newUser", user);
});

message.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && message.value.trim().length > 0) {
    //vamos a mandar un objeto con el usuario y mensaje
    socket.emit("message", { user: user, message: message.value });
    
    //una vez que se mando, este se borra del input h queda un strin vacio
    message.value= "";
  }
  });
//recibimos el mensaje de todos
  socket.on("messageLog", (data)=>{
    // Limpia el contenido actual del div messageLog
    messageLog.innerHTML="";
        // Recorre los mensajes y agrega el nuevo mensaje q se escribio. si yo saco el + me lo sobreescribe
        data.forEach((message) => {
          messageLog.innerHTML += `<p><strong>${message.user}:</strong> ${message.message}</p>`;
      });
  })

  //Me llega del backend que una persona ingreso a la charla.
  //Entonces que aparezca un alert
  socket.on ("newUser", (data)=>{
    Swal.fire({text: `${data} se conectó`,
    toast:true,
  position: "top-rigth",
timer:3000});
  })