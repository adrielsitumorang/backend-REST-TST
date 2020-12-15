const express = require('express')
const bodyParser = require('body-parser');
const Axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const PORT = process.env.PORT || 5000

let config;
if ("postgres://hhjtyrzrhhnatj:f0aaa7a9f093220a484d5eb5df01bd2fa07efbed1a3d8051db3a6129fc6b1525@ec2-52-6-75-198.compute-1.amazonaws.com:5432/dcggep3fjsp912") {
  config = {
    connectionString: "postgres://hhjtyrzrhhnatj:f0aaa7a9f093220a484d5eb5df01bd2fa07efbed1a3d8051db3a6129fc6b1525@ec2-52-6-75-198.compute-1.amazonaws.com:5432/dcggep3fjsp912",
    ssl: { rejectUnauthorized: false }
  };
} else {
  config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}
const pool = new Pool(config);

express()
  .use(bodyParser.json())
  .post('/pemuridan', (req, res) => {
      pool.connect().then((client) => {
        return client.query("INSERT INTO pemuridan (nim, nama, jurusan, gender, angkatan, lp) VALUES ($1, $2, $3, $4, $5,$6)", [req.body.nim, req.body.nama, req.body.jurusan, req.body.gender, req.body.angkatan, req.body.lp]).then(() => {
          client.release();
          res.status(200).json('Anggota berhasil ditambahkan');
        }).catch((err) => {
          client.release();
          res.status(500).json('Anggota gagal ditambahkan');
        });
      });
  })

  .get('/pemuridan', (req, res) => {
    pool.connect().then((client) => {
      return client.query('SELECT * FROM pemuridan').then((result) => {
        client.release();
        res.status(200).json(result.rows);
      }).catch(err => {
        client.release();
        res.status(500).json('Data pemuridan gagal diperoleh');
      });
    });
  })
  .get('/pemuridan/:lp', async (req, res) => {
    const {lp} = req.params;
    try {
        const result = await pool.query("SELECT * FROM pemuridan WHERE lp = $1", [lp]);

        res.status(200).json(result.rows);
    }catch (err) {
        console.error(err.message);
    }
  })
  .delete('/pemuridan/', async (req, res) => {
    const nim = req.body.nim;
    try {
        const result = await pool.query("DELETE FROM pemuridan WHERE nim  = $1", [nim]);

        res.json("Penghapusan anggota berhasil!");
    }catch (err) {
        console.error(err.message);
    }
  })

.put('/pemuridan', async (req, res) => {
    const nim = req.body.nim;
    const lp = req.body.lp;

    try {
        const result = await pool.query("UPDATE pemuridan SET lp = $1 WHERE nim = $2", [lp,nim]);

        res.json("Data berhasil di update!");
    }catch (err) {
        console.error(err.message);
    }
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));