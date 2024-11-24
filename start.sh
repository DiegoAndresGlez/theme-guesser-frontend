#!/bin/bash

# Create a new .env file
cat << EOF > /app/dist/.env
VITE_SUPABASE_KEY=${VITE_SUPABASE_KEY}
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_BACKEND_URL=${VITE_BACKEND_URL}
EOF

# Print confirmation (optional, good for debugging)
echo "Environment variables have been written to .env file"

# Start the server
exec serve -s dist -l 8080