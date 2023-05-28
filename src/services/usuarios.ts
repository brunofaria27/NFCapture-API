import { ObjectId } from 'mongodb'
import * as mongoDB from 'mongodb'
import { Request, Response } from 'express'

import { connectToDatabase, collections, closeDatabaseConnection } from './server'

export async function addUser(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null;

  try {
    client = await connectToDatabase()
    const usuario = collections.usuarios

    if (!usuario) {
      return res.status(500).send('A coleção usuarios não foi encontrada.')
    }

    const { nome, email } = req.body

    const userByEmail = await usuario.findOne({ email })
    if (userByEmail) {
      return res
        .status(400)
        .send('Já existe um usuário cadastrado com este email.')
    }

    await usuario.insertOne({ nome, email })
    return res.status(200).send('Adicionado com sucesso do banco de dados.')
  } catch (error) {
    return res.status(500).send('Erro ao adicionar usuário ao banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}

export async function getUsuarios(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null;

  try {
    client = await connectToDatabase()
    const usuarios = collections.usuarios

    if (!usuarios) {
      return res.status(500).send('A coleção usuarios não foi encontrada.')
    }

    const result = await usuarios.find({}).toArray()
    res.send(result)
  } catch (error) {
    res.status(500).send('Erro ao buscar usuários do banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}

export async function deletarUsuario(req: Request, res: Response) {
  let client: mongoDB.MongoClient | null = null;

  try {
    client = await connectToDatabase()
    const usuarios = collections.usuarios

    if (!usuarios) {
      return res.status(500).send('A coleção usuarios não foi encontrada.')
    }

    const { email } = req.body
    const filter = { email: email }

    const result = await usuarios?.deleteOne(filter)
    if (result.deletedCount === 0) {
      res.status(500).send(`O usuário com o email ${email} não foi encontrado.`)
      return
    }

    res.status(200).send(`Usuário com o email ${email} deletado com sucesso.`)
  } catch (error) {
    res.status(500).send('Erro ao deletar usuário do banco de dados.')
  } finally {
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
