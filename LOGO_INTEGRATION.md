# Logo Integration Instructions

## Current Status
✅ Beta tags have been added to:
- Header (next to "BankKaro API Docs")
- Home page hero section (next to "BankKaro API Hub")
- Admin panel (next to "API Documentation Admin")

✅ Logo placeholder has been integrated in:
- Header (left side, before the title)
- Home page hero section (left side, before the title)

## When You Have the Logo

### Option 1: Replace LogoPlaceholder Component
1. Upload your logo to `src/assets/` folder
2. Replace the `LogoPlaceholder` component in `src/components/LogoPlaceholder.jsx` with:

```jsx
import { Box } from '@mui/material';
import logoImage from '../assets/your-logo.png'; // Update path

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 48, height: 48 }
  };

  const { width, height } = sizes[size];

  return (
    <Box
      component="img"
      src={logoImage}
      alt="BankKaro Logo"
      sx={{
        width,
        height,
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo;
```

### Option 2: Direct Image Component
Replace `LogoPlaceholder` imports with direct `<img>` tags:

```jsx
// In Layout.jsx and Home.jsx, replace:
<LogoPlaceholder size="medium" />

// With:
<Box
  component="img"
  src="/path/to/your/logo.png"
  alt="BankKaro Logo"
  sx={{
    width: 40,
    height: 40,
    objectFit: 'contain'
  }}
/>
```

## Layout Preservation
✅ The current layout will be preserved - the logo will be positioned exactly where the placeholder is now, without disturbing any other elements.

## Logo Recommendations
- **Format**: PNG or SVG (SVG preferred for scalability)
- **Size**: At least 48x48px (will be scaled down)
- **Background**: Transparent or white background
- **Style**: Should work well on both light and dark backgrounds

## Current Placeholder Locations
1. **Header**: Left side, before "BankKaro API Docs" title
2. **Home Page**: Left side, before "BankKaro API Hub" title
3. **Responsive**: Automatically adjusts size for mobile/desktop 