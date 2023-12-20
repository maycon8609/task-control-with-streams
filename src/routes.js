import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handle: (request, response) => {
      const { search } = request.query

      const searchQuery = search ? { title: search, description: search } : null

      const users = database.select("tasks", searchQuery)

      return response.end(JSON.stringify(users))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handle: (request, response) => {
      const { title, description } = request.body

      const utcCreatedDate = new Date().toISOString()

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: utcCreatedDate,
        updated_at: utcCreatedDate
      }

      database.insert("tasks", task)

      return response.writeHead(201).end()
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handle: (request, response) => {
      const { id } = request.params
      const dataBody = request.body
      const updateData = { ...dataBody,  updated_at: new Date().toISOString() }

      database.update("tasks", id, updateData)

      return response.writeHead(204).end()
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handle: (request, response) => {
      const { id } = request.params

      database.delete("tasks", id)

      return response.writeHead(204).end()
    }
  }
]
