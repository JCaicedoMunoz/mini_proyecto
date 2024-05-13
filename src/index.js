import http from 'node:http'
import { getUsuarios, importFromFile, savetoFile, index } from './controller.js'

const server = http.createServer(async (req, res) => {
  const url = req.url
  const method = req.method
  if (method === 'GET') {
    switch (url) {
      case '/':
        index(res)
        break
      case '/api/usuarios':
        getUsuarios(res)
        break
      case '/api/usuarios/export':
        savetoFile(res)
        break
      case '/api/usuarios/import':
        importFromFile(res)
        break

      default:
        res.end('No se encontro la ruta')
        break
    }
  }
})
server.listen(3000, () => console.log('servidor ejecutandose en http://localhost:3000'))
