import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const InputField = ({text, onChange}) => {
  return (
    <div>
      {text}
      <input onChange={onChange}/>
    </div>
  )
}

const Button = ({text}) => {
  return (
    <div>
      <button type="submit">{text}</button>
    </div>
  )
}

const PersonForm = ({onSubmit, onChange}) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <InputField text = {"name: "} onChange={onChange[0]} />
        <InputField text = {"number: "} onChange={onChange[1]} />
        <Button text = {"add"}/>
      </form>
    </>
  )
}

const Persons = ({persons, filter, deleteContact}) => {
  return (
    <>
      {persons.filter((person) => person.name.toLowerCase().includes(filter.toLocaleLowerCase())).map(
        (person) => 
        { 
          return (
            <p key={person.id}>{person.name} {person.number} 
              <button onClick={()=>deleteContact(person.id)}>delete</button>
            </p>        
          )})}
    </>
  )
}

const Notification = ({message}) => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message === '') {
    return null
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')

  const onChangeNewName = (event) => {
    setNewName(event.target.value)
  }
  
  const onChangeNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const onChangeFilter = (event) => {
    setFilter(event.target.value)
  }

  const deleteContact = (id) => {
    const personDelete = persons => persons.filter((p) => p.id !== id)
      if (window.confirm(`Delete ${personDelete.name}?`)) {
        personsService.deletePerson(id).then(
          setPersons(personDelete)
        ).catch(
          error => {
              setMessage(`Information of ${personDelete.name} has already been removed from server`)
              setTimeout(() => {
                setMessage('')
              }, 5000)
          }
      )
    }
  }

  const addPhone = (event) => {
    event.preventDefault()
    const obj = {name:newName, number:newNumber, 
      id:(Number(persons[persons.length - 1].id) + 1).toString()}

    if (persons.find((person) => person.name===obj.name) && 
    persons.find((person) => person.number!==obj.number)) {
      if (window.confirm(`${obj.name} is already added to the phonebook,
       replace the old number with a new one?`)) {
        const objInner = persons.filter(p=>p.name===obj.name)[0]
        const pers = persons.map( o => {
            if (o.name===objInner.name) {
              return {...o, number: obj.number} 
            }
            return o
          }
        )   
        setPersons(pers)
        setMessage(`${obj.name} number is changed`)
        setTimeout(() => {
          setMessage('')
        }, 5000)
        personsService.changeNumber(objInner.id, obj)
      }
    } else if (persons.find((person) => person.name===obj.name)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setMessage(`Added ${obj.name}`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
      setPersons(persons.concat(obj))
      personsService.create(obj)
    }
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])// ???we can change to [persons] for refreshing???
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <InputField text = {"filter shown with "} onChange={onChangeFilter} />
      <h3>add a new</h3>
      <PersonForm onSubmit={addPhone} onChange={[onChangeNewName, onChangeNewNumber]}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deleteContact={deleteContact}/>
    </div>
  )
}

export default App
