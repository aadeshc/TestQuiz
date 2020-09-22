import React, { Component } from 'react'
import axios from 'axios'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { convertCompilerOptionsFromJson } from 'typescript';
declare var _spPageContextInfo;


export default class QuizHome extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            QuestionArray: [],
            Counter: 0,
            isPassBoxVisible: false,
            isFailBoxVisible: false,
            ID: null,
            value: ""
        }
    }
    componentDidMount() {
        debugger


        this.GetCurrentUserID()
        axios.get("https://emerson.sharepoint.com/sites/autosolpss/EEEC/E-Learning/_api/web/lists/GetByTitle('QuestionList')/items").then((res) => {
            console.log(res.data.value)
            this.setState({
                QuestionArray: res.data.value,
                ExamName: res.data.value[0].ExamName
            })
            this.ShowData(res.data.value)
            this.CheckAttempts()

        })

    }

    public static getUserID(userName: any[]): number {
        var UserID;
        var arrayLength = userName.length;
        for (var i = 0; i < arrayLength; i++) {

            UserID = userName[0].id;
        }
        //return name.substr(1).slice(0, -1);
        return UserID;
    }

    CheckAttempts() {
        var newURL = `https://emerson.sharepoint.com/sites/autosolpss/EEEC/E-Learning/_api/web/lists/GetByTitle('UserList')/items?$filter=UserID eq ${this.state.UserID}`
        console.log(newURL)
        axios.get(newURL).then((response) => {
            console.log(response.data.value[0])
            if (response.data.value.length > 0) {
                this.setState({
                    Attempt: response.data.value[0].Attempts,
                    ID: response.data.value[0].ID,
                    Result: response.data.value[0].Result,
                    Method: "MERGE"
                }, () => {

                    console.log(this.state.Attempt)
                    if (this.state.Result == "PASS") {
                        alert("You Have Already Completed & Passed Training.")
                        var elem = document.getElementById("container")
                        elem.style.pointerEvents = "none";
                        elem.style.opacity = "0.3";

                    } else {


                        if (parseInt(this.state.Attempt) >= 3) {
                            alert("You have exceeded maximum allowed attempts\nPlease Contact EEEC Quality Team")
                            var elem = document.getElementById("container")
                            elem.style.pointerEvents = "none";
                            elem.style.opacity = "0.3";
                        }
                    }
                }
                )
            } else {

                this.setState({
                    Attempt: 0,
                    Method: "POST"
                })
            }

        })
    }

    GetCurrentUserID = () => {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser";
        axios.get(url).then((res) => {
            console.log(res.data.Id)
            this.setState({
                UserID: res.data.Id,
                Title: res.data.Title,
                Email: res.data.Email
            })
        })

    }

    UpdateListItem() {
        var listName = "UserList";

        if (this.state.Method == "MERGE") {
            var url = `https://emerson.sharepoint.com/sites/autosolpss/EEEC/E-Learning/_api/web/lists/GetByTitle('UserList')/items(${this.state.ID})`
        }
        else {
            var url = `https://emerson.sharepoint.com/sites/autosolpss/EEEC/E-Learning/_api/web/lists/GetByTitle('UserList')/items`


        }
        var configAxios = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $('#__REQUESTDIGEST').val(),
                "Access-Control-Allow-Origin": "*",
                "X-HTTP-Method": this.state.Method,
                "If-Match": "*",

                "Content-Type": "application/json;odata=verbose"
            }
        };
        var itemType = this.GetItemTypeForListName(listName);
        var data = {
            "__metadata": { "type": itemType },
            "Title": this.state.Title + "",
            "UserID": (this.state.UserID).toString(),
            "UserEmail": this.state.Email,
            "Result": this.state.Result,
            "Score": this.state.Marks + "%",
            "Attempts": (parseInt(this.state.Attempt) + 1).toString(),
            "ExamName": this.state.ExamName
        };
        axios.post(url, data, configAxios).then(function (req) {
            console.log('Success');
            window.location.reload()
        }).catch(function (err) {
            console.log('error during http call', err);
        });
    }
    GetItemTypeForListName(name) {
        return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
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





    handlesubmit = (e) => {

        this.setState({
            value: "disabled"
        })
        e.preventDefault();
        var marks = (this.state.Counter / 25) * 100;

        console.log(marks)
        if (marks >= 80) {
            alert("Congratulations! You have succesfully passed exam")
            this.setState({
                Result: "PASS",
                Marks: marks
            }, () => {
                this.UpdateListItem()
            })

        } else {

            alert("Unsuccessful Attempt,Please take test again")
            this.setState({
                Result: "Fail",
                Marks: marks
            }, () => {

                this.UpdateListItem()
            })
        }




    }

    render() {

        return (

            <div id="container">
                {/* <div className="alert alert-success" id={`box-${this.state.isPassBoxVisible ? "show" : "hidden"}`} >
                    <strong>Success!</strong> Congratulations! You have passed the exam.
                </div>
                <div className="alert alert-danger" id={`box-${this.state.isFailBoxVisible ? "show" : "hidden"}`} >
                    <strong>Unsuccessful attempt</strong> You need min 80 % to pass the exam.Please take test again.
</div> */}

                <form onSubmit={this.handlesubmit}>
                    <h3> EEEC HSE (ISO 14001 and 45001) Quiz </h3>
                    {this.state.QuestionArray.map(e => {
                        return (
                            <div className="quiz" id="quiz" data-toggle="buttons">
                                <label className="element-animation1 btn btn-lg btn-primary btn-block"><span className="btn-label"><i className="glyphicon glyphicon-chevron-right"></i> </span>  <span id={e.Title}>{e.Title}</span> </label> <br></br>
                                <input type="radio" required name={e.Title} onChange={this.handlechange} value={e.Choice1} /> <span className="ChoiceOption">{e.Choice1}</span><br />
                                <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice2} /><span className="ChoiceOption">{e.Choice2}</span><br />
                                <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice3} /><span className="ChoiceOption">{e.Choice3}</span><br />
                                <input type="radio" name={e.Title} onChange={this.handlechange} value={e.Choice4} /> <span className="ChoiceOption">{e.Choice4}</span>

                            </div>

                        )

                    })}

                    <button type="submit" disabled={this.state.value} className="btn btn-success" >Submit</button>
                </form>
            </div>

        )
    }
}
