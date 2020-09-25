import React, { Component } from 'react';
import '../App.css';
import './Template_6.sass';
import { Container, Row, Col, Table } from 'reactstrap';
import {languages_dict} from '../languages';


export default class Template_6 extends Component {
  *dots_generator(e) {

      // full dots
      let x = 0;
      while (x < e) {
          x += 1;
          yield <div className="cv_level_fill">&bull;</div>;
      }

      // empty dots
      let y = 0;
      while (y < (5 - e)) {
          y += 1;
          yield <div className="cv_level_empty">&bull;</div>;
      }
  }

  render() {
    return (
      <Table className="cv_container">
        <tr className="cv_main">



          <td className="cv_left">
              <Container className="cv_left_container">
                  <Row className="p-0 m-0">
                      <Col className="p-0 m-0">
                          <div>
                              <img src={this.props.response.photo ? this.props.response.photo+"?pupa" : "https://bucketeer-76017907-f421-465f-9cc2-2a75b892868d.s3.amazonaws.com/media/images/empty-avatar.jpg"} alt="None" className="cv_photo" crossOrigin="anonymous" />
                          </div>
                      </Col>
                  </Row>
                  <Row className="p-0 m-0">
                      <Col className="p-0 m-0">
                          <div className="cv_pre_left"></div>
                      </Col>
                  </Row>
                  {this.props.response.street_and_number || this.props.response.postal_code || this.props.response.city || this.props.response.country || this.props.response.email || this.props.response.phone ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0">
                              <div className="cv_left_content">
                                  <div><strong>{this.props.response.street_and_number || this.props.response.postal_code || this.props.response.city || this.props.response.country ? languages_dict[this.props.language]["address"] + ":" : null}</strong></div>
                                  <div>{this.props.response.street_and_number}</div>
                                  <div>{this.props.response.postal_code} {this.props.response.city}</div>
                                  <div>{this.props.response.country}</div>
                                  <div className="cv_icons">{this.props.response.email ? <div class="cv_icon_inside" dangerouslySetInnerHTML={{__html: '&#9993;'}}></div> : null}{this.props.response.email}</div>
                                  <div className="cv_icons">{this.props.response.phone ? <div className="cv_icon_inside" dangerouslySetInnerHTML={{__html: '&phone;'}}></div> : null}{this.props.response.phone}</div>
                              </div>
                          </Col>
                      </Row>
                  : null}
                  {this.props.response.social_and_websites.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0">
                              <div className="cv_left_title">{languages_dict[this.props.language]["socials_and_websites_right"]}</div>
                              <hr className="cv_left_line" />
                              <div className="cv_left_content">
                                  {this.props.response.social_and_websites.map((e) => <div className="cv_link">{e.link}</div>)}
                              </div>
                          </Col>
                      </Row>
                  : null}
                  {this.props.response.languages.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0">
                              <div className="cv_left_title">{languages_dict[this.props.language]["languages"]}</div>
                              <hr className="cv_left_line" />
                              <Table className="mb-0">
                              <Container className="cv_left_content">
                                  {this.props.response.languages.map((e) =>
                                      <Row>
                                          <Col className="cv_level">{e.language}</Col>
                                          <Col className="col-auto">{this.dots_generator(e.level)}</Col>
                                      </Row>
                                  )}
                              </Container>
                              </Table>
                          </Col>
                      </Row>
                  : null}
                  {this.props.response.skills.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0">
                              <div className="cv_left_title">{languages_dict[this.props.language]["skills"]}</div>
                              <hr className="cv_left_line" />
                              <Table className="mb-0">
                              <Container className="cv_left_content">
                                  {this.props.response.skills.map((e) =>
                                      <Row>
                                          <Col className="cv_level">{e.skill}</Col>
                                          <Col className="col-auto">{this.dots_generator(e.level)}</Col>
                                      </Row>
                                  )}
                              </Container>
                              </Table>
                          </Col>
                      </Row>
                  : null}
                  {this.props.response.hobbies.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0">
                              <div className="cv_left_title">{languages_dict[this.props.language]["hobbies"]}</div>
                              <hr className="cv_left_line" />
                              <div className="cv_left_content">{this.props.response.hobbies}</div>
                          </Col>
                      </Row>
                  : null}
              </Container>
          </td>

          <td className="cv_right">
              <Container className="cv_right_container">

                  <Row className="p-0 m-0">
                      <Col className="p-0 m-0">
                          <div className="cv_name_and_job_title">
                              <div className="cv_name">{this.props.response.first_name} {this.props.response.last_name}</div>
                              <div className="cv_job_title">{this.props.response.job_title}</div>
                              {this.props.response.professional_summary.toString() ?
                                <div>
                                    <hr className="cv_right_line_summary" />
                                    <div className="cv_job_description_top">{this.props.response.professional_summary}</div>
                                </div>
                              : null}
                          </div>
                      </Col>
                  </Row>

                  {this.props.response.employment_history.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0 cv_right_unit">
                              <div className="cv_right_title">{languages_dict[this.props.language]["employment_history"]}</div>
                              <div className="cv_right_content">
                                  <hr className="cv_right_line" />
                                  {this.props.response.employment_history.map((e) =>
                                      <div>
                                          <div>
                                              <div className="cv_employment_history_job_title">{e.job_title}{e.job_title && e.employer ? ", ": null}{e.employer}</div><div className="cv_employment_history_city">{e.city}</div>
                                          </div>
                                          <div className="cv_employment_history_date">{e.start_date} {e.start_date || e.end_date ? "-" : null} {e.end_date}</div>
                                          <div className="cv_job_description">{e.description}</div>
                                          {this.props.response.employment_history.length > this.props.response.employment_history.indexOf(e)+1 ? <div className="cv_job_description_brake"></div> : <div className="cv_job_description_zero"></div>}
                                      </div>
                                  )}
                              </div>
                          </Col>
                      </Row>
                  : null}

                  {this.props.response.education_and_courses.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0 cv_right_unit">
                              <div className="cv_right_title">{languages_dict[this.props.language]["education_and_courses"]}</div>
                              <div className="cv_right_content">
                                  <hr className="cv_right_line" />
                                  {this.props.response.education_and_courses.map((e) =>
                                      <div>
                                          <div>
                                              <div className="cv_employment_history_job_title">{e.degree}{e.degree && e.school ? ", ": null}{e.school}</div><div className="cv_employment_history_city">{e.city}</div>
                                          </div>
                                          <div className="cv_employment_history_date">{e.start_date} {e.start_date || e.end_date ? "-" : null} {e.end_date}</div>
                                          <div className="cv_job_description">{e.description}</div>
                                          {this.props.response.education_and_courses.length > this.props.response.education_and_courses.indexOf(e)+1 ? <div className="cv_job_description_brake"></div> : <div className="cv_job_description_zero"></div>}
                                      </div>
                                  )}
                              </div>
                          </Col>
                      </Row>
                  : null}

                  {this.props.response.references.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0 cv_right_unit">
                              <div className="cv_right_title">{languages_dict[this.props.language]["references"]}</div>
                              <div className="cv_right_content">
                                  <hr className="cv_right_line" />
                                  {this.props.response.references.map((e) =>
                                      <div>
                                          <div className="cv_employment_history_job_title">{e.referents_fullname}{e.referents_fullname && e.company ? ", ": null}{e.company}</div>
                                          <div className="cv_job_description">{e.email} {e.email && e.phone ? " | ": null} {e.phone}</div>
                                          {this.props.response.references.length > this.props.response.references.indexOf(e)+1 ? <div className="cv_job_description_brake"></div> : <div className="cv_job_description_zero"></div>}
                                      </div>
                                  )}
                              </div>
                          </Col>
                      </Row>
                  : null}

                  {this.props.response.custom.toString() ?
                      <Row className="p-0 m-0">
                          <Col className="p-0 m-0 cv_right_unit">
                              <div className="cv_right_title">{languages_dict[this.props.language]["custom"]}</div>
                              <div className="cv_right_content">
                                  <hr className="cv_right_line" />
                                  {this.props.response.custom.map((e) =>
                                      <div>
                                          <div>
                                              <div className="cv_employment_history_job_title">{e.activity}</div><div className="cv_employment_history_city">{e.city}</div>
                                          </div>
                                          <div className="cv_employment_history_date">{e.start_date} {e.start_date || e.end_date ? "-" : null} {e.end_date}</div>
                                          <div className="cv_job_description">{e.description}</div>
                                          {this.props.response.custom.length > this.props.response.custom.indexOf(e)+1 ? <div className="cv_job_description_brake"></div> : <div className="cv_job_description_zero"></div>}
                                      </div>
                                  )}
                              </div>
                          </Col>
                      </Row>
                  : null}

                  {this.props.response.rodo.toString() ?
                      <Row className="p-0 m-0 cv_rodo_clause">
                          <Col className="p-0 m-0 cv_right_unit">
                              <div className="cv_right_content">
                                  {this.props.response.rodo.map((e) =>
                                      <div>
                                          <div className="cv_job_description">{e.rodo ? e.rodo : (this.props.language == "pl" ? 'Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO).' : 'I agree to the processing of personal data provided in this document for realising the recruitment process pursuant to the Personal Data Protection Act of 10 May 2018 (Journal of Laws 2018, item 1000) and in agreement with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation).')}</div>
                                          {this.props.response.rodo.length > this.props.response.rodo.indexOf(e)+1 ? <div className="cv_job_description_brake"></div> : <div className="cv_job_description_zero"></div>}
                                      </div>
                                  )}
                              </div>
                          </Col>
                      </Row>
                  : null}

              </Container>
          </td>
        </tr>
      </Table>
    )
  }
}