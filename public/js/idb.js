// Define a database variable to store client-side data
let db;

// Define the request for indexedDB
const request = indexedDB.open('budget_tracker', 1);

// Create a new object store
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
  // When db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
  db = event.target.result;

  // Check if app is online, if yes run checkDatabase() function to send all local db data to api
  if (navigator.onLine) {
    uploadBudget();
  }
};

request.onerror = function(event) {
  // Log error here
  console.log(event.target.errorCode);
};

// Define a function for saving a record
function saveRecord(record) {
  const transaction = db.transaction(['new_budget'], 'readwrite');

  const budgetObjectStore = transaction.objectStore('new_budget');

  // Add record to your store with add method.
  budgetObjectStore.add(record);
}

function uploadBudget() {
  // Open a transaction on your pending db
  const transaction = db.transaction(['new_budget'], 'readwrite');

  // Access your pending object store
  const budgetObjectStore = transaction.objectStore('new_budget');

  // Get all records from store and set to a variable
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function() {
    // If there was data in indexedDb's store, let's send it to the server
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['new_budget'], 'readwrite');
          const budgetObjectStore = transaction.objectStore('new_budget');
          // Clear all items in your store
          budgetObjectStore.clear();
        })
        .catch(err => {
          // Set reference to redirect back here
          console.log(err);
        });
    }
  };
}

// Listen for app coming back online
window.addEventListener('online', uploadBudget);