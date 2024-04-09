// user_service.js

const express = require('express')
const app = express()
const axios = require('axios')

const PORT = process.env.PORT || 3000

app.use(express.json())

// Mocked user data
const users = {
  1: { name: 'Alice', role: 'admin' },
  2: { name: 'Bob', role: 'user' }
}

// Route to get user data
app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId
  
  // The role can be obtained from JWT or dynamically generated
  const role = req.headers.role
  
  // Check access policy with OPA
  // An alternative is to pass the whole http request
  try {
    const response = await axios.post('http://opa-sidecar:8181/v1/data/example/allow_admin', {
      input: {
        method: 'GET',
        user: { role },
        path: req.path
      }
    })

    if (response.data.result) {
      const user = users[userId]
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.json(user)
    } else {
      return res.status(403).json({ error: 'Access denied' })
    }
  } catch (error) {
    console.error('Error evaluating policy:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`)
})
