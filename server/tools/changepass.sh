#!/bin/bash

# Prompt user for a new password
read -sp "Enter new password: " newPassword
echo

# Execute the Node.js script with the new password as an argument
node index.js "$newPassword"
