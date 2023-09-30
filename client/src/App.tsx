import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import axios from "axios"
import { ObjectId } from "mongodb"
import { nanoid } from "nanoid"

function App() {
  const [people, setPeople] = useState<{ _id: ObjectId; name: string }[]>([])
  const [newPersonName, setNewPersonName] = useState<string>("") // State variable for the new person's name

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
  }, [people])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the new person's name as the user types
    setNewPersonName(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent the default form submission behavior

    try {
      // Send a POST request to add the new person
      const response = await axios.post("http://localhost:8000/api/people", {
        name: newPersonName,
      })

      const newPerson = response.data
      setPeople([...people, newPerson])
      setNewPersonName("") // Clear the input field
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
            {person.name} <button>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
