const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function test() {
  const form = new FormData();
  form.append('registeration_number', 'TEST-123');
  form.append('location', 'Bangalore');
  form.append('district', 'Bangalore Urban');
  form.append('company', 'Toyota');
  form.append('name', 'Innova');
  form.append('model', 'Crysta');
  form.append('year_made', '2022');
  form.append('fuel_type', 'petrol');
  form.append('transmition_type', 'manual');
  form.append('price', '2000');
  form.append('seat', '7');
  
  // Dummy file
  fs.writeFileSync('dummy.jpg', 'dummy content');
  form.append('image', fs.createReadStream('dummy.jpg'));

  try {
    const res = await axios.post('http://localhost:5000/api/admin/addProduct', form, {
      headers: form.getHeaders()
    });
    console.log(res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.log('Error:', err.response.status, err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  }
}

test();
