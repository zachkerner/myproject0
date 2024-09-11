import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
import bcrypt from 'bcrypt'
const { Pool } = pkg
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/build/index.html'), 
              function(err) {
                if (err) {
                  res.status(500).send(err)
                }
              }
));

app.get('/static/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', req.path));
});


const port = process.env.PORT || 3000

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  database: process.env.DATABASE_URL,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

app.get('/api/fields', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM fields")
    res.json(result.rows)
    client.release() 
  } catch (err) {
    
    res.send('err' + err)
  }
})

app.get('/api/userData', async (req, res) => {
  try {
    const query = "SELECT id, email, about_me, address, birthday FROM user_data"
    const response = await pool.query(query)

    res.status(200).json(response.rows)

  } catch(err) {
    console.error(err)
  }
})

app.get('/api/fields/:field', async (req, res) => {
  const { field } = req.params;
  try {
    const result = await pool.query("SELECT * FROM fields WHERE field = $1", [field])
    
    if (result.rows.length > 0) {
      res.json(result.rows[0])
    } else {
      res.status(404).json({error: 'error field not found'})
    }
  }
   catch (err) {
    res.status(500).json({error: "Internal Server Error"})
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const query = "SELECT id, email, password, about_me, address, birthday FROM user_data WHERE email=$1"
    const values = [email]
    const result = await pool.query(query, values)

    const user = result.rows[0]

    if (result.rows.length === 0) {
      return res.status(400).json({error: "email_not_found"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "invalid_password"})
    }

    const {password: _, ...userData} = user

    res.status(200).json({userData, message: "login successful"})

  } catch(err) {
    res.status(500).json({err})
  }
})

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body

  const emailCheckQuery = "SELECT email FROM user_data WHERE email=$1"
  const emailCheckValues = [email]
  const response = await pool.query(emailCheckQuery, emailCheckValues)
  
  if (response.rows.length > 0){

    return res.status(400).json({ error: "email_already_exists" })
  }

  try {
    
    const saltRounds = 10
   
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  

    const insertQuery = "INSERT INTO user_data (email, password) VALUES ($1, $2)";
    const insertValues = [email, hashedPassword]
    
    await pool.query(insertQuery, insertValues)
    
    res.status(200).json({message: 'success'})
  } catch(err) {
    console.error("Error during pool.query:", err);
    res.status(500).send('error registering user')
  }
})

app.put('/api/updateFields', async (req, res) => {
  const { fieldsToUpdate } = req.body
  if (!fieldsToUpdate || fieldsToUpdate.length === 0 ) {
    res.status(400).send("fieldsToUpdate required")
  }

  fieldsToUpdate.forEach(async f => {
    try {
      const query = "UPDATE fields SET page = $2 WHERE field = $1"
      const values = [f.field, f.page]
      await pool.query(query, values)

    } catch(err) {
      console.error("error in fieldsToUpdate")
      res.status(500).send("Internal Server Error: error in fieldsToUpdate")
    }
  })

  res.status(200).json({message: "update successful"})
})

app.put("/api/updateUser/:userEmail", async (req, res) => {
  const { aboutMe, birthday, address } = req.body;
  const email = req.params.userEmail; // Correct email extraction
  const data = [aboutMe, address, birthday];
  const colNames = ["about_me", "address", "birthday"];
  
  try {
    let updateUserQuery = "UPDATE user_data SET ";
    const updateValues = [];
    const queryParams = [];

    data.forEach((d, i) => {
      if (d) {
        queryParams.push(`${colNames[i]}=$${queryParams.length + 1}`);
        updateValues.push(d);
      }
    });

    if (queryParams.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    
    updateUserQuery += queryParams.join(", ");
    updateUserQuery += " WHERE email=$" + (queryParams.length + 1); 
    updateValues.push(email);

    
    await pool.query(updateUserQuery, updateValues);

   
    const check = await pool.query("SELECT * FROM user_data WHERE email=$1", [email]);


    res.status(200).json({ message: "Fields update successful", user: check.rows[0] });
  } catch (err) {
    console.error(err, "updateUser error");
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
 console.log ("I'm listening on port 3000")
})