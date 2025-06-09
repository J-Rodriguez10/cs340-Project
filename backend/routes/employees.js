const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /employees
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.employeeID,
        e.firstName,
        e.lastName,
        e.email,
        CONCAT(e.roleID, ' - ', r.roleName) AS roleID
      FROM Employees e
      JOIN EmployeeRoles r ON e.roleID = r.roleID
      ORDER BY e.employeeID DESC;
    `);

    console.log("HERE", rows)

    res.json(rows);
  } catch (err) {
    console.error('GET /employees error:', err);
    res.status(500).send('Error fetching employees');
  }
});

// POST /employees
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, roleID } = req.body;

    if (!firstName || !lastName || !roleID) {
      return res.status(400).send('Missing required fields');
    }

    const [result] = await db.query(
      'CALL sp_AddEmployee(?, ?, ?, ?, ?)',
      [firstName, lastName, email, phoneNumber, roleID]
    );

    res.status(201).send({
      message: 'Employee created successfully',
      id: result.insertId || null
    });
  } catch (err) {
    console.error('POST /employees error:', err);
    res.status(500).send('Error creating employee');
  }
});



// DELETE /employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'CALL sp_DeleteEmployeeByID(?)',
      [req.params.id]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Employee not found');
    }

    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('DELETE /employees/:id error:', err);
    res.status(500).send('Error deleting employee');
  }
});


// PUT /employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, roleID } = req.body;

    if (!firstName || !lastName || !roleID) {
      return res.status(400).send('Missing required fields');
    }

    const [rows] = await db.query(
      'CALL sp_UpdateEmployeeByID(?, ?, ?, ?, ?, ?)',
      [req.params.id, firstName, lastName, email, phoneNumber, roleID]
    );

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Employee not found');
    }

    res.status(200).send({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('PUT /employees/:id error:', err);
    res.status(500).send('Error updating employee');
  }
});

/* 
  Citation for the following route handler:
  ChatGpt - Adapted from the template it gave.
  Prompt: Give me the template on how I would make an endpoint where the first value is
  the ID followed by the value of that ID.
*/
// GET /employees/options - For dropdowns: { value: employeeID, label: "ID - First Last" }
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        employeeID AS value, 
        CONCAT(employeeID, ' - ', firstName, ' ', lastName) AS label
      FROM Employees
      ORDER BY lastName ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /employees/options error:', err);
    res.status(500).send('Error fetching employee options');
  }
});

module.exports = router;
