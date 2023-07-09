const { Client } = require("pg")
const dotenv = require("dotenv")
const moment = require("moment")
const requestIp = require('request-ip');
const { lookup } = require('geoip-lite');

dotenv.config()
var pool = require('../postgres');


var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
  return res.status(200).json({ message: 'Welcome to LegacyPager Network' });
});

router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/numbers', async (req, res) => {
  const isFree = req.query.free === '1';
  if (isFree) {
    try {
      const { rows } = await pool.query('SELECT * FROM numbers WHERE free = 1');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    try {
      const { rows } = await pool.query('SELECT * FROM numbers');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

router.get('/devices', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM devices');
      console.log(rows)
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/sendcode', async (req, res, next) => {
  try {
    const requestIP = requestIp.getClientIp(req);
    const { devId, registrationCode } = req.body;
    const timestamp = new Date()
    await pool.query('INSERT INTO pre_register (ip, device_id, registration_code, created) VALUES ($1, $2, $3, $4)', [requestIP, devId, registrationCode, timestamp]);
    res.status(200).json({status: "ok"})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/config/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const requestIP = requestIp.getClientIp(req); 
    const geo = lookup(requestIP);
    const country = geo.country
    await pool.query("UPDATE users SET config = $1 WHERE id = $2;", [country, id])
    res.status(200).json({status: "ok"})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/config/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query("SELECT config FROM users WHERE id = $1;", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0].config);
    } else {
      res.status(404).json({ message: 'Config not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/tsync', function (req, res, next) {
    const requestIP = requestIp.getClientIp(req); 
    const geo = lookup(requestIP);
    console.log('[' + geo.country +']' + requestIP)
    const reqTime = new Date()
    const format = "YYYY-MM-DD hh:mm"
    const newDate = moment(reqTime).format(format)
    res.status(200).json(newDate);
});

router.get('/message/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [req.params.id]);
    res.status(200).json(rows[0],);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/messages', async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM messages");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/messages/new', async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM messages WHERE read = false");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
