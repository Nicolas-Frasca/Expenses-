// api/expenses.js

// 1. In-memory storage
// NOTE: This data will be lost when the serverless function "cold starts"
// or redeploys. It persists only during "warm" executions.
const expenses = [];

export default function handler(req, res) {
  const { method } = req;

  // 2. Handle GET Request
  if (method === 'GET') {
    return res.status(200).json(expenses);
  }

  // 3. Handle POST Request
  if (method === 'POST') {
    // Destructure expected fields from the body
    const { description, amount, date } = req.body;

    // 4. Validation
    // Ensure essential fields exist. We allow 'date' to be optional.
    if (!description || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: please provide "description" and "amount".',
      });
    }

    // Create the new expense object
    const newExpense = {
      id: Date.now(), // Simple unique ID based on timestamp
      description,
      amount,
      date: date || new Date().toISOString(), // Default to now if no date provided
    };

    // Add to storage
    expenses.push(newExpense);

    // Return success and the created object
    return res.status(201).json(newExpense);
  }

  // 5. Handle Unsupported Methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
