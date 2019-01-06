import React, { Component } from 'react';
import { SVGCachedPath, preCalculatePath } from '../../src/curved-path.component';

const dx = .2/25, dy = .4/25;
for(var i = 0; i < 25; i++) {
  preCalculatePath('path' + i, [
    { x: 0, y: 0, r: .2 },
    { x: .3 + i * dx, y: 0, r: .4 },
    { x: .3 + i * dx, y: .4 - i * dy, r: .4 },
    { x: .7 - i * dx, y: .4 - i * dy, r: .4 },
    { x: .7 - i * dx, y: 0, r: .4 },
    { x: 1, y: 0, r: .2 },
    { x: 1, y: 1, r: .2 },
    { x: 0, y: 1, r: .2 },
  ], true, 500, 100, true);
}
preCalculatePath('path25', [
  { x: 0, y: 0, r: .2 },
  { x: 1, y: 0, r: .2 },
  { x: 1, y: 1, r: .2 },
  { x: 0, y: 1, r: .2 },
], true, 500, 100, true);

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      i: 0, c: 0
    };
  }

  componentDidMount() {
    setInterval(() => {
      let c = this.state.c;
      c = (c + 1) % 50;
      let i = 25 - Math.abs(c - 25);
      this.setState({ i, c });
    }, 50);
  }

  render() {
    return (
      <div style={{padding: 20}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={'500px'} height={'500px'} viewBox={'0 0 500 500'} preserveAspectRatio="xMidYMid meet">
          <SVGCachedPath style={{
            stroke: 'none',
            fill: 'black',
            strokeWidth: '0px'
          }} pathId={'path' + this.state.i} />
        </svg>
      </div>
    );
  }
}

export default App;
