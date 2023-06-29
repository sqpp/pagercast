require('dotenv/config');
const logger = require('morgan');
const express = require('express');
const session = require('express-session')
const router = express.Router();
const { instrument } = require("@socket.io/admin-ui");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require("fs");
const http = require('http');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const pool = require('./mysql');
const app = express();
const PORT = process.env.PORT || 4444;
const validator = require('validator');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', indexRouter);


// Creating a HTTP server first, as our web server will handle the HTTPS traffic.
const server = http.createServer(app, {
    cors: {
        origin: "*",
        credentials: true
    }
});

// Creating a SocketIO server on top of the HTTP server. 
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
    }
});



// Creating a 
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

io.on('login', async (username, password) => {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            socket.emit('helloBack', { message: 'Hello Client', timestamp: Date.now() });
        }
      ));
})

io.on('connection', function (socket) {
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
    const logEntry = `[${timestamp}] [${socket.id}] (User: ${socket.request.user}) [${socket.conn.transport.name}] [${socket.handshake.headers ['x-forwarded-for']}] -> [${socket.handshake.headers['origin']}] - Connect\n`;

    fs.writeFileSync('access.log', logEntry, { flag: 'a' }, (err) => {
      if (err) {
        console.error('Error writing to access.log:', err);
      }
    });

  
      
    socket.on('getFreeNumbers', async () => {
        try {
            const query = 'SELECT id, number FROM numbers WHERE free = true'; // Adjust the table name and column names accordingly
            const { rows } = await pool.query(query);
            socket.emit('freeNumbers', rows);
        } catch (error) {
            console.error(error);
            socket.emit('error', 'An error occurred while fetching free numbers');
        }
    });

    socket.on('register', async (data) => {
        try {
          // Check if phoneNumber, serialNumber, and registrationCode already exist in the users table
          const checkQuery = `
            SELECT COUNT(*) AS count
            FROM users
            WHERE phone = $1 OR (config->>'serialNumber') = $2 OR (config->>'regCode') = $3
          `;
          const checkParams = [data.phoneNumber, data.serialNumber, data.registrationCode];
          const checkResult = await pool.query(checkQuery, checkParams);
          const count = checkResult.rows[0].count;
      
          if (count > 0) {
            // If phoneNumber, serialNumber, or registrationCode already exists, send an error response
            const response = {
              success: false,
              message: 'Phone number, serial number, or registration code already exists.',
            };
            socket.emit('registerCallback', response);
          } else {
            // If phoneNumber, serialNumber, and registrationCode do not exist, proceed with the insertion
            const insertQueryString = `
              INSERT INTO users (network_id, config, registered, pincode, phone, status)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING id
            `;
            const insertQueryParams = [
              1,
              {
                name: 'Marciteszt',
                device: data.device,
                serialNumber: data.serialNumber,
                twillioRequest: data.twillio,
                regCode: data.registrationCode,
                privacySelector: data.privacy,
                ringtone: data.ringtone,
              },
              new Date(),
              data.pin,
              data.phoneNumber,
              false,
            ];
      
            const insertQuery = await pool.query(insertQueryString, insertQueryParams);
            const userId = insertQuery.rows[0].id;
      
            const updateQueryString = `
              UPDATE numbers
              SET owner = $1, free = false
              WHERE number = $2
            `;
            const updateQueryParams = [userId, data.phoneNumber];
      
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
        console.info(`[${getTime()}][INFO] New Code Verification Started`);
        try {
            const query = 'SELECT * FROM pre_register WHERE registration_code = $1';
            const { rows } = await pool.query(query, [code]);
            if (rows.length > 0) {
                const deviceID = rows[0].device_id;
                console.info(`[${getTime()}][INFO] Code Verification Succeeded for ` + deviceID);

                // Emit code verification result
                socket.emit('codeVerificationResult', { code, exists: true });

                // Delete the row from the database
                const deleteQuery = 'DELETE FROM pre_register WHERE registration_code = $1';
                await pool.query(deleteQuery, [code]);
                console.info(`[${getTime()}][INFO] Row deleted for ` + deviceID);
            } else {
                console.info(`[${getTime()}][INFO] Code Verification Failed`);
                socket.emit('codeVerificationResult', { exists: false });
            }
        } catch (error) {
            console.warn(`[${getTime()}][ERROR] Unknown error occured`);
            socket.emit('codeVerificationResult', { exists: false });
        }
    });


    socket.on('getDevices', async () => {
        try {
            const query = 'SELECT * from devices WHERE support = true'; // Adjust the table name and column names accordingly
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
            SELECT u.phone, (u.config::json ->> 'name') AS owner_name, n.country, n.network_name, u.status
            FROM numbers num
            JOIN networks n ON num.networkid = n.id
            JOIN users u ON num.owner = u.id
            WHERE (u.config::json ->> 'privacySelector') = 'Everyone';
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
        password: "$2a$10$dut1x8Jl/KZkiRcxveFGIutWjb/9TEArddb51me3w.sReTB72KmlO" // "changeit" encrypted with bcrypt
    },
    mode: "development",
});



server.listen(PORT, () => {
    console.log(`Server is connected on ${PORT}`);
});

