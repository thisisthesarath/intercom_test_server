import fetch from 'node-fetch'; // Importing fetch in ESM style
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Define a basic route to check server is running
app.get('/', (req, res) => {
  res.send('Hello, this is the Express server running on port 3001!');
});

// Route to fetch extensions
app.get('/webapi/core/extension', async (req, res) => {
  try {
    const response = await fetch('https://pbx.johnsamuel.in/webapi/core/extension', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('sarath:Sarath0(*pbx').toString('base64'), // Basic Auth
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from PBX API');
    }

    const data = await response.json(); // Parse the JSON response from PBX
    res.json(data); // Send the real data to the client (React app)

  } catch (error) {
    console.error('Error fetching PBX data:', error);
    res.status(500).json({ message: 'Error fetching PBX data' });
  }
});

// Route to create a new user
app.post('/webapi/core/user/create', async (req, res) => {
  try {
    const userData = req.body; // Get user data from the request body

    // Validate required fields
    const requiredFields = ['username', 'password', 'email', 'language', 'timezone', 'first_name', 'last_name', 'organization', 'user_groups', 'domain'];
    const missingFields = requiredFields.filter((field) => !userData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Send POST request to the PBX API
    const response = await fetch('https://pbx.johnsamuel.in/webapi/core/user/create.php', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('sarath:Sarath0(*pbx').toString('base64'), // Basic Auth
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send user data
    });

    // Log raw response text before parsing it
    const rawResponse = await response.text();  // Use `.text()` to get the raw response
    console.log('Raw User Creation Response:', rawResponse);  // Log raw response

    try {
      const apiResponse = JSON.parse(rawResponse);  // Try parsing it as JSON
      if (!response.ok) {
        console.error('API response error:', apiResponse);
        return res.status(response.status).json({
          message: apiResponse.message || 'Failed to create user on PBX.',
        });
      }

      res.status(200).json(apiResponse); // Return successful response to the client
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError);
      return res.status(500).json({ message: 'Failed to parse response from PBX API.' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to create an extension
app.post('/webapi/core/extension/create', async (req, res) => {
  try {
    const extensionData = req.body;

    const requiredFields = [
      'extension',
      'user',
      'voicemail_password',
      'account_code',
      'outbound_caller_id_name',
      'outbound_caller_id_number',
      'effective_caller_id_name',
      'effective_caller_id_number',
      'emergency_caller_id_name',
      'emergency_caller_id_number',
      'max_registrations',
      'limit_max',
      'user_record',
      'domain',
      'context',
      'description',
      'extension_enabled',
    ];

    const missingFields = requiredFields.filter((field) => !extensionData[field]);
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    console.log('Extension Data:', extensionData);

    const response = await fetch('https://pbx.johnsamuel.in/webapi/core/extension/create.php', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('sarath:Sarath0(*pbx').toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extensionData),
    });

    // Log raw response text before parsing it
    const rawResponse = await response.text();  // Use `.text()` to get the raw response
    console.log('Raw Extension Creation Response:', rawResponse);  // Log raw response

    try {
      const apiResponse = JSON.parse(rawResponse);  // Try parsing it as JSON
      if (!response.ok) {
        console.error('API response error:', apiResponse);
        return res.status(response.status).json({
          message: apiResponse.message || 'Failed to create extension on PBX.',
        });
      }

      res.status(200).json(apiResponse);
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError);
      return res.status(500).json({ message: 'Failed to parse response from PBX API.' });
    }
  } catch (error) {
    console.error('Error creating extension:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
