document.addEventListener('DOMContentLoaded', () => {
  const loadUsersButton = document.getElementById('loadUsers');
  const usersResultContainer = document.getElementById('usersResult');
  const createUserForm = document.getElementById('createUserForm');
  const createResultContainer = document.getElementById('createResult');

  // Load users when the button is clicked
  loadUsersButton.addEventListener('click', async () => {
    try {
      usersResultContainer.innerHTML = 'Loading...';
      
      const response = await fetch('/api/users');
      const users = await response.json();
      
      if (response.ok) {
        usersResultContainer.innerHTML = `
          <h4>Users:</h4>
          <pre>${JSON.stringify(users, null, 2)}</pre>
        `;
      } else {
        usersResultContainer.innerHTML = `
          <h4>Error:</h4>
          <pre>${JSON.stringify(users, null, 2)}</pre>
        `;
      }
    } catch (error) {
      usersResultContainer.innerHTML = `
        <h4>Error:</h4>
        <p>${error.message}</p>
      `;
    }
  });

  // Create a new user when the form is submitted
  createUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(createUserForm);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email')
    };
    
    try {
      createResultContainer.innerHTML = 'Creating user...';
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        createResultContainer.innerHTML = `
          <h4>User created successfully:</h4>
          <pre>${JSON.stringify(result, null, 2)}</pre>
        `;
        createUserForm.reset();
      } else {
        createResultContainer.innerHTML = `
          <h4>Error:</h4>
          <pre>${JSON.stringify(result, null, 2)}</pre>
        `;
      }
    } catch (error) {
      createResultContainer.innerHTML = `
        <h4>Error:</h4>
        <p>${error.message}</p>
      `;
    }
  });
});
