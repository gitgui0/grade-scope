<img src="https://gradepredictor-blond.vercel.app/logo512.png" height="64px"/>
---

**GradeScope** is a lightweight, machine learning–powered grade predictor. Given data on student habits and background, it intelligently estimates the final score using a trained ML model, accessible through a web-based React interface.

---

First, clone the repository and launch the backend:

```bash
cd predictor-api
./mvnw spring-boot:run
```

Then, launch the ML model:

```bash
cd predictor-ML
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Now, start the frontend:

```bash
cd frontend
npm install
npm start
```

Make sure to set environment variables for the backend (`application.properties`) and frontend (`.env`) where necessary. In deployment, configure these through your hosting provider.

---

## Use Case

You enter a student's personal and academic information — such as gender, support received, family education level, and absences. The app sends this to the ML API, which responds with a grade prediction. Designed for educators, tutors, and students seeking insights.

---

## Acknowledgements

Built using:

- Java & Spring Boot
- Python (Flask + scikit-learn)
- React + Vite
- Heroku
- Vercel

Special thanks to open data providers and educators who inspired the project structure.

---
