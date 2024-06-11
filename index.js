import express from "express";
import { read, readFileSync } from "fs";
import { logger } from "logger-express";
import path from 'path';
import fs from 'fs';

const PORT =5000;
//MIDDLEWARE
const app = express(); /* middleware */
app.use(express.json());
app.use(logger()); /* middleware */

const __dirname = path.resolve() // para resolver las rutas relativas

//RUTAS HOME
//RUTAS HOME
app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
})
//OBTENER
app.get('/canciones', (req, res)=>{
    try{
        //res.json({message:'soy un Get'});
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8')) //comvierte un string a un objeto json
        res.status(200).json(canciones)
    }catch(error){
        res.status(500).json({message:"El recurso no esta disponible"})
    }
    
})  
//CREAR el arreglo esta vacio
app.post('/canciones', (req, res)=>{
    try{
        const cancion =req.body // {"datos"}
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8')) //Voy a leer el archivo ... []
        canciones.push(cancion) // [{"data"}]
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones) ) // con vierte un json en un string // escribir el archivo .. [{"data"}]
        res.status(201).send ('cancion creada con exito')
    }catch (error){
        res.status(500).json({message: ' Algo paso'+ error});

    }
   // res.send('soy un post');
})


  
// EDITAR
app.put('/canciones/:id', (req, res) => {
    try {
      const id = req.params.id;
      const cancionEditada = req.body;
      let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
      canciones = canciones.map(cancion => cancion.id == id ? cancionEditada : cancion); // aca creamos un arreglo canciones con el dato de id. Aquí tambien se usa == en vez de === para que no haya problemas con tipos de datos diferentes
      fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
      res.status(200).send('Canción editada con éxito');
    } catch (error) {
      res.status(500).json({ message: 'Algo pasó: ' + error });
    }
  });

  // BORRAR
app.delete('/canciones/:id', (req, res) => {
    try {
      const id = req.params.id;
      let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
      canciones = canciones.filter(cancion => cancion.id != id); //devuelve una array con los datos que haya quedado en la consulta.
      fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
      res.status(200).send('Canción eliminada con éxito');
    } catch (error) {
      res.status(500).json({ message: 'Algo pasó: ' + error });
    }
  });

app.all('*', (req, res) => {  // sin o escribio ninguna ruta
    res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, console.log(`Server on http://localhost:${PORT}`));
