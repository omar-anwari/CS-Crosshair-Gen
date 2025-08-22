# CS2 Crosshair Generator

A small project that'll let people create custom crosshairs for CS2 in their browser.

## Features

- **Crosshair Visualization**: Live preview as you create the crosshair
- **Custom Controls**: Adjust the colour, size, and shape of the crosshair
- **Code Parsing**: Import and parse the crosshair code that CS2 gives you so you can quickly recreate/modify it
- **Preset Selection**: Build off of some premade presets

## To Do/Add
- [ ] Add agents in screenshots
- [ ] Figure out how to add dynamic crosshairs

## Getting Started

To get started with the CS2 Crosshair Generator, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/cs2-crosshair-generator.git
   cd cs2-crosshair-generator
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   Start the application in development mode:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` in your web browser to view the application.

## Project Structure

- `src/app`: Contains the main application layout and global styles.
- `src/components`: Includes reusable components for crosshair visualization, controls, code parsing, and preset selection.
- `src/lib`: Contains utility functions and configuration related to crosshair settings.
- `src/types`: Defines TypeScript types and interfaces for crosshair data.
- `public/fonts`: Directory for custom font files used in the application.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request and I'll get to it when I can

## License

This project is licensed under the MIT License. See the LICENSE file for more details.