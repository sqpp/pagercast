const bcrypt = require("bcryptjs");

// Get the new password from command-line argument
const newPassword = process.argv[2];

// Check if a new password is provided
if (newPassword) {
  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  // Display the hashed password
  console.log("Hashed password:", hashedPassword);
} else {
  console.log("No new password provided.");
}
