import React, { Component } from 'react'
import axios from 'axios'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";





export default class QuizHome extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            QuestionArray: [],
            Counter: 0
        }
    }
    componentDidMount() {
        debugger
        axios.get("https://emerson.sharepoint.com/sites/autosolpss/EEEC/E-Learning/_api/web/lists/GetByTitle('QuestionList')/items").then((res) => {
            console.log(res.data.value)
            this.setState({
                QuestionArray: res.data.value
            })
            this.ShowData(res.data.value)
        })

    }

    handlechange = (e) => {
        var answer = e.target.value
        console.log(e.target.value)
        var CorrecAnswerArray = this.state.QuestionArray.filter(elem => (elem.Title == e.target.name && elem.CorrectAnswer == answer))
        console.log(CorrecAnswerArray)
        if (CorrecAnswerArray.length > 0) {
            this.setState({
                Counter: this.state.Counter + 1
            }, () => {
                console.log(this.state.Counter)
            })
        }
    }



    ShowData = (Obj) => {



    }
    render() {

        return (
            <div>

                <div className='card'>Please answer Questions</div>
                {this.state.QuestionArray.map(e => {
                    return (
                        <div className="quiz" id="quiz" data-toggle="buttons">
                            <label className="element-animation1 btn btn-lg btn-primary btn-block"><span className="btn-label"><i className="glyphicon glyphicon-chevron-right"></i> </span>  <span id={e.Title}>{e.Title}</span> </label> <br></br>
                            <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice1} /> <span className="ChoiceOption">{e.Choice1}</span><br />
                            <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice2} /><span className="ChoiceOption">{e.Choice2}</span><br />
                            <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice3} /><span className="ChoiceOption">{e.Choice3}</span><br />
                            <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice4} /> <span className="ChoiceOption">{e.Choice4}</span>

                        </div>
                    )

                })}
            </div>

        )
    }
}
