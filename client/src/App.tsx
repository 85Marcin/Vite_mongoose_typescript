import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import axios from "axios"
import { ObjectId } from "mongodb"
import { nanoid } from "nanoid"

function App() {
  const [people, setPeople] = useState<{ _id: ObjectId; name: string }[]>([])
  const [newPersonName, setNewPersonName] = useState<string>("") //

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/people")
        const data = response.data
        setPeople(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchPeople()
  }, [])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the new person's name as the user types
    setNewPersonName(e.target.value)
  }

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`http://localhost:8000/api/people/${id}`)
      const nextPeople = people.filter((person) => person._id !== id)
      setPeople(nextPeople)
    } catch (error) {
      console.error("Error deleting :", error)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:8000/api/people", {
        name: newPersonName,
      })

      const newPerson = response.data
      setPeople([...people, newPerson])
      setNewPersonName("")
    } catch (error) {
      console.error("Error adding a new person:", error)
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new person's name"
          value={newPersonName}
          onChange={handleNameChange}
        />
        <button type="submit">Add Person</button>
      </form>
      <h1 className="text-5xl">List of People</h1>
      <ul>
        {people.map((person) => (
          <li key={nanoid()}>
            {person.name}
            <button onClick={() => handleDelete(person._id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
