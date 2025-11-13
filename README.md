# Horizon Student Success System

A comprehensive web-based platform designed to support academic advisors and students in monitoring and improving academic performance through data-driven insights and early intervention strategies.

## Features

- **Role-Based Access**: Separate interfaces for advisors and students
- **Student Performance Tracking**: Monitor GPA, attendance, and engagement metrics
- **Risk Assessment**: Identify at-risk students with tier-based classification
- **Intervention Management**: Track and create intervention notes
- **Data Visualization**: Interactive charts and graphs for trend analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Vite for build tooling

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── data/              # Mock data and types
├── lib/               # Utility functions
└── index.css          # Global styles
```

## Usage

### Advisor Dashboard
- View all students and their performance metrics
- Identify high-risk students requiring attention
- Access detailed student profiles
- Add and track intervention notes

### Student Dashboard
- View personal academic performance
- Track GPA trends over time
- Access recommended actions
- Find academic resources and support

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Docker Support

The application includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t horizon-app .

# Run container
docker run -p 8080:80 horizon-app
```

## License

This project is for educational purposes.
