import dotenv from "dotenv"
import express, { Express } from "express"
import cors from "cors"
import mongoose, { Schema } from "mongoose"

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGO_URI!)

const personSchema = new Schema({ name: String })
const Person = mongoose.model("Person", personSchema)

// const john = new Person({ name: "John" })
// john.save()

app.get("/", (req, res) => {
  res.send("Server running")
})

app.get("/api/people", async (req, res) => {
  try {
    const peopleFromDatabase = await Person.find()
    res.json(peopleFromDatabase)
  } catch (error) {
    console.error("Error fetching people from the database:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})
app.get("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params
    const person = await Person.findById(id)

    if (!person) {
      return res.status(404).json({ error: "Person not found" })
    }

    res.json(person)
  } catch (error) {
    console.error("Error fetching person from the database:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})
app.post("/api/people", async (req, res) => {
  try {
    const { name } = req.body
    const newPerson = new Person({ name })
    await newPerson.save()
    res.json({ message: "Person added succefully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error adding person" })
  }
})

app.delete("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params
    const personToDelete = await Person.findById(id)

    if (!personToDelete) {
      return res.status(404).json({ error: "Person not found" })
    }

    await Person.deleteOne({ _id: personToDelete._id })
    res.json({ message: "Person deleted successfully" })
  } catch (error) {
    console.error("Error deleting person from the database:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
