import * as express from 'express'
import * as cors from 'cors'

import { Request } from 'express'

import { addUsos, criarEquipment, deletarEquipment, getEquipments } from './services/equipment'
import { addUser, deletarUsuario, getUsuarios } from './services/usuarios'

const app = express()
const port = 8000

app.use(express.json()) 
app.use(cors<Request>())

app.get('/equipments', getEquipments)
app.post('/create-equipment', criarEquipment)
app.post('/use-equipment', addUsos)
app.post('/delete-equipment', deletarEquipment)

app.post('/create-user', addUser)
app.get('/users', getUsuarios)
app.post('/delete-user', deletarUsuario)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
