import React, { Component } from 'react';
import { SVG, SVGCachedPath, preCalculatePath } from '../../src/curved-path.component';

preCalculatePath('square', [
  { x: 0, y: 0, r: .25 },
  { x: 1, y: 0, r: .25 },
  { x: 1, y: 1, r: .25 },
  { x: 0, y: 1, r: .25 },
], true, 100, 100, true);

preCalculatePath('quadratic-square', [
  { x: 0, y: 0, r: .25 },
  { x: 1, y: 0, r: .25 },
  { x: 1, y: 1, r: .25 },
  { x: 0, y: 1, r: .25 },
], false, 100, 100, true);

preCalculatePath('quadratic-variable-square', [
  { x: 0, y: 0, r: .1 },
  { x: 1, y: 0, r: .2 },
  { x: 1, y: 1, r: .3 },
  { x: 0, y: 1, r: .4 },
], false, 100, 100, true);

preCalculatePath('sexy-btn', [
  { x: .1, y: .1, r: .2 },
  { x: .9, y: .1, r: .2 },
  { x: .8, y: .9, r: .4 },
  { x: .2, y: .9, r: .4 },
], true, 160, 100, true);

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
        <SVG width={100} height={100}>
          <SVGCachedPath
            pathId={'square'} 
            style={{
              stroke: 'none',
              fill: '#3c3644',
              strokeWidth: '0px'
            }}
          />
        </SVG>
        &nbsp;&nbsp;&nbsp;
        <SVG width={100} height={100}>
          <SVGCachedPath
            pathId={'quadratic-square'} 
            style={{
              stroke: 'none',
              fill: '#3c3644',
              strokeWidth: '0px'
            }}
          />
        </SVG>
        &nbsp;&nbsp;&nbsp;
        <SVG width={100} height={100}>
          <SVGCachedPath
            pathId={'quadratic-variable-square'} 
            style={{
              stroke: 'none',
              fill: '#3c3644',
              strokeWidth: '0px'
            }}
          />
        </SVG>
        <br/><br/>
        <SVG className={'sexy-btn'} width={160} height={100}>
          <defs>
            <filter xmlns="http://www.w3.org/2000/svg" filterUnits="objectBoundingBox" width="200%" height="200%" id="dropshadow">
              <feGaussianBlur in="SourceAlpha" result="shadow" stdDeviation="2"/>
              <feOffset dx="0" dy="3" in="shadow" result="shadowoffset"/>
              <feFlood floodColor="rgba(0,0,0,0.5)"/>
              <feComposite in2="shadowoffset" operator="in"/>
              <feMerge result="dropshadowresult"><feMergeNode/>
              <feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <SVGCachedPath
            pathId={'sexy-btn'} 
            style={{
              stroke: 'none',
              fill: '#3c3644',
              strokeWidth: '0px',
              filter: 'url(#dropshadow)'
            }}
          />
          <text textAnchor="middle" x="50%" y="50%" dy={'15px'} fill='white' fontSize={'50px'}>
            OK
          </text>
        </SVG>
        <br/><br/>
        <SVG width={500} height={100}>
          <SVGCachedPath style={{
            stroke: 'none',
            fill: '#3c3644',
            strokeWidth: '0px'
          }} pathId={'path' + this.state.i} />
        </SVG>
      </div>
    );
  }
}

export default App;
