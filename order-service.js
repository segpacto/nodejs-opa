// order_service.js

const express = require('express')
const app = express()
const axios = require('axios')

const PORT = process.env.PORT || 4000

app.use(express.json())

// Mock order data
const orders = {
  1: { id: 1, userId: 1, product: 'Product A' },
  2: { id: 2, userId: 2, product: 'Product B' }
}

// Route to get order data
app.get('/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId
  const order = orders[orderId]
  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  // Check access policy with OPA
  try {
    const response = await axios.post('http://opa-sidecar:8181/v1/data/example/allow_authenticated', {
      input: {
        method: 'GET',
        user: { role: 'user' },
        path: req.path
      }
    })

    if (response.data.result) {
      return res.json(order)
    } else {
      return res.status(403).json({ error: 'Access denied' })
    }
  } catch (error) {
    console.error('Error evaluating policy:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`)
})
