# BankKaro API Documentation

A modern, responsive API documentation website built with React, Vite, and Material UI for BankKaro's partner APIs.

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Sidebar**: Easy navigation between different API endpoints
- **Comprehensive Documentation**: Each API includes:
  - Endpoint URL and HTTP methods
  - Request schema with field descriptions and validation rules
  - Sample request and response JSON
  - Validation notes and requirements
  - Additional information about authentication, rate limiting, and error handling
- **Modern UI**: Built with Material UI components for a professional look
- **Modular Structure**: Easy to add new APIs and endpoints

## Included APIs

1. **Partner Authentication** (`/sp/api/partner-auth`) - POST
2. **Lead Details** (`/sp/api/lead-details`) - GET, POST
3. **Loan Application** (`/sp/api/application`) - POST
4. **Partner Auto Authentication** (`/sp/api/partner-autoAuth`) - POST
5. **Partner Token Management** (`/sp/api/partner-token`) - POST

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Material UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Emotion** - CSS-in-JS styling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bankkaro-api-docs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar and navigation
│   └── ApiDocumentation.jsx # API documentation display component
├── data/
│   └── apiData.js          # API endpoint data and schemas
├── App.jsx                 # Main application component
└── main.jsx               # Application entry point
```

## Adding New APIs

To add new APIs, simply update the `src/data/apiData.js` file:

1. Add a new entry to the `apiData` object
2. Include all required fields:
   - `name`: Display name
   - `endpoint`: API endpoint URL
   - `methods`: Array of HTTP methods
   - `description`: API description
   - `requestSchema`: Request parameters schema
   - `sampleRequest`: Sample request JSON
   - `sampleResponse`: Sample response JSON
   - `validationNotes`: Array of validation rules

The new API will automatically appear in the sidebar and be accessible via routing.

## Features

### Responsive Layout
- Desktop: Fixed sidebar with main content area
- Mobile: Collapsible sidebar with hamburger menu

### API Documentation Features
- **Request Schema**: Detailed field descriptions with validation rules
- **Sample Data**: Formatted JSON examples for requests and responses
- **HTTP Methods**: Visual indicators for different HTTP methods
- **Validation Notes**: Clear validation requirements and constraints
- **Additional Information**: Expandable sections with authentication, rate limiting, and error handling details

### Navigation
- URL-based routing (`/docs/endpoint-name`)
- Automatic redirect to first API on page load
- Active state highlighting in sidebar

## Customization

### Styling
The application uses Material UI theming. You can customize the theme in `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
});
```

### Adding New API Categories
To add new API categories (like CardGenius APIs), you can:
1. Modify the sidebar structure in `Layout.jsx`
2. Add category grouping in the API data structure
3. Update the navigation logic to handle multiple categories

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary to BankKaro.

## Contributing

1. Follow the existing code structure and patterns
2. Use Material UI components for consistency
3. Ensure responsive design works on all screen sizes
4. Test navigation and routing functionality
5. Update API documentation data as needed
