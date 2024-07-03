import express from "express";
import viewRoutes from "./routes/view.routes.js";
import handlebars from "express-handlebars";
import __dirname  from "./dirname.js";
import{Server} from "socket.io";

const PORT= 8080;
const app= express();

//Configuración de handlebars
app.engine ("handlebars",handlebars.engine());
app.set ("views",__dirname + "/views"); //la ruta que se encuentra views
app.set("view engine", "handlebars"); //configuramos para que express sepa con que motor vamos a utilizar los views

 app.use (express.json());
 app.use(express.urlencoded({extended:true}));
 app.use (express.static("public"));

app.use ("/", viewRoutes);
const httpServer=app.listen(PORT, ()=>{
    console.log("servidor escuchando en puerto 8080");
});

const io= new Server(httpServer); //configuramos sokect

//todos los mensajes que queden guardados en un array
let messages=[];

io.on ("connection", (socket)=>{
    console.log(`Nuevo cliente conectado ${socket.id}`);

    //recibimos el nombre del usuario
    socket.on ("newUser", (data)=>{
           //ahora quiero que notifique a cada usuario ya entrado menos al nuevo,
  //que otra persona sw conectó.
  socket.broadcast.emit("newUser", data);
    })

    socket.on ("message", (data)=>{
        console.log(data);
        // Recibimmos el mensaje de todos
        messages.push(data);
         //enviamos a todos los usuarios el mensaje
    io.emit ("messageLog", messages);
    })

  
})