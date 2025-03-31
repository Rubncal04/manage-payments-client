# YouTube Premium Frontend

A React application for managing YouTube Premium subscriptions, built with TypeScript, Vite, and Tailwind CSS.

## Features

- User management (create, list, update)
- Payment processing simulation
- Payment history tracking
- Responsive design with dark theme
- Real-time status updates

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Yup (form validation)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Go API backend running locally (see API section)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-premium-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── core/
│   ├── domain/         # TypeScript interfaces and types
│   ├── services/       # API services and business logic
│   └── repositories/   # Data access layer
├── presentation/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   └── layouts/       # Layout components
└── utils/             # Utility functions and helpers
```

## API Endpoints

The application consumes the following endpoints from the Go API:

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Payments

- `POST /api/v1/:userId/payments` - Create payment for user
- `GET /api/v1/:userId/payments` - Get user's payment history

## Components

### UserCard
Displays user information including:
- Name
- Phone number
- Payment status
- Payment date
- Action buttons (edit, delete, payment)

### PaymentForm
Handles payment processing with:
- Payment amount display
- Payment processing simulation
- Payment history display
- Success/error states
- Loading states

### UserList
Shows a list of users with:
- Filtering by payment status
- Sorting options
- Responsive grid layout
- Loading states

## State Management

The application uses React's built-in state management:
- `useState` for local component state
- `useEffect` for side effects
- Context API for global state (if needed)

## Styling

The application uses Tailwind CSS for styling with:
- Dark theme
- Responsive design
- Custom components
- Loading animations
- Status indicators

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

The project follows:
- ESLint configuration for TypeScript
- Prettier for code formatting
- TypeScript strict mode
- React best practices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
