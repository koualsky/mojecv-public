import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import getCookie from './utils';
import {languages_dict} from './languages';

export default class References extends Component {
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
    this.props.upReferencesDrag(this.state.items);
  };


  // UPDATE
  handle(e, field) {
    var new_items = this.state.items;

    // Handle for all fields from model
    if (field === 'referents_fullname') { new_items[e.target.name].referents_fullname = e.target.value }
    if (field === 'company') { new_items[e.target.name].company = e.target.value }
    if (field === 'phone') { new_items[e.target.name].phone = e.target.value }
    if (field === 'email') { new_items[e.target.name].email = e.target.value }

    // UPDATE STATE
    new_items[e.target.name].idx = parseInt(e.target.name);
    this.setState({ new_items });

    // LIFT STATE UP TO CV
    this.props.upReferences(e);
  }


  // DELETE
  handleDelete(index) {

    let csrftoken = getCookie('csrftoken');
    // DELETE FROM DB
    axios.delete('/api/references/' + this.state.items[index].id, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
    })
    .then(res => {
      // UPDATE VIEW - SET STATE
      var newState = this.state.items;
      newState.splice(index, 1);
      this.setState({items: newState});

      // LIFT STATE UP TO CV
      this.props.upReferencesCreateDelete(this.state.items);
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
    axios.post('/api/references/', data, {
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
        "referents_fullname": "",
        "company": "", // 1 // todo zrobić tu int. czyli zmienić chyba headersy na json/application a nie standard text.
        "phone": "",
        "email": "",
      });
      this.setState({items: newState});

      // LIFT STATE UP TO CV
      this.props.upReferencesCreateDelete(this.state.items);
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



          <Button color="outline-white dragged-button container" id={'references_toggler' + index}>
            <div class="row align-items-center">
              <div class="col">
                <div class="m-0 text-left button-title row">
                  {this.state.items[index].referents_fullname ? this.state.items[index].referents_fullname : '-'}
                </div>
                <div class="m-0 text-left mini-date row">
                  {this.state.items[index].company ? this.state.items[index].company : '-'}
                </div>
              </div>
              <div class="dragged-button-arrow text-right col-auto" dangerouslySetInnerHTML={{ __html: '&#9662;'}}></div>
            </div>
          </Button>



          <UncontrolledCollapse toggler={"#references_toggler" + index} className="roll_button">
            <Card>
              <CardBody>

                <div className="row">
                  <div className="col">
                    <label>{languages_dict[this.props.language]["referencer_first_and_last_name"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].referents_fullname}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_referencer_first_and_last_name"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'referents_fullname')}
                    />
                  </div>

                  <div className="col">
                    <label>{languages_dict[this.props.language]["company"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].company}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_referencer_company"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'company')}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>{languages_dict[this.props.language]["phone"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].phone}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_referencer_phone"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'phone')}
                    />
                  </div>

                  <div className="col">
                    <label>{languages_dict[this.props.language]["email"]}</label>
                    <input
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].email}
                      name={index}
                      placeholder={languages_dict[this.props.language]["placeholder_referencer_email"]}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'email')}
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
        <h5><span className="references-icon"></span>{languages_dict[this.props.language]["references"]}</h5>
        {listItems}
        <button type="button" class="btn btn-link btn-sm add_button" onClick={this.handleAdd}>
          + {languages_dict[this.props.language]["add"]}
        </button>
      </div>
    )
  }
}