# Bouncing Ball Visualizer

A mesmerizing audio-visual experience featuring a bouncing ball that creates dynamic beats and stunning visual effects. Watch as the ball accelerates with each bounce, cycling through rainbow colors while generating particle effects and musical tones.

![Bouncing Ball Visualizer](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Multiple Geometric Shapes**: Choose from circle, square, triangle, or hexagon boundaries
- **Dynamic Audio Generation**: Musical beeps that change pitch based on the ball's color
- **Visual Effects**:
  - Rainbow color transitions
  - Particle explosions on collision
  - Motion trail effects
  - Glow effects around the ball
- **Adjustable Parameters**:
  - Ball speed (1-10)
  - Ball size (10-50px)
  - Tempo increase rate (1-20%)
- **Real-time Statistics**: Track bounces, BPM, and current speed
- **Keyboard Shortcuts**: Quick controls for enhanced user experience
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Demo

Simply open `index.html` in your web browser to start the visualizer.

## 🎮 Controls

### Mouse Controls
- **Click Canvas or Start Button**: Toggle start/stop
- **Click Shape Buttons**: Change boundary shape (when stopped)
- **Sliders**: Adjust speed, size, and tempo increase rate
- **Toggle Buttons**: Enable/disable trails, glow, and particles

### Keyboard Shortcuts
- `Space`: Start/Stop the animation
- `R`: Reset the ball position (when stopped)
- `1`: Select circle shape
- `2`: Select square shape
- `3`: Select triangle shape
- `4`: Select hexagon shape

## 📁 Project Structure

```
bouncing-ball-visualizer/
│
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # Core logic and interactivity
└── README.md           # This file
```

## 🛠️ Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/bouncing-ball-visualizer.git
```

2. Navigate to the project directory:
```bash
cd bouncing-ball-visualizer
```

3. Open `index.html` in your web browser:
```bash
open index.html
```

Or simply drag and drop `homepage.html` into your browser.

## 💻 Technical Details

### Technologies Used
- **HTML5 Canvas**: For rendering graphics and animations
- **Web Audio API**: For generating dynamic audio tones
- **Vanilla JavaScript**: Pure JS with no dependencies
- **CSS3**: Modern styling with glassmorphism effects

### Key Components

#### Physics Engine
- Accurate collision detection for all shapes
- Realistic reflection vectors
- Velocity-based tempo calculation

#### Audio System
- Dynamic frequency generation (200-800Hz)
- Pitch changes based on color hue
- Smooth gain envelope for pleasant beeps

#### Visual Effects
- HSL color cycling for smooth rainbow transitions
- Particle system with physics simulation
- Alpha-based trail rendering
- Shadow-based glow effects

## 🎨 Customization

You can easily customize the visualizer by modifying these variables in `script.js`:

```javascript
// Default settings
let settings = {
    speed: 5,              // Initial ball speed
    ballSize: 20,          // Ball radius in pixels
    tempoIncrease: 5,      // Speed increase percentage per bounce
    trails: true,          // Enable motion trails
    glow: true,            // Enable glow effect
    particles: true        // Enable particle explosions
};
```

### Canvas Size
Adjust the canvas dimensions in `index.html`:
```html
<canvas id="canvas" width="600" height="600"></canvas>
```

### Color Scheme
Modify the background gradient in `style.css`:
```css
body {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}
```

## 🌟 How It Works

1. **Initialization**: Ball spawns at center with random direction
2. **Animation Loop**: Canvas redraws at 60 FPS using `requestAnimationFrame`
3. **Collision Detection**: Checks if ball intersects with shape boundaries
4. **Reflection**: Calculates proper reflection vector based on collision point
5. **Speed Increase**: Multiplies velocity by tempo increase rate
6. **Effects**: Updates color, plays sound, spawns particles
7. **Stats Update**: Displays current bounce count, BPM, and speed

## 📱 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

**Note**: Web Audio API requires user interaction before playing sounds (browser security feature).

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] Add more shapes (star, pentagon, octagon)
- [ ] Multiple balls with collision detection
- [ ] Save/load preset configurations
- [ ] Record and export video
- [ ] Custom color palettes
- [ ] Gravity and physics modifiers
- [ ] Background music integration
- [ ] Mobile touch controls optimization

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Inspired by audio visualization and physics simulation projects
- Built with modern web technologies
- Thanks to the open-source community

## 📧 Contact

Project Link: [[https://github.com/OogleOG/bouncing-ball-visualizer](https://github.com/OogleOG/bouncing-ball-visualizer)](https://github.com/OogleOG/bouncing-ball-visualizer)

---

⭐ Star this repo if you find it interesting!
