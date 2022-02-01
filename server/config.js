const jwtSecret = '0A15FAEB278F6DA0C8925F772E4BE3CF5719F41AA37B73AD0802DE5A8F1AC67E'
const port = 3000 || process.env.PORT
const saltRounds = 10
const db = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME
}

module.exports = { db, jwtSecret, port, saltRounds }
