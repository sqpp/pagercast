require("dotenv/config")
const logger = require('morgan');
const express = require('express');
const base64url = require('./inc/base64url');
const uuid = require('uuid').v4;
const { instrument } = require("@socket.io/admin-ui");
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const pool = require('./postgres');
const passport = require("passport")
const sharedsession = require("express-socket.io-session");
const { Sequelize, Op } = require('sequelize');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const PORT = process.env.PORT || 4444;
var WebAuthnStrategy = require('passport-fido2-webauthn');
var LocalStrategy = require('passport-local');
var SessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;
const store = new SessionChallengeStore();

const sequelize = new Sequelize({
  dialect: 'postgres',
  pool: pool,
  //logging: console.log
});

const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: {
    type: Sequelize.DATE,
  },
  data: {
    type: Sequelize.TEXT,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  }
});

const sessionStore = new SessionStore({
  db: sequelize,
  table: 'Session',
  session: Session
});

const sessionMiddleware = session({
  store: sessionStore,
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
});

passport.use(new LocalStrategy(
  {
    usernameField: 'phoneNumber',
    passwordField: 'pin',
  },
  async (username, password, done) => {
    try {
      const query = 'SELECT * FROM users WHERE phone = $1';
      const values = [username];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return done(null, false);
      }
      const user = rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.pincode);
      if (!isPasswordMatch) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

var app = require('express')(),
  server = require("http").createServer(app, {
    cors: {
      origin: "*",
      credentials: true
    }
  }),
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
    }
  })
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
io.use(sharedsession(sessionMiddleware, {
  autoSave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1', indexRouter);
app.use(passport.authenticate('session'));

sequelize.sync() 
.then(() => {
  console.log('Session store synced successfully');
})
.catch((error) => {
  console.error('Failed to sync session store:', error);
});

async function checkFirstLogin(phoneNumber) {
  try {
    const query = 'SELECT isfirstlogin FROM users WHERE phone = $1';
    const values = [phoneNumber];
    const result = await pool.query(query, values);

    if (result.rowCount === 1) {
      const isFirstLogin = result.rows[0].isfirstlogin;
      return isFirstLogin;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getUserDetails(phoneNumber) {
  try {
    const query = 'SELECT network_id, config, registered, phone, status FROM users WHERE phone = $1';
    const values = [phoneNumber];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null; 
    }
  } catch (error) {
    throw new Error('Failed to retrieve hashed PIN code from the database');
  }
}

io.on('connection', function (socket) {

  /*-----------------------------------
    // SOCKET IO WEBAUTHN LOGIN STARTS --
    // --------------------------------*/

  socket.on('/signup/public-key/challenge', (data) => {
    var handle = Buffer.alloc(16);
    handle = uuid({}, handle);
    var user = {
      id: handle,
      name: data.username, 
      displayName: data.name 
    };

    store.challenge(socket.handshake, { user: user }, function (err, challenge) {
      if (err) { console.log(err); }
      user.id = base64url.encode(user.id);
      socket.emit('/signup/public-key/challengeRequest', { user, challenge: base64url.encode(challenge) });
    });
  });

  /*-----------------------------------
// SOCKET IO WEBAUTHN LOGIN ENDS --
// --------------------------------*/


  socket.on('/login', async (data) => {
    const phoneNumber = data.phoneNumber;
    const pin = data.pin;
    const req = { body: { phoneNumber, pin } };
    const res = { json: data };
  
    try {
      const user = await new Promise((resolve, reject) => {
        passport.authenticate('local', { session: true, successRedirect: '/', failureRedirect: '/login'}, (err, user, info) => {
          if (err) {
            reject(err);
            return;
          }
  
          if (!user) {
            reject(new Error(info.message));
            return;
          }


          req.login(user, async (err) => {
            if (err) {
              reject(err);
              return;
            }

          const userDetails = await getUserDetails(phoneNumber);
          const isFirstLogin = await checkFirstLogin(phoneNumber)
          req.user = userDetails;
          isAuthenticated = true;
          socket.emit('/login/response', { isAuthenticated, isFirstLogin, error: false }); 

          req.session = socket.handshake.session
          req.session.userId = user.id; 
          req.session.save()
          sequelize.sync()
          resolve(user);
         
          
        });
        })(req, res);
      });

    } catch (error) {
    
      console.error(error.message);

    }
  });
  
  socket.on('/isAuthenticated', () => {
    if (socket.handshake.session && socket.handshake.session.userId) {

      socket.emit('/isAuthenticated/answer', true);
    } else {

      socket.emit('isAuthenticated/answer', false);
    }
  });
  

function getTime() {
  const dateTime = new Date();
  return dateTime.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  });
}

  const timestamp = new Date(socket.handshake['time']).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  });
  const logEntry = `[${timestamp}] [${socket.id}] (User: ${socket.request.user}) [${socket.conn.transport.name}] [${socket.handshake.headers['x-forwarded-for']}] -> [${socket.handshake.headers['origin']}] - Connect\n`;

  fs.writeFileSync('access.log', logEntry, { flag: 'a' }, (err) => {
    if (err) {
      console.error('Error writing to access.log:', err);
    }
  });

  socket.on('getFreeNumbers', async () => {
    try {
      const query = 'SELECT id, number, premium FROM numbers WHERE free = true'; 
      const { rows } = await pool.query(query);
      socket.emit('freeNumbers', rows);
    } catch (error) {
      console.error(error);
      socket.emit('error', 'An error occurred while fetching free numbers');
    }
  });

  socket.on('register', async (data) => {
    try {

      const checkQuery = `
            SELECT COUNT(*) AS count
            FROM users
            WHERE phone = $1 OR (config->>'serialNumber') = $2 OR (config->>'regCode') = $3
          `;
      const checkParams = [data.selectedPhoneNumber, data.serialNumber, data.regCode];
      const checkResult = await pool.query(checkQuery, checkParams);
      const count = checkResult.rows[0].count;

      if (count > 0) {

        const response = {
          success: false,
          message: 'Phone number, serial number, or registration code already exists.',
        };
        socket.emit('registerCallback', response);
      } else {
        const insertQueryString = `
            INSERT INTO users (network_id, config, registered, pincode, phone, status)
            VALUES ($1, $2::jsonb, $3, $4, $5, $6)
            RETURNING id
          `;
        const insertQueryParams = [
          1,
          JSON.stringify({
            name: data.name,
            device: data.device,
            serial: data.serial,
            twillio: data.twillio,
            regcode: data.regcode,
            privacy: data.privacy,
            ringtone: data.ringtone,
          }),
          new Date(),
          data.pincode,
          data.number,
          false,
        ];

        const insertQuery = await pool.query(insertQueryString, insertQueryParams);

        const userId = insertQuery.rows[0].id;

        const updateQueryString = `
            UPDATE numbers
            SET owner = $1, free = false, networkid = $2, active = (CASE WHEN premium THEN false ELSE true END)
            WHERE number = $3
          `;
        const updateQueryParams = [userId, 1, data.number];

        await pool.query(updateQueryString, updateQueryParams);

        const response = {
          success: true,
        };

        socket.emit('registerCallback', response);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  socket.on('verifyCode', async (code) => {
    console.info(`[${getTime()}][INFO] [1]Verification `);
    try {
      const query = 'SELECT * FROM pre_register WHERE registration_code = $1';
      const { rows } = await pool.query(query, [code]);
      if (rows.length > 0) {
        const deviceID = rows[0].device_id;
        console.info(`[${getTime()}][INFO] [S]Verification ` + deviceID);

        socket.emit('codeVerificationResult', { code, exists: true });

        const deleteQuery = 'DELETE FROM pre_register WHERE registration_code = $1';
        await pool.query(deleteQuery, [code]);
        console.info(`[${getTime()}][SD]Verification  ` + deviceID);
      } else {
        console.info(`[${getTime()}][INFO] [F]Verification `);
        socket.emit('codeVerificationResult', { exists: false });
      }
    } catch (error) {
      console.warn(`[${getTime()}][ERROR] [E]Verification `);
      socket.emit('codeVerificationResult', { exists: false });
    }
  });

  socket.on('getDevices', async () => {
    try {
      const query = 'SELECT * from devices WHERE support = true'; 
      const { rows } = await pool.query(query);
      socket.emit('listDevices', rows);
    } catch (error) {
      console.error(error);
      socket.emit('error', 'An error occurred while fetching the devices');
    }
  });

  socket.on('listDatabase', async () => {
    try {
      const query = `
            SELECT u.phone, (u.config::json ->> 'name') AS owner_name, n.country, n.network_name, u.status, num.premium, (u.config::json ->> 'lastSeen') AS lastSeen
            FROM numbers num
            JOIN networks n ON num.networkid = n.id
            JOIN users u ON num.owner = u.id
            WHERE (u.config::json ->> 'privacy') = 'Everyone';
          `;

      const { rows } = await pool.query(query);
      socket.emit('showPublicNumbers', rows);
    } catch (error) {
      console.error(error);
      socket.emit('error', 'An error occurred while fetching the devices');
    }
  });

});

instrument(io, {
  auth: {
    type: "basic",
    username: "marcell",
    password: "$2a$10$dut1x8Jl/KZkiRcxveFGIutWjb/9TEArddb51me3w.sReTB72KmlO"
  },
  mode: "development",
});

server.listen(PORT, () => {
  console.log(`Server is connected on ${PORT}`);
});

