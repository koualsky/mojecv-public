import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import getCookie from './utils';
import {languages_dict} from './languages';

export default class Rodo extends Component {
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
    this.props.upRodoDrag(this.state.items);
  };


  // UPDATE
  handle(e, field) {
    var new_items = this.state.items;

    if (field === 'rodo') { new_items[e.target.name].rodo = e.target.value }

    // UPDATE STATE
    new_items[e.target.name].idx = parseInt(e.target.name);
    this.setState({ new_items });

    // LIFT STATE UP TO CV
    this.props.upRodo(e);
  }


  // DELETE
  handleDelete(index) {

    let csrftoken = getCookie('csrftoken');
    // DELETE FROM DB
    axios.delete('/api/rodo/' + this.state.items[index].id, {
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
      this.props.upRodoCreateDelete(this.state.items);
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
    axios.post('/api/rodo/', data, {
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
        "rodo": "",
      });
      this.setState({items: newState});

      // LIFT STATE UP TO CV
      this.props.upRodoCreateDelete(this.state.items);
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



          <Button color="outline-white dragged-button container" id={'rodo_toggler' + index}>
            <div class="row align-items-center">
              <div class="col">
                <div class="m-0 text-left button-title row">

                  {this.state.items[index].rodo ? this.state.items[index].rodo.slice(0, 30) + '...' : (this.props.language == "pl" ? 'Wyrażam zgodę na przetwarzanie...' : 'I agree to the processing...')}
                </div>
                <div class="m-0 text-left mini-date row">-</div>
              </div>
              <div class="dragged-button-arrow text-right col-auto" dangerouslySetInnerHTML={{ __html: '&#9662;'}}></div>
            </div>
          </Button>



          <UncontrolledCollapse toggler={"#rodo_toggler" + index} className="roll_button">
            <Card>
              <CardBody>

                <div className="row">
                  <div className="col">
                    <label>{languages_dict[this.props.language]["rodo_content"]}</label>
                    <textarea
                      key={index}
                      className="form-control draggable-standard-input"
                      value={this.state.items[index].rodo ? this.state.items[index].rodo : (this.props.language == "pl" ? 'Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO).' : 'I agree to the processing of personal data provided in this document for realising the recruitment process pursuant to the Personal Data Protection Act of 10 May 2018 (Journal of Laws 2018, item 1000) and in agreement with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation).')}
                      name={index}
                      autocomplete="off"
                      onChange={(e) => this.handle(e, 'rodo')}
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
        <h5><span className="rodo-icon"></span>{languages_dict[this.props.language]["rodo"]}</h5>
        {listItems}
        <button type="button" class="btn btn-link btn-sm add_button" onClick={this.handleAdd}>
          + {languages_dict[this.props.language]["add"]}
        </button>
      </div>
    )
  }
}