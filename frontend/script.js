document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user_id = document.getElementById('user_id').value.trim();
  const username = document.getElementById('username').value.trim();
  const accountnumber = document.getElementById('accountnumber').value.trim();
  const password = document.getElementById('password').value.trim();
  const emailid = document.getElementById('emailid').value.trim();
  const mobilenumber = document.getElementById('mobilenumber').value.trim();

  if (!user_id || !username || !accountnumber || !password || !emailid || !mobilenumber) {
    alert('All fields are required and cannot be empty.');
    return;
  }

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        username,
        accountnumber,
        password,
        emailid,
        mobilenumber
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to register the user');
    }
    alert(data.message);
    document.getElementById('registrationForm').reset();
  } catch (error) {
    alert('Registration failed: ' + error.message);
    console.error('Error:', error);
  }
});

document.getElementById('retrievalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user_id = document.getElementById('retrieve_user_id').value.trim();

  if (!user_id) {
    alert('User ID is required.');
    return;
  }

  try {
    const response = await fetch(`/api/users/${user_id}`, {  // Corrected line
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to retrieve the user data');
    }

    const userDataDiv = document.getElementById('userData');
    userDataDiv.innerHTML = `
      <p>User ID: ${data.user_id}</p>
      <p>Username: ${data.username}</p>
      <p>Account Number: ${data.accountnumber}</p>
      <p>Email ID: ${data.emailid}</p>
      <p>Mobile Number: ${data.mobilenumber}</p>
    `;
  } catch (error) {
    alert('User retrieval failed: ' + error.message);
    console.error('Error:', error);
  }
});
