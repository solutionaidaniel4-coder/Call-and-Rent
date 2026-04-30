# Call & Rent - Premium Car Rental Platform

A high-end corporate car rental website built with Next.js and Tailwind CSS, featuring a modern, premium design aesthetic.

## Features

- **Premium Car Cards**: Clean white backgrounds with sharp shadows for a high-end look
- **Specifications Display**: Lucide icons showing Transmission, Fuel type, and Passenger capacity
- **Bold Pricing**: Eye-catching pricing display in the bottom right corner
- **Fast Booking Button**: Standout call-to-action with gradient styling
- **Responsive Grid Layout**: Adapts seamlessly from mobile to desktop
- **Hover Effects**: Interactive animations for enhanced user experience

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## Project Structure

```
src/
|-- app/
|   |-- globals.css          # Global styles with Tailwind
|   |-- layout.tsx           # Root layout component
|   |-- page.tsx             # Main page with car grid
|-- components/
|   |-- CarCard.tsx          # Premium car card component
|-- data/
|   |-- cars.ts              # Car data and specifications
|-- types/
|   |-- car.ts               # TypeScript interfaces
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Features

### Premium Card Design
- Clean white backgrounds with premium shadows
- Hover effects with elevation changes
- Smooth transitions and micro-interactions

### Specifications Row
- Transmission type (Manual/Automatic)
- Fuel type (Gasoline/Diesel/Electric/Hybrid)
- Passenger capacity with icons

### Pricing Layout
- Bold, prominent pricing in bottom right
- Clear per-day pricing format
- Contrasting colors for visibility

### Fast Booking Button
- Gradient background for standout appearance
- Hover animations with scale effects
- Shadow effects for depth

## Available Cars

The fleet includes luxury vehicles from premium brands:
- Mercedes-Benz S-Class
- BMW 7 Series
- Tesla Model S
- Porsche 911
- Range Rover Sport
- Audi A8
- Lexus LS
- Jaguar XF

Each car includes detailed specifications and competitive daily rates.
