# SaaS Boilerplate

A minimalist single-page SaaS boilerplate with complete authentication system, customizable dashboard, and Stripe subscription billing integration.

## Features

- Complete authentication system:
  - User registration with email verification
  - Login system
  - Password reset via email
- Customizable dashboard with permissions management
- Stripe subscription billing:
  - No plan by default
  - Premium plan integration
  - Complete subscription management

## Tech Stack

### Frontend

- React
- TailwindCSS
- Vite

### Backend

- Django
- PostgreSQL
- Stripe API integration

## Project Structure

```
saas-boilerplate/
├── frontend/          # React frontend application
├── backend/          # Django backend application
│   ├── authentication/  # Auth system
│   ├── billing/        # Stripe integration
│   └── core/           # Core application
└── database/         # Database related files
```

## Prerequisites

- Node.js
- Python
- PostgreSQL
- Stripe account
- Email service provider credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MartinPHLP/saas-boilerplate.git
cd saas-boilerplate
```

2. Setup backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Setup frontend:

```bash
cd frontend
npm install
```

## Configuration

1. Create and configure backend `.env` file:

```bash
cd backend
cp .env.example .env
```

Fill in the following environment variables:

```
SECRET_KEY="your-django-secret-key"
FRONTEND_URL="http://localhost:5173"  # Your frontend URL

STRIPE_SECRET_KEY_TEST="your-stripe-test-key"
STRIPE_PREMIUM_PRICE_ID="your-stripe-price-id"

EMAIL_HOST_USER="your-email"
EMAIL_HOST_PASSWORD="your-email-password"
EMAIL_HOST="your-email-host"
EMAIL_PORT="your-email-port"

DB_NAME="your-db-name"
DB_USER="your-db-user"
DB_PASSWORD="your-db-password"
DB_HOST="localhost"
DB_PORT="5432"
```

2. Configure frontend API URL:

```bash
cd frontend/src
```

Update `config.js` with your backend API URL:

```javascript
export const API_BASE_URL = "http://localhost:8000";
```

## Database Setup

1. Create PostgreSQL database:

```bash
cd database
docker compose up --build
```

2. Run migrations:

```bash
cd backend
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

## Running the Application

1. Start the backend server:

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application should now be running at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Database: http://localhost:5432

## Additional Setup

### Stripe Configuration

1. Create a Stripe account if you haven't already
2. Get your test API keys from the Stripe dashboard
3. Create products and price IDs for your subscription plans
4. Update the `STRIPE_PREMIUM_PRICE_ID` in your `.env` file

### Email Service Configuration

Configure your email service provider in the `.env` file for:

- User registration verification
- Password reset functionality

## Development

- Frontend code can be modified in the `frontend/src` directory
- Backend API endpoints can be added/modified in respective Django apps
- Develop your saas service in a new app (`python manage.py startapp service_name`), add it to the `INSTALLED_APPS` list in `backend/core/settings.py` and create your views, models, serializers, etc. in the new app.

## License

Do whatever you want with this code, it's free and open source.
