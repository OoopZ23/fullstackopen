import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({value, text}) => {
  if (text === "positive") {
    return (
      <tr>
        <td>{text}</td> 
        <td>{value}%</td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{text}</td> 
        <td>{value}</td>
      </tr>
    )
  }

}

const Statistics = ({stats}) => {
  if (stats.good || stats.neutral || stats.bad) {
    return (
      <table>
        <tbody>
          <StatisticLine value = {stats.good} text = {"good"}/>
          <StatisticLine value = {stats.neutral} text = {"neutral"}/>
          <StatisticLine value = {stats.bad} text = {"bad"}/>
          <StatisticLine value = {stats.good + stats.neutral + stats.bad} text = {"all"}/>
          <StatisticLine value = {(stats.good - stats.bad) / (stats.good + stats.neutral + stats.bad)} 
          text = {"average"}/>
          <StatisticLine value = {stats.good / (stats.good + stats.neutral + stats.bad) * 100} 
          text = {"positive"}/>
        </tbody>
      </table>
    )
  } else {
    return (
      <div>
        No feedback given
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }
  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }
  const increaseBad = () => {
    setBad(bad + 1)
  }
  return (
    <div>
      <Header text = {"give feedback"}/>
      <Button onClick={increaseGood} text={"good"}/>
      <Button onClick={increaseNeutral} text={"neutral"}/>
      <Button onClick={increaseBad} text={"bad"}/>
      <Header text = {"statistics"}/>
      <Statistics stats = {{good:good, neutral:neutral, bad:bad}}/>
    </div>
  )
}

export default App
