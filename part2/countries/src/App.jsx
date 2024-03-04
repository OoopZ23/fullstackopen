import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const ObjectViewOne = ({c}) => {
  const [weather, setWeather] = useState(null)
  const [timerStart, setTimerStart] = useState(true)
  useEffect(() => {
    setTimerStart(true)
  }, [c.length])

  useEffect(() => { 
    if (weather) {
      document.getElementById('weather').innerHTML = `<p>temperature ${Math.round((weather.days[0].temp- 32)*5/9, 1)} Celcius</p><p>wind ${weather.days[0].windspeed} m/s</p>` 
    }
  },[weather])
  return(
    <>
      <h1>{c.name.common}</h1>
      <p>{"Capital"} {c.capital}</p>
      <p>{"Area"} {c.area}</p>
      <h3>{"languages:"}</h3>
      <ul key={c.name.common}>
        {Object.values(c.languages).map(lan => {
        return(
          <li key={lan}>
            {lan}
          </li>
        )})}
      </ul>
      <img src={c.flags.png}></img>
      <div>
        {
          (()=>{
            if(timerStart) {
              axios.
              get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${c.latlng[0]},${c.latlng[1]}?key=${api_key}`).
              then(response => {          
                setWeather(response.data)
                // console.log("then", response.data);
              })
              setTimerStart(false)
            }
          })()
        }
        {
          (()=> {
            setTimeout(() => {
              setTimerStart(true)
            }, 1800000)
          })()
        }
        <div id='weather'></div>
      </div>
    </>
  )
}

const ObjectViewTwo = ({c, i, showView}) => {
  return(
    <>
      <p>{c.name.common}</p>
      <button onClick={() => showView(i)}>hide</button>
      <p>{"Capital"} {c.capital}</p>
      <p>{"Area"} {c.area}</p>
      <p>{"languages:"}</p>
      <ul key={c.capital}>
        {Object.values(c.languages).map(lan => {
        return(
          <li key={lan}>
            {lan}
          </li>
        )})}
      </ul>
      <img src={c.flags.png}></img>
    </>
  )
}

const ObjectViewThree = ({c, i, showView}) => {
  return (
    <>
      <p key={i}>{c.name.common}</p>
      <button key={c.name.common} onClick={() => showView(i)}>show</button>
    </>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [countryView, setCountryView] = useState([])

  const onChangeCountries = event => {
    setFilter(event.target.value)
  }

  useEffect(() => {
      axios.
        get("https://studies.cs.helsinki.fi/restcountries/api/all").
        then(response => {
            setCountries(response.data)
          }
        )
    }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase()
  .includes(filter.toLocaleLowerCase()))

  useEffect(() => {
    setCountryView(new Array(filteredCountries.length).fill(false))
  }, [filteredCountries.length])
  
  const showView = (i) => {
    const view = [...countryView]
    view[i] = !view[i]
    setCountryView(view)
  }

  if (filteredCountries.length >= 10) {
    return (
      <>
        <label htmlFor={"search"}>{"find countries"}</label><input name='search' onChange={onChangeCountries}></input>
        <div>{"Too many matches, specify another filter"}</div>
      </>
    )
  } else if (filteredCountries.length === 1) {
    return (
      <>
        <label htmlFor={"search"}>{"find countries"}</label><input name='search' onChange={onChangeCountries}></input>
        <div>{filteredCountries
        .map(c => {
            return (
              <ObjectViewOne key={c.name.common} c={c}/>
            )
          })}
          </div>
      </>
    )
  } else {
    return (
      <>
        <label htmlFor={"search"}>{"find countries"}</label><input name='search' onChange={onChangeCountries}></input>
        <div>{filteredCountries
          .map((c, i) => {
              if (countryView[i]) {
                return (
                  <ObjectViewTwo key={i} c={c} i={i} showView={showView}/>
                ) 
              } else {
                return (
                  <ObjectViewThree key={i} c={c} i={i} showView={showView} />
                )
              }
          })}
        </div>
      </>
    )
  }
}

export default App
