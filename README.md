A component that generates curved cornered SVG path from a points array. See bellow and check out the [small app](https://github.com/maa105/casio-sl-300sv)) I extracted it from. I also put out a [small demo](https://maa105.github.io/react-svg-curved-path/))

Example code to draw a rounded corner square:

```
  <SVG width={100} height={100}>
    <SVGCachedPath
      style={{
        stroke: 'none',
        fill: 'black',
        strokeWidth: '0px'
      }}
      points={[
        { x: 0, y: 0, r: .2 },
        { x: 1, y: 0, r: .2 },
        { x: 1, y: 1, r: .2 },
        { x: 0, y: 1, r: .2 }
      ]}
      scaleX={'100'} scaleY={'100'}
    />
  </SVG>
```

You can also precashe/precalculate your paths and give them ids for later use:

```
  preCalculatePath('sexy-btn', [
    { x: 0, y: 0, r: .2 },
    { x: 1, y: 0, r: .2 },
    { x: .9, y: 1, r: .4 },
    { x: .1, y: 1, r: .4 },
  ], true, 200, 100, true);
  // ... then later ...
  <SVG width={200} height={100}>
    <SVGCachedPath
      pathId={'sexy-btn'} 
      style={{
        stroke: 'none',
        fill: 'black',
        strokeWidth: '0px'
      }}
    />
  </SVG>
```
