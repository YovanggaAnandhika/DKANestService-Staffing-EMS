#!/bin/sh

# Generate SSH host keys if they don't exist
ssh-keygen -A
# Check if the root password has been previously generated
if [ -f /root/.password_set ]; then
    echo "Root password is already set. Not generating a new password."
else
    # Check if the environment variable for the root password is set
    if [ -z "$DKA_SSH_ROOT_PASSWORD" ]; then
        # Generate a random password for the root user
        ROOT_PASSWORD=$(openssl rand -base64 20)
        echo "Generated root password: $ROOT_PASSWORD"
    else
        ROOT_PASSWORD="$DKA_SSH_ROOT_PASSWORD"
        echo "Using provided root password: $ROOT_PASSWORD"
    fi
    # Set the root password
    echo "root:$ROOT_PASSWORD" | chpasswd

    # Create a file to indicate that the password has been set
    touch /root/.password_set
fi

# Start the SSH server
/usr/sbin/sshd -D &

# Start the application
yarn run start:prod