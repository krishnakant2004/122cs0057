const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 9876;

// 
const WINDOW_SIZE = 10; 
const MAX_RESPONSE_TIME = 500; 

//  storage
let numberWindow = [];


app.use(express.json());



//fetch number from test server
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/evaluation-service/';
const NUMBER_TYPE_ENDPOINTS = {
  p: 'primes',    
  f: 'fibo', 
  e: 'even',
  r: 'rand'    
};

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Mjg0NDY5LCJpYXQiOjE3NDYyODQxNjksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZlM2YzOTc2LWExZjgtNDYzMi05ZmMxLWE0NzI5YjE0OGI4OSIsInN1YiI6ImtyaXNobmE5NjY5a2FudGRpbmthckBnbWFpbC5jb20ifSwiZW1haWwiOiJrcmlzaG5hOTY2OWthbnRkaW5rYXJAZ21haWwuY29tIiwibmFtZSI6ImtyaXNobmEiLCJyb2xsTm8iOiIxMjJjczAwNTciLCJhY2Nlc3NDb2RlIjoiYnpiQ256IiwiY2xpZW50SUQiOiI2ZTNmMzk3Ni1hMWY4LTQ2MzItOWZjMS1hNDcyOWIxNDhiODkiLCJjbGllbnRTZWNyZXQiOiJrdFR4WkhCZHBOUWNId1J0In0.lfw7ww6ptvppPDowxeiDUF-ErKsgNEegQYcBVU7WRf8";
async function fetchNumberFromTestServer(numberType) {
  const endpoint = NUMBER_TYPE_ENDPOINTS[numberType];
  const url = `http://20.244.56.144/evaluation-service/${endpoint}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

//add number to window
function addNumberToWindow(number) {
  if (!numberWindow.includes(number)) {
    numberWindow.concat(number)

    while(numberWindow.length > WINDOW_SIZE) {
      numberWindow.shift(); // Remove oldest number (first element)
    }
  }
}



//calculate average of numbers in the window
function calculateAverage() {
  if (numberWindow.length === 0) return 0;
  
  const sum = numberWindow.reduce((acc, val) => acc + val, 0);
  return sum / numberWindow.length;
}


app.get('/numbers/:numberType', async (req, res) => {
  const { numberType } = req.params;
  
  // Validate number type
  if (!['p', 'f', 'e', 'r'].includes(numberType)) {
    return res.status(400).json({
      error: 'Invalid number type. Must be one of: p (prime), f (fibonacci), e (even), r (random)'
    });
  }

  try {
    //current window state .
    const currentWindowState = numberWindow;
    
    //fetch new numbers.
    const fetchedNumber = await fetchNumberFromTestServer(numberType);

    //add new number to window.
    addNumberToWindow(fetchedNumber);


    //after adding new numbers window changed
    const newWindowState = numberWindow;

    //concate current and new window state
    const numberss = currentWindowState.concat(fetchedNumber);
    
    const average = calculateAverage();
    
    const response = {
      windowPrevState: currentWindowState,
      windowCurrState: newWindowState,
      numbers: numberss, 
      avg: average.toFixed(2) 
    };
    
    res.json(response);
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
});

module.exports = app; // Export for testing




// {
//   "email": "krishna9669kantdinkar@gmail.com",
//   "name": "krishna",
//   "rollNo": "122cs0057",
//   "accessCode": "bzbCnz",
  // "clientID": "6e3f3976-a1f8-4632-9fc1-a4729b148b89",
  // "clientSecret": "ktTxZHBdpNQcHwRt"
// }

// {
//   "token_type": "Bearer",
  // "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MjgwNTg1LCJpYXQiOjE3NDYyODAyODUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZlM2YzOTc2LWExZjgtNDYzMi05ZmMxLWE0NzI5YjE0OGI4OSIsInN1YiI6ImtyaXNobmE5NjY5a2FudGRpbmthckBnbWFpbC5jb20ifSwiZW1haWwiOiJrcmlzaG5hOTY2OWthbnRkaW5rYXJAZ21haWwuY29tIiwibmFtZSI6ImtyaXNobmEiLCJyb2xsTm8iOiIxMjJjczAwNTciLCJhY2Nlc3NDb2RlIjoiYnpiQ256IiwiY2xpZW50SUQiOiI2ZTNmMzk3Ni1hMWY4LTQ2MzItOWZjMS1hNDcyOWIxNDhiODkiLCJjbGllbnRTZWNyZXQiOiJrdFR4WkhCZHBOUWNId1J0In0.JRtnWGF7610MeDgPJu-XzlRO-7sA6WV_Q-eBHKH3_iM",
//   "expires_in": 1746280585
// }