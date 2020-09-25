import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import FormData from 'form-data';
import TextareaAutosize from 'react-textarea-autosize';
import { UncontrolledCollapse, Button, CardBody, Card, Progress, Spinner } from 'reactstrap';
import View from './View';
import SocialAndWebsites from './SocialAndWebsites';
import EmploymentHistory from './EmploymentHistory';
import EducationAndCourses from './EducationAndCourses';
import Skills from './Skills';
import Languages from './Languages';
import References from './References';
import Custom from './Custom';
import Rodo from './Rodo';
import getCookie from './utils';
import {languages_dict} from './languages';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default class Cv extends Component {
  constructor(props) {
    super(props);
    this.state = {
        response: [],
        count: this.props.sec,
        mount: false,
        clicked_more: false,
        closed: false,
        printpdf: false,
        chosenLanguage: "pl",

        social_and_websites_list: [],
        employment_history_list: [],
        education_and_courses_list: [],
        skills_list: [],
        languages_list: [],
        references_list: [],
        custom_list: [],
        rodo_list: [],

        social_and_websites_putlist: [],
        employment_history_putlist: [],
        education_and_courses_putlist: [],
        skills_putlist: [],
        languages_putlist: [],
        references_putlist: [],
        custom_putlist: [],
        rodo_putlist: [],

        social_and_websites_putlist_create: [],
        employment_history_putlist_create: [],
        education_and_courses_putlist_create: [],
        skills_putlist_create: [],
        languages_putlist_create: [],
        references_putlist_create: [],
        custom_putlist_create: [],
        rodo_putlist_create: [],
    };

    // Handle Main Cv and special one for photo
    this.handleCv = this.handleCv.bind(this);
    this.handleCvPhoto = this.handleCvPhoto.bind(this);
    //this.handleCvTemplatePhoto = this.handleCvTemplatePhoto.bind(this);

    // Lift State Up Social And Websites
    this.upSocialAndWebsites = this.upSocialAndWebsites.bind(this);
    this.upSocialAndWebsitesDrag = this.upSocialAndWebsitesDrag.bind(this);
    this.upSocialAndWebsitesCreateDelete = this.upSocialAndWebsitesCreateDelete.bind(this);

    // Lift State Up Employment History
    this.upEmploymentHistory = this.upEmploymentHistory.bind(this);
    this.upEmploymentHistoryDrag = this.upEmploymentHistoryDrag.bind(this);
    this.upEmploymentHistoryCreateDelete = this.upEmploymentHistoryCreateDelete.bind(this);

    // Lift State Up Education And Courses
    this.upEducationAndCourses = this.upEducationAndCourses.bind(this);
    this.upEducationAndCoursesDrag = this.upEducationAndCoursesDrag.bind(this);
    this.upEducationAndCoursesCreateDelete = this.upEducationAndCoursesCreateDelete.bind(this);

    // Lift State Up Skills
    this.upSkills = this.upSkills.bind(this);
    this.upSkillsDrag = this.upSkillsDrag.bind(this);
    this.upSkillsCreateDelete = this.upSkillsCreateDelete.bind(this);

    // Lift State Up Languages
    this.upLanguages = this.upLanguages.bind(this);
    this.upLanguagesDrag = this.upLanguagesDrag.bind(this);
    this.upLanguagesCreateDelete = this.upLanguagesCreateDelete.bind(this);

    // Lift State Up References
    this.upReferences = this.upReferences.bind(this);
    this.upReferencesDrag = this.upReferencesDrag.bind(this);
    this.upReferencesCreateDelete = this.upReferencesCreateDelete.bind(this);

    // Lift State Up Custom
    this.upCustom = this.upCustom.bind(this);
    this.upCustomDrag = this.upCustomDrag.bind(this);
    this.upCustomCreateDelete = this.upCustomCreateDelete.bind(this);

    // Lift State Up Rodo
    this.upRodo = this.upRodo.bind(this);
    this.upRodoDrag = this.upRodoDrag.bind(this);
    this.upRodoCreateDelete = this.upRodoCreateDelete.bind(this);
  }

  printPdf() {
    let csrftoken = getCookie('csrftoken');
    axios.get('/api/user/' + this.state.response.author, {
      headers: {
            'X-CSRFToken': csrftoken,
            'Origin': 'https://mojecv.herokuapp.com',
            'Access-Control-Allow-Origin': '*'
          }
    }).then(res2 => {
      const premiums = res2.data.profile.premiums;
      let user_premium_date = new Date(premiums)
      let now = new Date()

      if ((user_premium_date > now) | (this.state.response.template == 1)) {

        window.scrollTo(0,0);
        document.documentElement.style.overflow = 'hidden';

        // A4 format
        let scale = 2.82; // ta proporcja jest idealna for A4 format :)
        let doc = new jsPDF('p', 'mm', [297*scale, 210*scale]);
        let element = document.querySelector("#capture");

        html2canvas(
            element, {
              scale: 12,
              allowTaint: false,
              useCORS: true,
            }
        ).then(canvas => {
          this.setState({printpdf: !this.state.printpdf });
          doc.addImage(canvas, "PNG", 0, 0, 210, 297, 'cv', 'NONE');
          doc.save('CV.pdf');
          document.documentElement.style.overflow = '';
        });
      } else {
        this.setState({printpdf: !this.state.printpdf });
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
      }
    })
  }

  base64ToBlob(base64, mime) {
      mime = mime || '';
      let sliceSize = 1024;
      let byteChars = window.atob(base64);
      let byteArrays = [];

      for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
          let slice = byteChars.slice(offset, offset + sliceSize);

          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, {type: mime});
  }

  sendAllOthers() {
    if (this.state.social_and_websites_list) this.sendSocialAndWebsites(this.state.social_and_websites_list);
    if (this.state.employment_history_list) this.sendEmploymentHistory(this.state.employment_history_list);
    if (this.state.education_and_courses_list) this.sendEducationAndCourses(this.state.education_and_courses_list);
    if (this.state.skills_list) this.sendSkills(this.state.skills_list);
    if (this.state.languages_list) this.sendLanguages(this.state.languages_list);
    if (this.state.references_list) this.sendReferences(this.state.references_list);
    if (this.state.custom_list) this.sendCustom(this.state.custom_list);
    if (this.state.rodo_list) this.sendRodo(this.state.rodo_list);

    if (this.state.social_and_websites_putlist) this.sendSocialAndWebsites(this.state.social_and_websites_putlist);
    if (this.state.employment_history_putlist) this.sendEmploymentHistory(this.state.employment_history_putlist);
    if (this.state.education_and_courses_putlist) this.sendEducationAndCourses(this.state.education_and_courses_putlist);
    if (this.state.skills_putlist) this.sendSkills(this.state.skills_putlist);
    if (this.state.languages_putlist) this.sendLanguages(this.state.languages_putlist);
    if (this.state.references_putlist) this.sendReferences(this.state.references_putlist);
    if (this.state.custom_putlist) this.sendCustom(this.state.custom_putlist);
    if (this.state.rodo_putlist) this.sendRodo(this.state.rodo_putlist);

    if (this.state.social_and_websites_putlist_create) this.sendSocialAndWebsites(this.state.social_and_websites_putlist_create);
    if (this.state.employment_history_putlist_create) this.sendEmploymentHistory(this.state.employment_history_putlist_create);
    if (this.state.education_and_courses_putlist_create) this.sendEducationAndCourses(this.state.education_and_courses_putlist_create);
    if (this.state.skills_putlist_create) this.sendSkills(this.state.skills_putlist_create);
    if (this.state.languages_putlist_create) this.sendLanguages(this.state.languages_putlist_create);
    if (this.state.references_putlist_create) this.sendReferences(this.state.references_putlist_create);
    if (this.state.custom_putlist_create) this.sendCustom(this.state.custom_putlist_create);
    if (this.state.rodo_putlist_create) this.sendRodo(this.state.rodo_putlist_create);
  }

  componentDidMount() {

    // Get data
    let csrftoken = getCookie('csrftoken');
    axios.get('/api/cv/' + this.props.id, {
      headers: {
        'X-CSRFToken': csrftoken,
        'Origin': 'https://mojecv.herokuapp.com',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(res => {
        const response = res.data;
        this.setState({ response });
        this.setState({ chosenLanguage: response.language });
        this.setState({ mount: true })
      })
  }

  // CV
  sendCv = event => {
    let data = {
        title: this.state.response.title,
        job_title: this.state.response.job_title,
        first_name: this.state.response.first_name,
        last_name: this.state.response.last_name,
        email: this.state.response.email,
        phone: this.state.response.phone,
        country: this.state.response.country,
        city: this.state.response.city,
        street_and_number: this.state.response.street_and_number,
        postal_code: this.state.response.postal_code,
        place_of_birth: this.state.response.place_of_birth,
        date_of_birth: this.state.response.date_of_birth,
        professional_summary: this.state.response.professional_summary,
        hobbies: this.state.response.hobbies,
        template: this.state.response.template,
        language: this.state.chosenLanguage,
    }

    let csrftoken = getCookie('csrftoken');
    axios.put('/api/cv/' + this.props.id + '/', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
    })
    .then(res => {
      //console.log(res.data);
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  handleCv(field, e) {

    e.preventDefault();
    // UPDATE PREVIEW
    let newState = JSON.parse(JSON.stringify(this.state.response));
    newState[field] = e.target.value;
    this.setState({response: newState, count: this.props.sec});
    this.props.onHandleUp(this.state.count, newState);


    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, newState);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, newState);

        // PUT
        this.sendCv(e);
        if (this.state.social_and_websites_list) this.sendSocialAndWebsites(this.state.social_and_websites_list);
        if (this.state.employment_history_list) this.sendEmploymentHistory(this.state.employment_history_list);
        if (this.state.education_and_courses_list) this.sendEducationAndCourses(this.state.education_and_courses_list);
        if (this.state.skills_list) this.sendSkills(this.state.skills_list);
        if (this.state.languages_list) this.sendLanguages(this.state.languages_list);
        if (this.state.references_list) this.sendReferences(this.state.references_list);
        if (this.state.custom_list) this.sendCustom(this.state.custom_list);
      }
    }, 1000);
  }

  handleCvPhoto(e) {
    // UPDATE PREVIEW
    let newState = JSON.parse(JSON.stringify(this.state.response));
    newState.photo = e.target.files[0];

    // UPDATE DB
    e.preventDefault();
    let data_photo = new FormData();
    data_photo.append('photo', newState.photo, this.state.response.id+'.jpg');

    let csrftoken = getCookie('csrftoken');
    axios.put('/api/cv/' + this.props.id + '/', data_photo, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
        'Origin': 'https://mojecv.herokuapp.com',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => {
      //console.log(res.data);
      newState.photo = res.data.photo;
      this.setState({response: newState});

      // TODO: dzięki temu obrazek się zmienia po uploadzie. bez tego uploaduje się, ale nie widać go dopóki się nie przeładuje
      setTimeout(function () {
        window.location.href="";
    }, 2000);
    })
    .catch(function (error) {
        console.log(error);
        alert('Sorry! Server is not able to process this request at the moment.');
    });
  }


  handleCvTemplatePhoto() {
    window.scrollTo(0,0);
    document.documentElement.style.overflow = 'hidden';

    let csrftoken = getCookie('csrftoken');

    // CANVAS
    let element = document.querySelector("#capture");

    html2canvas(
        element, {
          scale: 1,
          // todo
          //logging: true,
          allowTaint: false,
          useCORS: true,
        }
    ).then(canvas => {

      // RESIZE
      let target_width = 300;
      let target_height = 425;
      let extra_canvas = document.createElement("canvas");
      extra_canvas.setAttribute('width', target_width);
      extra_canvas.setAttribute('height', target_height);

      let ctx = extra_canvas.getContext('2d');
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, target_width, target_height);
      let jpegFile = extra_canvas.toDataURL("image/jpeg");
      let jpegFile64 = jpegFile.replace(/^data:image\/(png|jpeg);base64,/, "");
      let jpegBlob = this.base64ToBlob(jpegFile64, 'image/jpeg');
      let data = new FormData();
      data.append('cv_photo', jpegBlob, this.state.response.id+'.jpg');
      axios.put('/api/cv/' + this.props.id + '/', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': csrftoken,
              'Origin': 'https://mojecv.herokuapp.com',
              'Access-Control-Allow-Origin': '*',
              'Cross-Origin': 'anonymous',
              'CrossOrigin': 'anonymous',
            }
          }).then(res => {
            console.log(res.data);
            window.location.href="/?eraseCache=true";
          }).catch(function (error) {
            console.log(error);
            window.location.href="/?eraseCache=true";
          });
    });
  }



  // SOCIAL AND WEBSITES
  sendSocialAndWebsites = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.social_and_websites[id].id;
      let data = {
        cv: this.state.response.id,
        link: this.state.response.social_and_websites[id].link,
        idx: this.state.response.social_and_websites[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/social_and_websites/' + pk + '/', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({social_and_websites_list: []});
  }

  // UPDATE
  upSocialAndWebsites(e) {

    var newState2 = this.state.social_and_websites_list;
    if (this.state.social_and_websites_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({social_and_websites_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upSocialAndWebsitesDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.social_and_websites = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.social_and_websites.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({social_and_websites_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upSocialAndWebsitesCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.social_and_websites = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.social_and_websites.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    // Tworzy putliste ID social_and_websites ktore zostaly zmodyfikowane
    this.setState({social_and_websites_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // EMPLOYMENT HISTORY
  sendEmploymentHistory = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.employment_history[id].id;
      let data = {
        cv: this.state.response.id,
        job_title: this.state.response.employment_history[id].job_title,
        employer: this.state.response.employment_history[id].employer,
        start_date: this.state.response.employment_history[id].start_date,
        end_date: this.state.response.employment_history[id].end_date,
        city: this.state.response.employment_history[id].city,
        description: this.state.response.employment_history[id].description,
        idx: this.state.response.employment_history[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/employment_history/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({employment_history_list: []});
  }

  // UPDATE
  upEmploymentHistory(e) {

    var newState2 = this.state.employment_history_list;
    if (this.state.employment_history_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({employment_history_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upEmploymentHistoryDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.employment_history = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.employment_history.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    // Tworzy putliste ID social_and_websites ktore zostaly zmodyfikowane
    this.setState({employment_history_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upEmploymentHistoryCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.employment_history = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.employment_history.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({employment_history_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // EDUCATION AND COURSES
  sendEducationAndCourses = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.education_and_courses[id].id;
      let data = {
        cv: this.state.response.id,
        school: this.state.response.education_and_courses[id].school,
        degree: this.state.response.education_and_courses[id].degree,
        start_date: this.state.response.education_and_courses[id].start_date,
        end_date: this.state.response.education_and_courses[id].end_date,
        city: this.state.response.education_and_courses[id].city,
        description: this.state.response.education_and_courses[id].description,
        idx: this.state.response.education_and_courses[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/education_and_courses/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({education_and_courses_list: []});
  }

  // UPDATE
  upEducationAndCourses(e) {

    var newState2 = this.state.education_and_courses_list;
    if (this.state.education_and_courses_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({education_and_courses_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upEducationAndCoursesDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.education_and_courses = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.education_and_courses.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({education_and_courses_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upEducationAndCoursesCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.education_and_courses = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.education_and_courses.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({education_and_courses_putlist_create: putlist});

    // UPDATE DATABASE
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // SKILLS
  sendSkills = e => {

    e.forEach(id => {

      let pk = this.state.response.skills[id].id;
      let data = {
        cv: this.state.response.id,
        skill: this.state.response.skills[id].skill,
        level: this.state.response.skills[id].level,
        idx: this.state.response.skills[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/skills/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({skills_list: []});
  }

  // UPDATE
  upSkills(e) {

    var newState2 = this.state.skills_list;
    if (this.state.skills_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({skills_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upSkillsDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.skills = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.skills.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({skills_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upSkillsCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.skills = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.skills.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({skills_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // LANGUAGES
  sendLanguages = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.languages[id].id;
      let data = {
        cv: this.state.response.id,
        language: this.state.response.languages[id].language,
        level: this.state.response.languages[id].level,
        idx: this.state.response.languages[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/languages/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({languages_list: []});
  }

  // UPDATE
  upLanguages(e) {

    var newState2 = this.state.languages_list;
    if (this.state.languages_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({languages_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upLanguagesDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.languages = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.languages.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({languages_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upLanguagesCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.languages = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.languages.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({languages_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // REFERENCES
  sendReferences = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.references[id].id;
      let data = {
        cv: this.state.response.id,
        referents_fullname: this.state.response.references[id].referents_fullname,
        company: this.state.response.references[id].company,
        phone: this.state.response.references[id].phone,
        email: this.state.response.references[id].email,
        idx: this.state.response.references[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/references/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({references_list: []});
  }

  // UPDATE
  upReferences(e) {

    var newState2 = this.state.references_list;
    if (this.state.references_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({references_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upReferencesDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.references = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.references.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({references_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upReferencesCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.references = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.references.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({references_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // CUSTOM
  sendCustom = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.custom[id].id;
      let data = {
        cv: this.state.response.id,
        activity: this.state.response.custom[id].activity,
        city: this.state.response.custom[id].city,
        description: this.state.response.custom[id].description,
        start_date: this.state.response.custom[id].start_date,
        end_date: this.state.response.custom[id].end_date,
        idx: this.state.response.custom[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/custom/' + pk + '/', data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({custom_list: []});
  }

  // UPDATE
  upCustom(e) {

    var newState2 = this.state.custom_list;
    if (this.state.custom_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({custom_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upCustomDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.custom = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.custom.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({custom_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upCustomCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.custom = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.custom.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({custom_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // RODO
  sendRodo = e => {

    // axios.PUT for every id in list
    e.forEach(id => {

      // DATA FOR PUT FROM RECEIVED BY e ID
      let pk = this.state.response.rodo[id].id;
      let data = {
        cv: this.state.response.id,
        rodo: this.state.response.rodo[id].rodo,
        idx: this.state.response.rodo[id].idx,
      }

      let csrftoken = getCookie('csrftoken');
      // PUT
      axios.put('/api/rodo/' + pk + '/', data, {
        headers: {
          //'accept': 'application/json',
          //'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        }
      })
        .then(res => {
          //console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
      });
    });

    // After PUT, reset list
    this.setState({rodo_list: []});
  }

  // UPDATE
  upRodo(e) {

    var newState2 = this.state.rodo_list;
    if (this.state.rodo_list.indexOf(e.target.name) === -1) {
      newState2.push(e.target.name);
      this.setState({rodo_list: newState2});
    }

    // UPDATE PREVIEW - restart counter for save
    this.setState({count: this.props.sec});

    // SET STATE
    var neww = this.state.response;
    this.setState({response: neww});

    // UPDATE DB
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      this.props.onHandleUp(this.state.count, neww);
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});
        this.props.onHandleUp(this.state.count, neww);

        // PUT
        this.sendCv(e);
        this.sendAllOthers();
      }
    }, 1000);
  }

  // UPDATE
  upRodoDrag(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.rodo = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.rodo.length;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({rodo_putlist: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }

  // CREATE & DELETE
  upRodoCreateDelete(list) {

    // UPDATE STATE
    let newState = this.state.response;
    newState.rodo = list;
    this.setState({response: newState});

    // Make social and websites list for axios.put
    var putlist = [];
    var len = this.state.response.rodo.length - 1;
    var i;
    for (i = 0; i < len; i++) {
      putlist.push(i);
    }

    this.setState({rodo_putlist_create: putlist});

    // UPDATE DATABASE - restart counter for save
    this.setState({count: this.props.sec});

    // UPDATE DB (PUT)
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({count: this.state.count - 1});
      if (this.state.count === 0) {
        clearInterval(this.interval);
        this.setState({count: this.props.sec});

        // PUT
        this.sendCv();
        this.sendAllOthers();
      }
    }, 1000);
  }


  // PROGRES VALUE
  progressValue() {

    // Data
    let data = this.state.response;

    // Count
    let count = 0;

    // Add to the all_list if exist
    if (data.first_name) count += 1;
    if (data.last_name) count += 1;
    if (data.job_title) count += 1;
    if (data.email) count += 1;
    if (data.phone) count += 1;
    if (data.photo) count += 1;
    if (data.professional_summary) count += 1;
    if (data.hobbies) count += 1;

    if (data.social_and_websites && data.social_and_websites.length) count += 1;
    if (data.employment_history && data.employment_history.length) count += 1;
    if (data.education_and_courses && data.education_and_courses.length) count += 1;
    if (data.skills && data.skills.length) count += 1;
    if (data.languages && data.languages.length) count += 1;
    if (data.references && data.references.length) count += 1;

    return Math.round(count * 7.14);
  }

  closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
  }


  // HANDLE LANGUAGE
  handleLanguage = (event) => {
    this.setState({chosenLanguage: event.target.value});
    this.handleCv('language', event);
  }


  render() {
    return (
      <div>

        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close_modal" onClick={this.closeModal}>&times;</span>
            <div className="modal_content">
              <p className="modal_title">Premium</p>
              <p className="cytat">
                "Kup premium i korzystaj z nielimitowanego dostęp do wszystkich szablonów premium"
              </p>
              <a className="btn btn-sm btn-primary" href="../../pricing">Zobacz ofertę</a>
            </div>
          </div>
        </div>

        <div id="model" className="left">

          <div className="process_line_top">
            <Progress color="success" className="process_line_top_progress" value={this.progressValue()}>
              {this.progressValue()}%
            </Progress>
          </div>

        <form onSubmit={this.sendCv} class="personal_info">
          <div className="form-group">
            {/* <p><button type="submit">Save</button></p> */}

            <input
                className="form-control title"
                type="text"
                name="title"
                value={this.state.response.title}
                placeholder={languages_dict[this.state.chosenLanguage]["placeholder_title"]}
                autocomplete="off"
                onChange={(e) => this.handleCv('title', e)} />
          </div>

          <div style={{textAlign: "center", marginTop: "-18px"}}>

            { this.state.chosenLanguage == "pl" ?
                <Button value="pl" className="pl_language_active" onClick={this.handleLanguage}></Button>
                :
                <Button value="pl" className="pl_language" onClick={this.handleLanguage}></Button>
            }

            { this.state.chosenLanguage == "eng" ?
                <Button value="eng" className="eng_language_active" onClick={this.handleLanguage}></Button>
                :
                <Button value="eng" className="eng_language" onClick={this.handleLanguage}></Button>
            }

          </div>

          <h5><span className="personal-info-icon"></span>{languages_dict[this.state.chosenLanguage]["personal_informations"]}</h5>

          <div className="row">
            <div className="col">
            <label>{languages_dict[this.state.chosenLanguage]["job_title"]}</label>
            <input
                className="form-control standard"
                type="text"
                name="job_title"
                value={this.state.response.job_title}
                placeholder="Assembler Programmer"
                autocomplete="off"
                onChange={(e) => this.handleCv('job_title', e)} />
            </div>

            <div className="col">
            <label for="photo" className="form-control-file-label">
              <img
                id="avatar"
                src={this.state.response.photo ? this.state.response.photo : "https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/empty-avatar.jpg"}
                alt=" "
                className="photo"
              />
              <span className="form-control-file-label-text">{languages_dict[this.state.chosenLanguage]["add_photo"]}</span>
            </label>
            <input
                className="form-control-file"
                type="file"
                id="photo"
                name="photo"
                accept="image/png, image/jpeg"
                onChange={this.handleCvPhoto} />
            </div>
          </div>

          <div className="row">
            <div className="col">
            <label>{languages_dict[this.state.chosenLanguage]["first_name"]}</label>
            <input
                className="form-control standard"
                type="text"
                name="first_name"
                value={this.state.response.first_name}
                placeholder={languages_dict[this.state.chosenLanguage]["placeholder_first_name"]}
                autocomplete="off"
                onChange={(e) => this.handleCv('first_name', e)} />
            </div>

            <div className="col">
            <label>{languages_dict[this.state.chosenLanguage]["last_name"]}</label>
            <input
                className="form-control standard"
                type="text"
                name="last_name"
                autocomplete="off"
                value={this.state.response.last_name}
                placeholder={languages_dict[this.state.chosenLanguage]["placeholder_last_name"]}
                onChange={(e) => this.handleCv('last_name', e)} />
            </div>
          </div>

          <div className="row">
            <div className="col">
            <label>{languages_dict[this.state.chosenLanguage]["email"]}</label>
            <input
                className="form-control standard"
                type="email"
                name="email"
                value={this.state.response.email}
                placeholder={languages_dict[this.state.chosenLanguage]["placeholder_email"]}
                autocomplete="off"
                onChange={(e) => this.handleCv('email', e)} />
            </div>

            <div className="col">
            <label>{languages_dict[this.state.chosenLanguage]["phone"]}</label>
            <input
                className="form-control standard"
                type="text"
                name="phone"
                value={this.state.response.phone}
                placeholder={languages_dict[this.state.chosenLanguage]["placeholder_phone"]}
                autocomplete="off"
                onChange={(e) => this.handleCv('phone', e)} />
            </div>
          </div>

          <UncontrolledCollapse toggler="#cv_toggler">
            <Card>
              <CardBody>
                <div className="row">
                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["professional_summary"]}</label>
                  <TextareaAutosize
                      className="form-control standard"
                      type="text"
                      name="professional_summary"
                      value={this.state.response.professional_summary}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_professional_summary"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('professional_summary', e)} />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["country"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="country"
                      value={this.state.response.country}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_country"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('country', e)} />
                  </div>

                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["city"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="city"
                      value={this.state.response.city}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_city"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('city', e)} />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["street_and_number"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="street_and_number"
                      value={this.state.response.street_and_number}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_street_and_number"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('street_and_number', e)} />
                  </div>

                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["postcode"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="postal_code"
                      value={this.state.response.postal_code}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_postcode"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('postal_code', e)} />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["place_of_birth"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="place_of_birth"
                      value={this.state.response.place_of_birth}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_place_of_birth"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('place_of_birth', e)} />
                  </div>

                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["date_of_birth"]}</label>
                  <input
                      className="form-control standard"
                      //type="data"
                      name="date_of_birth"
                      value={this.state.response.date_of_birth}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_date_of_birth"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('date_of_birth', e)} />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                  <label>{languages_dict[this.state.chosenLanguage]["hobbies"]}</label>
                  <input
                      className="form-control standard"
                      type="text"
                      name="hobbies"
                      value={this.state.response.hobbies}
                      placeholder={languages_dict[this.state.chosenLanguage]["placeholder_hobbies"]}
                      autocomplete="off"
                      onChange={(e) => this.handleCv('hobbies', e)} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </UncontrolledCollapse>

          {this.state.chosenLanguage == "pl" ?
          <Button color="link" class="btn btn-link" id="cv_toggler" value="red" onClick={() => this.setState({ clicked_more: !this.state.clicked_more })}>{this.state.clicked_more ? <div class="cv_toggler btn-sm" dangerouslySetInnerHTML={{ __html: 'Mniej&nbsp; &#9652;'}}></div> : <div class="cv_toggler btn-sm" dangerouslySetInnerHTML={{ __html: 'Więcej szczegółów&nbsp; &#9662;'}}></div>}</Button>
          :
          <Button color="link" class="btn btn-link" id="cv_toggler" value="red" onClick={() => this.setState({ clicked_more: !this.state.clicked_more })}>{this.state.clicked_more ? <div class="cv_toggler btn-sm" dangerouslySetInnerHTML={{ __html: 'Less&nbsp; &#9652;'}}></div> : <div class="cv_toggler btn-sm" dangerouslySetInnerHTML={{ __html: 'More details&nbsp; &#9662;'}}></div>}</Button>
          }

        </form>

        {/* SOCIAL AND WEBSITES */}
        {this.state.mount ?
          <SocialAndWebsites
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.social_and_websites}
            upSocialAndWebsites={this.upSocialAndWebsites}
            upSocialAndWebsitesDrag={this.upSocialAndWebsitesDrag}
            upSocialAndWebsitesCreateDelete={this.upSocialAndWebsitesCreateDelete}
          /> : '...'}

        {/* EMPLOYMENT HISTORY */}
        {this.state.mount ?
          <EmploymentHistory
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.employment_history}
            upEmploymentHistory={this.upEmploymentHistory}
            upEmploymentHistoryDrag={this.upEmploymentHistoryDrag}
            upEmploymentHistoryCreateDelete={this.upEmploymentHistoryCreateDelete}
          /> : '...'}

        {/* EDUCATION AND COURSES */}
        {this.state.mount ?
          <EducationAndCourses
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.education_and_courses}
            upEducationAndCourses={this.upEducationAndCourses}
            upEducationAndCoursesDrag={this.upEducationAndCoursesDrag}
            upEducationAndCoursesCreateDelete={this.upEducationAndCoursesCreateDelete}
          /> : '...'}

        {/* SKILLS */}
        {this.state.mount ?
          <Skills
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.skills}
            upSkills={this.upSkills}
            upSkillsDrag={this.upSkillsDrag}
            upSkillsCreateDelete={this.upSkillsCreateDelete}
          /> : '...'}

        {/* LANGUAGES */}
        {this.state.mount ?
          <Languages
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.languages}
            upLanguages={this.upLanguages}
            upLanguagesDrag={this.upLanguagesDrag}
            upLanguagesCreateDelete={this.upLanguagesCreateDelete}
          /> : '...'}

        {/* REFERENCES */}
        {this.state.mount ?
          <References
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.references}
            upReferences={this.upReferences}
            upReferencesDrag={this.upReferencesDrag}
            upReferencesCreateDelete={this.upReferencesCreateDelete}
          /> : '...'}

        {/* CUSTOM */}
        {this.state.mount ?
          <Custom
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.custom}
            upCustom={this.upCustom}
            upCustomDrag={this.upCustomDrag}
            upCustomCreateDelete={this.upCustomCreateDelete}
          /> : '...'}

        {/* RODO */}
        {this.state.mount ?
          <Rodo
            cv={this.props.id}
            language={this.state.chosenLanguage}
            items={this.state.response.rodo}
            upRodo={this.upRodo}
            upRodoDrag={this.upRodoDrag}
            upRodoCreateDelete={this.upRodoCreateDelete}
          /> : '...'}

        </div>

        {/* Saving circle */}
        <div id="view" className="right">
          <div className="centered">
            <div className="centered_status_bar">
              {(this.state.count !== this.props.sec) ? <span className="saving">
                <div
                  class="spinner-border spinner-border-sm text-white inline"
                  role="status">
                  <span className="sr-only"></span>
                </div>
              &nbsp;{this.state.count} {languages_dict[this.state.chosenLanguage]["saving"]}
              </span> : <span className="saved">{languages_dict[this.state.chosenLanguage]["saved"]}</span>}

              <Button color="primary btn-sm mt-2 font-weight-bold cv-print-button" onClick={() => {
                this.setState({printpdf: !this.state.printpdf });
                this.printPdf();
              }}>
                {this.state.printpdf ? <Spinner size="sm" color='light' /> : <span>{languages_dict[this.state.chosenLanguage]["print_resume"]}</span>}
              </Button>

              <Button color="primary btn-sm mt-2 font-weight-bold cv-close-button" id="closed" aria-label="Close" onClick={() => {
                this.setState({ closed: !this.state.closed });
                this.handleCvTemplatePhoto();
              }}>
                {this.state.closed ? <Spinner size="sm" color='light' /> : <span aria-hidden="true">{languages_dict[this.state.chosenLanguage]["save_and_close"]}</span>}
              </Button>

            </div>

            <div className="cv_pdf">

              <View response={this.state.response} language={this.state.chosenLanguage} />

            </div>
          </div>
          <div className="right-choose-template">

            <div className="mt-1"></div>

            <div className="row m-0">
              <div className="col p-0">
                <label className="label_template">Madrid</label>
                <span className={"free"}>Free</span>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_1.jpg"
                    className={this.state.response.template == 1 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={1}
                    onClick={(e) => this.handleCv('template', e)} />
              </div>

              <div className="col p-0">
                <label className="label_template">Perth</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_2.jpg"
                    className={this.state.response.template == 2 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={2}
                    onClick={(e) => this.handleCv('template', e)}/>
              </div>
            </div>

            <div className="row m-0">
              <div className="col p-0">
                <label className="label_template">Dubai</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_3.jpg"
                    className={this.state.response.template == 3 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={3}
                    onClick={(e) => this.handleCv('template', e)}/>
              </div>

              <div className="col p-0">
                <label className="label_template">Brisbane</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_4.jpg"
                    className={this.state.response.template == 4 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={4}
                    onClick={(e) => this.handleCv('template', e)}/>
              </div>
            </div>

            <div className="row m-0">
              <div className="col p-0">
                <label className="label_template">London</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_5.jpg"
                    className={this.state.response.template == 5 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={5}
                    onClick={(e) => this.handleCv('template', e)} />
              </div>

              <div className="col p-0">
                <label className="label_template">Monaco</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_6.jpg"
                    className={this.state.response.template == 6 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={6}
                    onClick={(e) => this.handleCv('template', e)}/>
              </div>
            </div>

            <div className="row m-0">
              <div className="col p-0">
                <label className="label_template">Perth</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_7.jpg"
                    className={this.state.response.template == 7 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={7}
                    onClick={(e) => this.handleCv('template', e)} />
              </div>

              <div className="col p-0">
                <label className="label_template">Sydney</label>
                <input
                    src="https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/cv_photo/cv_template_8.jpg"
                    className={this.state.response.template == 8 ? "standard_for_cv_button choice" : "standard_for_cv_button"}
                    type="image"
                    name="template"
                    value={8}
                    onClick={(e) => this.handleCv('template', e)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}