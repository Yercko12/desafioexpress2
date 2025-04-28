const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/canciones', (req, res) => {
  const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
  res.json(repertorio);
});

app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;
  const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));

  repertorio.push(nuevaCancion);

  fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
  res.json({ mensaje: 'Canción agregada exitosamente' });
});

app.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;
  const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));

  const index = repertorio.findIndex(cancion => cancion.id == id);
  if (index !== -1) {
    repertorio[index] = datosActualizados;
    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
    res.json({ mensaje: 'Canción actualizada exitosamente' });
  } else {
    res.status(404).json({ mensaje: 'Canción no encontrada' });
  }
});

app.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;
  let repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));

  repertorio = repertorio.filter(cancion => cancion.id != id);

  fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
  res.json({ mensaje: 'Canción eliminada exitosamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
