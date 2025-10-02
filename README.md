# lecturer_management_v2_frontend
A React-based website for lecturer management, using this backend server: https://github.com/slothbelphegor/lecturer_management_v2_backend
Uses JWT and RBAC for authorization. 

## Link
- Backend (must be booted up before running frontend): https://lecturer-management-v2-backend.onrender.com
- Frontend: https://lecturer-management-v2-frontend.onrender.com

## Features
- People can register for teaching at the instituition by providing their information (profession, degree, degree, recommender, experience,...). These information can be updated after registration.
- Stores relevant details of:
    - Courses taught at the instuition
    - Lecturers registrated for teaching (the website can be seen as a source for finding a suitable lecturer for hire)
    - Lecturers currently teaching as the instituition (which courses are they teaching, their schedules,...)
    - Some documents needed for the lecturers (forms, outlines,...)
- Features for lecturers:
    - Recommend other lecturers to the instituition
    - View and update self information (degree, account, profession,...)
    - View teaching schedules and evaluations of self
- Featurers for staffs:
    - View potential lecturers list and decide who is suitable
    - View information of lecturers
    - Create and update lecturers' schedules
    - Evaluate lecturers (based on supervising staffs or feedback from students)
    - Provide some general statistics

## Login accounts
All accounts has `P@ssWord123` as password.
- `lecturer`
- `potential_lecturer`
- `education_department`
- `supervision_department`
- `it_faculty`

## Diagrams
- Use Case: https://drive.google.com/file/d/185Fq3mcNvvrrfbriDiVPwWEtCxHHnDRL/view?usp=sharing
- Class: https://drive.google.com/file/d/12WS_6GucMq-5N1QqrdGq7ANrgd4tywft/view?usp=sharing
