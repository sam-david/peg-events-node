const Pool = require('pg').Pool
const pool = new Pool({
  user: 'Sam',
  host: 'localhost',
  database: 'peg_events_node_development',
  port: 5432,
})


const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })

}


const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  console.log("REQUEST Query", request.query);
  const { autodesk_id, autodesk_username, autodesk_display_name, email } = request.query;
  console.log('USING AUTODESK ID', autodesk_id);
  pool.query('SELECT id FROM users WHERE autodesk_id = $1', [autodesk_id], (error, results) => {
    if (results.rows.length == 0) {
      console.log("rows tots nil");
      // insert
      pool.query('INSERT INTO users (email, autodesk_id, autodesk_username, autodesk_displayname, created_at, last_login_at) VALUES ($1, $2, $3, $4, to_timestamp($5), to_timestamp($5)) RETURNING id', [email, autodesk_id, autodesk_username, autodesk_display_name, (Date.now() / 1000.0)], (error, results) => {
        console.log("final user id:", results.rows[0].id);
        if (error) {
          throw error
        }
      })

    } else {
      // return existing id
      console.log('User found first id:', results.rows[0].id);
      // update last iniatated
    }

    if (error) {
      throw error
    }
    response.status(200).send(`User found?`)
  })
}

const createEvent = (request, response) => {
  //console.log("REQUEST Query", request);
  console.log("REQUEST JSON", request.body);
  //console.log("REQUEST Query", request.query);
  const { autodesk_id, name, event_time, payload } = request.body;
  console.log('USING AUTODESK ID', autodesk_id);

  pool.query('SELECT id FROM users WHERE autodesk_id = $1', [autodesk_id], (error, userSelectResults) => {
    console.log("SQL RESULT", userSelectResults.rows)
    // find or create event
    resultUserId = userSelectResults.rows[0].id;
    console.log("USER FOUND", resultUserId);
    pool.query('SELECT id FROM events WHERE name = $1', [name], (error, eventsSelectResults) => {
      if (eventsSelectResults.rows.length == 0) {
        // Event not found
        console.log("EVENT NOT FOUND")
        pool.query('INSERT INTO events (name, created_at) VALUES ($1, to_timestamp($2)) RETURNING id', [name, (Date.now() / 1000.0)], (error, eventInsertResults) => {
          if (error) {
            throw error
          }
          resultEventId = eventInsertResults.rows[0].id;
          console.log("EVENT INSERTED", resultEventId);
          pool.query('INSERT INTO user_events (user_id, event_id, event_at, payload, created_at) VALUES ($1, $2, $3, $4, to_timestamp($5)) RETURNING id', [resultUserId, resultEventId, event_time, payload, (Date.now() / 1000.0)], (error, userEventInsertResults) => {
            if (error) {
              throw error
            }
            resultUserEventId = userEventInsertResults.rows[0].id;
            console.log("USER EVENT INSERTED", resultUserEventId);
            response.status(200).send(`USER EVENT CREATED ${resultUserEventId}`)
          })
        })
      } else {
        // Event found
        resultEventId = eventsSelectResults.rows[0].id;
        console.log("EVENT FOUND", resultEventId)
        pool.query('INSERT INTO user_events (user_id, event_id, event_at, payload, created_at) VALUES ($1, $2, $3, $4, to_timestamp($5)) RETURNING id', [resultUserId, resultEventId, event_time, payload, (Date.now() / 1000.0)], (error, userEventInsertResults) => {
            if (error) {
              throw error
            }
            resultUserEventId = userEventInsertResults.rows[0].id;
            console.log("USER EVENT INSERTED", resultUserEventId);
            response.status(200).send(`USER EVENT CREATED ${resultUserEventId}`)
        })
      }
    })

    if (error) {
      throw error
    }
  })
}



const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  createEvent,
  updateUser,
  deleteUser,
}
