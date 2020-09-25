import React, { Component } from 'react';
import './App.css';
import Template_1 from './cv_templates/Template_1'
import Template_2 from './cv_templates/Template_2'
import Template_3 from './cv_templates/Template_3'
import Template_4 from './cv_templates/Template_4'
import Template_5 from './cv_templates/Template_5'
import Template_6 from './cv_templates/Template_6'
import Template_7 from './cv_templates/Template_7'
import Template_8 from './cv_templates/Template_8'

class View extends Component {
  render() {
    return (
      <div className={"cv_template_" + this.props.response.template} id="capture">

          { this.props.response.template == 1 ? <Template_1 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 2 ? <Template_2 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 3 ? <Template_3 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 4 ? <Template_4 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 5 ? <Template_5 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 6 ? <Template_6 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 7 ? <Template_7 response={this.props.response} language={this.props.language} /> : null }
          { this.props.response.template == 8 ? <Template_8 response={this.props.response} language={this.props.language} /> : null }

      </div>
    )
  }
}

export default View;