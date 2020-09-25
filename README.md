# Single Page Resume Builder
### Single page app that allows you to create, store, generate resume to pdf and change templates with one click.

<a href="https://youtu.be/JY_-iuWHKu0">
<img src="https://github.com/koualsky/mojecv/blob/master/demo.gif?raw=true">
</a>

##### A brief overview of functionality:
- Each change is saved to database after 3 seconds of inactivity. The application saves only the changed fields, not all fields.
- The screen is divided into 3 areas (Form, Preview and Change_template area).
- In "Form" section in addition to simply editing fields we can also change the order of the fields by drag-and-drop mechanism.
- In "Preview" section we have instantly preview into our resume.
- In "Change tamplate" section we can change template any time.
- "Print CV" was generate and download high quality PDF file with our resume.
- "Save & close" was save all changes, generate and save thumbnail of our resume.
- Email confirmation of registration.
- The ability to change the language of the document by one click.
- The application stores all data in the PostgreSQL database.
- The application stores all static files on AWS Bucketeer.
- The application has an implemented dotpay payment system.
- The application uses Django REST Framework to communicate the frontend with the backend.

##### Backend:
- Python
- Django
- Django rest framework
- PostgreSQL
- Gunicorn

##### Frontend:
- Javascript
- React.js
- Ajax
- Axios
- Bootstrap
- Jspdf
- Html2canvas
- Image-encode
- CSS
- SASS

##### Run

- `source venv/bin/activate`

- `make run`

##### Demo
[www.cvbox.pl](http://www.cvbox.pl)
- user: tester
- pass: testowanie123