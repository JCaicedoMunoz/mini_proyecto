import { pool } from './db.js'
import path from 'node:path'
import fs from 'node:fs/promises'

export async function index (res) {
  const ruta = path.resolve('./Inicio/inicio.html')
  const contenido = await fs.readFile(ruta)
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(contenido)
}
export async function getUsuarios (res) {
  const resultado = await pool.query('SELECT * FROM usuarios')
  const data = resultado[0]
  const dataString = JSON.stringify(data)
  res.writeHead(200, { 'content-Type': 'aplication/json' })
  res.end(dataString)
}
export async function savetoFile (res) {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios')
    const usuarios = resultado[0]

    const cabeceras = Object.keys(usuarios[0])
    const stringCabeceras = cabeceras.join(',')
    const stringUsuarios = usuarios.reduce((acc, usuario) => acc + `\n${usuario.id},${usuario.nombres},${usuario.apellidos},${usuario.direccion},${usuario.correo},${usuario.dni},${usuario.edad},${usuario.fecha_cracion},${usuario.telefono}`, '')

    await fs.writeFile('usuarios.csv', stringCabeceras + stringUsuarios)

    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(JSON.stringify({ message: 'Archivo CSV creado exitosamente' }))
  } catch (error) {
    res.writeHead(500, { 'Content-type': 'application/json' })
    res.end(JSON.stringify({ message: 'Hubo un error interno al crear el archivo CSV' }))
  }
}

export async function importFromFile (res) {
  const ruta = path.resolve('./usuarios.csv')
  const contenido = await fs.readFile(ruta, 'utf-8')
  const filas = contenido.split('\n')
  const filasFiltradas = filas.filter((fila) => fila !== '')
  filasFiltradas.shift()

  filasFiltradas.forEach(async (fila) => {
    const columnas = fila.split(',')

    try {
      await pool.execute(
        'INSERT INTO usuarios(id,nombres,apellidos,direccion,correo,dni,edad,fecha_cracion)VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        columnas
      )
    } catch (error) {
      console.log('No se inserto la fila:', columnas[0])
    }
  })
  res.writeHead(200, { 'Content-type': 'application/json' })
  const resString = JSON.stringify({ message: 'Filas insertadas' })
  res.end(resString)
}
