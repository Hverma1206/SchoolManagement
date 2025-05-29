const db = require('../db');

function roundToThreeDecimals(num) {
  return parseFloat(parseFloat(num).toFixed(3));
}

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

exports.addSchool = async (req, res) => {
  const { name, address } = req.body;
  let { latitude, longitude } = req.body;
  
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  latitude = roundToThreeDecimals(latitude);
  longitude = roundToThreeDecimals(longitude);

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listSchools = async (req, res) => {
  let { latitude, longitude } = req.query;

  try {
    if (latitude && longitude) {
      latitude = roundToThreeDecimals(latitude);
      longitude = roundToThreeDecimals(longitude);
      
      const [rows] = await db.execute(
        'SELECT * FROM schools WHERE latitude = ? AND longitude = ?',
        [latitude, longitude]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No school found at these coordinates.' });
      }
      
      res.json(rows);
    } else {
      const [rows] = await db.execute('SELECT * FROM schools');
      res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
