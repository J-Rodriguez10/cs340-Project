const express = require('express');
const db = require('../database/db-connector');
const router = express.Router();

// GET /employeeRoles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM EmployeeRoles ORDER BY roleID ASC;'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /employeeRoles error:', err);
    res.status(500).send('Error fetching employee roles');
  }
});

// POST /employeeRoles
router.post('/', async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).send('Missing required fields');
    }

    const [result] = await db.query('CALL sp_AddEmployeeRole(?)', [roleName]);

    res.status(201).send({
      message: 'Employee role created successfully',
      id: result.insertId || null
    });
  } catch (err) {
    console.error('POST /employeeRoles error:', err);
    res.status(500).send('Error creating employee role');
  }
});

// DELETE /employeeRoles/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('CALL sp_DeleteEmployeeRoleByID(?)', [req.params.id]);

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Employee role not found');
    }

    res.status(200).send({ message: 'Employee role deleted successfully' });
  } catch (err) {
    console.error('DELETE /employeeRoles/:id error:', err);
    res.status(500).send('Error deleting employee role');
  }
});


// PUT /employeeRoles/:id
router.put('/:id', async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).send('Missing required fields');
    }

    const [rows] = await db.query('CALL sp_UpdateEmployeeRoleByID(?, ?)', [req.params.id, roleName]);

    const affected = rows[0][0]?.affectedRows;

    if (affected === 0) {
      return res.status(404).send('Employee role not found');
    }

    res.status(200).send({ message: 'Employee role updated successfully' });
  } catch (err) {
    console.error('PUT /employeeRoles/:id error:', err);
    res.status(500).send('Error updating employee role');
  }
})

/* 
  Citation for the following route handler:
  ChatGpt - Adapted from the template it gave.
  Prompt: Give me the template on how I would make an endpoint where the first value is
  the ID followed by the value of that ID.
*/
// GET /employeeRoles/options - For dropdowns: { value: roleID, label: "ID - Role Name" }
router.get('/options', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        roleID AS value,
        CONCAT(roleID, ' - ', roleName) AS label
      FROM EmployeeRoles
      ORDER BY roleName ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /employeeRoles/options error:', err);
    res.status(500).send('Error fetching employee role options');
  }
});

module.exports = router;
