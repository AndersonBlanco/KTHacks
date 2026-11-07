# Transactions API

Express + Supabase API used for the Hackcessability full-stack workshop.
It covers basic CRUD on a transactions table (called `Creds`) in Supabase.

Live version: https://kthacks.onrender.com

## Run it locally

npm install

Make a `.env` file in the project root:

SUPABASE_PROJECT_URL=https://your-project-ref.supabase.co
SUPABASE_API_KEY=your_key_here

Then:

node main.js

It runs on http://localhost:3000.

## Endpoints

GET /
Returns "Hello Universe!". Just a check that the server is up.

GET /api/transactions
Returns every row in the table.

GET /api/transactions?transactionId=TX4042000020160
Returns only the row with that transaction_id. If nothing matches,
the response is a 200 with an empty data array.

POST /api/transactions
Body: { "transactionId": "TX00000002" }
Creates a row with that transaction_id. Everything else in the row
starts out null. Returns 201.

PATCH /api/transactions/:transactionId
Body is whatever fields need to change, e.g.
{ "transaction_amount": 42.50 }
Returns 404 if the id doesn't exist.

DELETE /api/transactions/:transactionId
Deletes the row. Returns 404 if the id doesn't exist.

## Response format

Every response looks like this:

{
  "text": "Posted successfully",
  "success": true,
  "data": [ ... ]
}

Errors come back as success: false with an error message.

## Deploying on Render

Push the repo, make a new Web Service, and add the two env vars
(SUPABASE_PROJECT_URL, SUPABASE_API_KEY) in the Render dashboard.
Don't commit the .env file.

## Notes

- The table is a transactions dataset, so a new row is mostly nulls
  until some fields are set with PATCH.
- transaction_id is the key every lookup uses.
