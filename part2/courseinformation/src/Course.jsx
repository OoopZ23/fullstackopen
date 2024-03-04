const Header = ({text}) => {
    return (
      <h1>
        {text}
      </h1>
    )
  }
  
const Part = (props) => {
    return (
        <>
        <p>{props.name} {props.exercises}</p>
        </>
    )
}

const Content = ({parts}) => {
    return (
        <>
        {/* DO NOT FORGET KEY */}
        {parts.map((part) => <Part key={part.id} name ={part.name} exercises={part.exercises}/>)}
        </>
    )
}

const Statistics = ({parts}) => {
    return (
        <>
        <p>{"total of "} {parts.reduce((s, p) => s + p.exercises, 0)} {"exercices"}</p>
        </>
    )
}

const Course = ({course}) => {
    return (
        <>
        <Header text={course.name}/>
        <Content parts={course.parts}/>
        <Statistics parts={course.parts}/>
        </>
    )
}

export default Course;