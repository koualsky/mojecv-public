import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import getCookie from "./utils";
import {languages_dict} from './languages';

export default class EducationAndCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {items: this.props.items};
    this.handle = this.handle.bind(this);
  }


  // DRAG & DROP
  onDragStart = (e, index) => {
    this.draggedItem = this.state.items[index];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };


  onDragOver = index => {
    const draggedOverItem = this.state.items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.state.items.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    // update dragged item index
    items[index].idx = index;

    this.setState({ items });
  };


  onDragEnd = () => {
    this.draggedIdx = null;
    this.props.upEducationAndCoursesDrag(this.state.items);
  };


  // UPDATE
  handle(e, field) {
    var new_items = this.state.items;

    // Handle for all fields from model
    if (field === 'school') { new_items[e.target.name].school = e.target.value }
    if (field === 'degree') { new_items[e.target.name].degree = e.target.value }
    if (field === 'start_date') { new_items[e.target.name].start_date = e.target.value }
    if (field === 'end_date') { new_items[e.target.name].end_date = e.target.value }
    if (field === 'city') { new_items[e.target.name].city = e.target.value }
    if (field === 'description') { new_items[e.target.name].description = e.target.value }

    // UPDATE STATE
    new_items[e.target.name].idx = parseInt(e.target.name);
    this.setState({ new_items });

    // LIFT STATE UP TO CV
    this.props.upEducationAndCourses(e);
  }


  // DELETE
  handleDelete(index) {

    let csrftoken = getCookie('csrftoken');
    // DELETE FROM DB
    axios.delete('/api/education_and_courses/' + this.state.items[index].id, {
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
      }
    })
    .then(res => {
      // UPDATE VIEW - SET STATE
      var newState = this.state.items;
      newState.splice(index, 1); // delete method
      this.setState({items: newState});

      // LIFT STATE UP TO CV
      this.props.upEducationAndCoursesCreateDelete(this.state.items);
    })
    .catch(function (error) {
        console.log(error);
        alert('Sorry! Server is not able to process this request at the moment.');
    });
  }


  // CREATE
  handleAdd = () => {

    // Prepare
    let cv = this.props.cv;
    let idx = this.state.items.length;
    var data = {
      cv: cv,
      idx: idx,
    }


    let csrftoken = getCookie('csrftoken');
    // ADD to DB
    axios.post('/api/education_and_courses/', data, {
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
    })
    .then(response => {
      // UPDATE VIEW - SET STATE
      var newState = this.state.items;
      newState.push({ // TODO: Fill all fields from model - with empty data
        "id": response.data.id,
        "idx": idx,
        "cv": cv,
        "school": "",
        "degree": "",
        "start_date": "",
        "end_date": "",
        "city": "",
        "description": "",
      });
      this.setState({items: newState});

      // LIFT STATE UP TO CV
      this.props.upEducationAndCoursesCreateDelete(this.state.items);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  render() {

    // SORT LIST BY idx
    this.state.items.sort(function(a, b) {
      return a.idx - b.idx;
    });

    this.state.items.map((index, idx) => this.state.items[idx].idx = idx);

    var listItems = this.state.items.map((link, index) => (// ok
      <div key={index} name="sss" className="d-flex p-1 links" onDragOver={() => this.onDragOver(index)}>
        <div
          className="drag d-flex align-items-center p-2"
          draggable
          onDragStart={e => this.onDragStart(e, index)}
          onDragEnd={this.onDragEnd}
        >
        &#x2630;
        </div>

        <div style={{ display: 'block', width: '100%' }}>



          <Button color="outline-white dragged-button container" id={'education_and_courses_toggler' + index}>
            <div class="row align-items-center">
              <div class="col">
                <div class="m-0 text-left button-title row">
                  {this.state.items[index].school ? this.state.items[index].school : '-'}
                  {this.state.items[index].degree ? <div dangerouslySetInnerHTML={{ __html: ',&nbsp;'}}></div> : ''}
                  {this.state.items[index].degree ? this.state.items[index].degree : ''}
                </div>
                <div class="m-0 text-left mini-date row">{this.state.items[index].start_date} - {this.state.items[index].end_date}</div>
              </div>
              <div class="dragged-button-arrow text-right col-auto" dangerouslySetInnerHTML={{ __html: '&#9662;'}}></div>
            </div>
          </Button>



          <UncontrolledCollapse toggler={"#education_and_courses_toggler" + index} className="roll_button">
            <Card>
              <CardBody>

                <div className="row">
                  <div className="col">
                    <label>{languages_dict[this.props.language]["school"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].school}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_school"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'school')}
                    />
                  </div>

                  <div className="col">
                    <label>{languages_dict[this.props.language]["direction"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].degree}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_direction"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'degree')}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col d-flex w-50">
                    <div className="col w-25 pl-0">
                      <label>{languages_dict[this.props.language]["from"]}</label>
                      <input
                        key={index}
                        className="form-control draggable-standard-input"
                        value={this.state.items[index].start_date}
                        name={index}
                        //type="date"
                        placeholder={languages_dict[this.props.language]["placeholder_from"]}
                        autocomplete="off"
                        onChange={(e) => this.handle(e, 'start_date')}
                      />
                    </div>

                    <div className="col w-25 pr-0">
                      <label>{languages_dict[this.props.language]["to"]}</label>
                      <input
                        key={index}
                        className="form-control draggable-standard-input"
                        value={this.state.items[index].end_date}
                        name={index}
                        //type="date"
                        placeholder={languages_dict[this.props.language]["placeholder_to"]}
                        autocomplete="off"
                        onChange={(e) => this.handle(e, 'end_date')}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <label>{languages_dict[this.props.language]["city"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].city}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_city"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'city')}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>{languages_dict[this.props.language]["description"]}</label>
                    <textarea
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].description}
                      name={index}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'description')}
                    />
                  </div>
                </div>

              </CardBody>
            </Card>
          </UncontrolledCollapse>
        </div>

        <div
          className="delete d-flex align-items-center p-2"
          onClick={e => this.handleDelete(index)}
        >
        &#x2715;
        </div>

      </div>
    ));

    // RENDER
    return (
      <div>
        <h5><span className="education-and-courses-icon"></span>{languages_dict[this.props.language]["education_and_courses"]}</h5>
        {listItems}
        <button type="button" class="btn btn-link btn-sm add_button" onClick={this.handleAdd}>
          + {languages_dict[this.props.language]["add"]}
        </button>
      </div>
    )
  }
}