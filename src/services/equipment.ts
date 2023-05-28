import { Request, Response } from 'express'
import * as mongoDB from 'mongodb'

import {
  connectToDatabase,
  collections,
  closeDatabaseConnection,
} from './server'

export async function getEquipments(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null

  try {
    client = await connectToDatabase()
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const result = await equipments.find({}).toArray()
    res.send(result)
  } catch (error) {
    res.status(500).send('Erro ao pegar equipamentos do banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client)
    }
  }
}

export async function criarEquipment(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null

  try {
    client = await connectToDatabase()
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const { nome } = req.body

    // Verificar se o equipamento já existe com o mesmo nome
    const existingEquipment = await equipments?.findOne({ nome })
    if (existingEquipment) {
      return res.status(400).send('Já existe um equipamento com este nome.')
    }

    const equipment = { nome: nome, usos: 0 }

    const result = await equipments?.insertOne(equipment)
    res.send(result)
  } catch (error) {
    res.status(500).send('Erro ao criar equipamento no banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client)
    }
  }
}

export async function addUsos(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null

  try {
    client = await connectToDatabase()
    let newQnt = 0
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const { nome } = req.body
    const filter = { nome: nome }
    const result = await equipments?.findOne(filter)

    if (result == null) {
      res.status(500).send('O equipamento ${nome} não foi encontrado.')
      return
    }

    newQnt = 1 + result?.usos // Adiciona mais uma batida no NFC

    const update = { usos: newQnt }
    await equipments.updateOne(filter, {
      $set: update,
    })
    res.status(200).send('Adicionado uso com sucesso do banco de dados.')
  } catch (error) {
    res.status(500).send('Erro ao adicionar uso ao banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client)
    }
  }
}

export async function deletarEquipment(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null

  try {
    client = await connectToDatabase()
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const { nome } = req.body
    const filter = { nome: nome }

    const result = await equipments?.deleteOne(filter)
    if (result.deletedCount === 0) {
      res.status(500).send(`O equipamento ${nome} não foi encontrado.`)
      return
    }

    res.status(200).send(`Equipamento ${nome} deletado com sucesso.`)
  } catch (error) {
    res.status(500).send('Erro ao deletar equipamento do banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client)
    }
  }
}
