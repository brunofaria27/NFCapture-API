import { Request, Response } from 'express'

import { connectToDatabase, collections } from './server'

export async function getEquipments(req: Request, res: Response) {
  try {
    await connectToDatabase()
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const result = await equipments.find({}).toArray()
    res.send(result)
  } catch (error) {
    res.status(500).send('Erro ao pegar equipamentos do banco de dados.')
  }
}

export async function criarEquipment(req: Request, res: Response) {
  try {
    await connectToDatabase()
    const equipments = collections.equipments

    if (!equipments) {
      return res.status(500).send('A coleção equipments não foi encontrada.')
    }

    const { nome } = req.body
    const equipment = { nome: nome, usos: 0 }

    const result = await equipments?.insertOne(equipment)
    res.send(result)
  } catch (error) {
    res.status(500).send('Erro ao criar equipamento no banco de dados.')
  }
}

export async function addUsos(req: Request, res: Response) {
  try {
    await connectToDatabase()
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
  }
}
