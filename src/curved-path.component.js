import React from 'react';
import Victor from 'victor';

/**
 * a cache for paths so that you dont need to recompute them
 */
const pathCache = {};

/**
 * gets curved path points of the svg path (tested convex clockwise) with corner rounded up according to a given radius using either cubic or quadratic functions
 * @param {Array<Object>} points { x, y, r(corner radius), rPrev(corner radius from the point before), rNext(corner radius to the next point), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the default "cubic" prop), useMinRadius(set to true to normalise radius or false to keep radius dependant on each segment length or dont set it to take the default "useMinRadius" prop) }
 * @param {number} scaleX (default 1)
 * @param {number} scaleY (default 1)
 * @param {boolean} useMinRadius normalise corners (default true)
 * @returns {Array<Array<Victor>} the curved path points of the svg path
 */
function getDrawPoints(points, scaleX, scaleY, useMinRadius) {
  const scaleVector = new Victor(scaleX || 1, scaleY || 1);
  const scaledPoints = points.map((point) => {
    return new Victor(point.x, point.y).multiply(scaleVector);
  });
  const vectors = scaledPoints.map((point, i, points) => {
    const next = points[(i + 1 + points.length) % points.length];
    const ret = { vector: next.clone().subtract(point) };
    ret.length = ret.vector.length();
    return ret;
  });

  return vectors.map((next, i) => {
    const point = points[i];
    const corner = scaledPoints[i];
    
    const prev = vectors[(i - 1 + vectors.length) % vectors.length];

    let rPrev = point.rPrev || point.r || .1, rNext = point.rNext || point.r || .1;
    if((point.useMinRadius === undefined && useMinRadius) || point.useMinRadius) {
      rPrev = rNext = Math.min(rPrev * prev.length, rNext * next.length);
      rPrev /= prev.length;
      rNext /= next.length;
    }

    const preCorner = corner.clone().subtract(prev.vector.clone().multiplyScalar(rPrev));
    const postCorner = corner.clone().add(next.vector.clone().multiplyScalar(rNext));

    return [
      preCorner,  // where the curvature starts
      corner,     // the corner original position (to be used as control point position)
      postCorner  // where the curvature ends
    ];
  });
}

/**
 * gets the svg path string value from draw points
 * @param {Array<Array<Victor>} drawPoints the return of the function getDrawPoints
 * @param {Array<Object>} points { x, y, r(corner radius), rPrev(corner radius from the point before), rNext(corner radius to the next point), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the default "cubic" prop), useMinRadius(set to true to normalise radius or false to keep radius dependant on each segment length or dont set it to take the default "useMinRadius" prop) }
 * @param {boolean} cubic make cubic corners (default true)
 * @returns {string} the svg path string value
 */
function getPathFromDrawPoints(drawPoints, points, cubic = true) {
  return drawPoints.map(([preCorner, corner, postCorner], i) => {
    const point = points[i];
    const isCubic = point.Q === undefined ? (cubic !== false) : !!point.Q;
    return (i === 0 ? 'M' : 'L') + preCorner.x + ',' + preCorner.y + ' ' + (isCubic ? ('C' + corner.x + ',' + corner.y + ' ' + corner.x + ',' + corner.y) : ('Q' + corner.x + ',' + corner.y)) + ' ' + postCorner.x + ',' + postCorner.y;
  }).join(' ') + ' Z';
}

/**
 * Dont touch my privates! (for testing and debugging)
 */
export const __PRIVATES__ = {
  pathCache,
  getDrawPoints,
  getPathFromDrawPoints
};

/**
 * gets the svg path string value (tested convex colockwise) with corner rounded up according to a given radius using either cubic or quadratic functions
 * @param {Array<Object>} points { x, y, r(corner radius), rPrev(corner radius from the point before), rNext(corner radius to the next point), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the defauld "cubic" prop), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the default "cubic" prop), useMinRadius(set to true to normalise radius or false to keep radius dependant on each segment length or dont set it to take the default "useMinRadius" prop) }
 * @param {boolean} cubic make cubic corners (default true)
 * @param {number} scaleX (default 1)
 * @param {number} scaleY (default 1)
 * @param {boolean} useMinRadius normalise corners (default true)
 * @returns {string} the svg path string value
 */
export function getPath(points, cubic, scaleX, scaleY, useMinRadius) {
  const drawPoints = getDrawPoints(points, scaleX, scaleY, useMinRadius === undefined ? true : useMinRadius);

  const pathPoints = getPathFromDrawPoints(drawPoints, points, cubic);

  return pathPoints;
}

/**
 * gets and caches the svg path string value (tested convex colockwise) with corner rounded up according to a given radius using either cubic or quadratic functions
 * @param {string} pathId the id of the path used for caching/cached/precalculated paths (if it is not cached it will be cached and later used from this cache)
 * @param {Array<Object>} points { x, y, r(corner radius), rPrev(corner radius from the point before), rNext(corner radius to the next point), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the default "cubic" prop), useMinRadius(set to true to normalise radius or false to keep radius dependant on each segment length or dont set it to take the default "useMinRadius" prop) }
 * @param {boolean} cubic make cubic corners (default true)
 * @param {number} scaleX (default 1)
 * @param {number} scaleY (default 1)
 * @param {boolean} useMinRadius normalise corners (default true)
 * @returns {string} the svg path string value
 */
export function preCalculatePath(pathId, points, cubic, scaleX, scaleY, useMinRadius) {
  const pathPoints = pathCache[pathId] || getPath(points, cubic, scaleX, scaleY, useMinRadius);

  if(pathId) {
    pathCache[pathId] = pathPoints;
  }

  return pathPoints;
}

/**
 * added paths to pathCache if you have precalculated paths add the to cache here
 * @param {Object} toBeAdded the cache entries to be added keyed by the pathId e.g. { "path1": "M0,0 L100,0...", "path2": "..." }
 */
export function addToCache(toBeAdded) {
  Object.assign(pathCache, toBeAdded);
}

/**
 * draws an svg path (tested convex colockwise) with corner rounded up according to a given radius using either cubic or quadratic functions
 * @param {string} pathId the id of the path used for caching/cached/precalculated paths (if it is not cached it will be cached and later used from this cache)
 * @param {Array<Object>} points { x, y, r(corner radius), rPrev(corner radius from the point before), rNext(corner radius to the next point), Q(set to true to have quadratic corner curve or false to have cubic corner curve or dont set it to take the default "cubic" prop), useMinRadius(set to true to normalise radius or false to keep radius dependant on each segment length or dont set it to take the default "useMinRadius" prop) }
 * @param {boolean} cubic make cubic corners (default true)
 * @param {number} scaleX (default 1)
 * @param {number} scaleY (default 1)
 * @param {boolean} useMinRadius normalise corners (default true)
 */
export function SVGCurvedPath({ pathId, points, cubic, scaleX, scaleY, useMinRadius, ...restProps }) {

  const pathPoints = preCalculatePath(pathId, points, cubic, scaleX, scaleY, useMinRadius);

  return (
    <path {...restProps} d={pathPoints}></path>
  );
}

/**
 * draws an svg path (tested convex colockwise) with corner rounded up according to a given radius using either cubic or quadratic functions
 * @param {string} pathId the id of the cached path
 */
export function SVGCachedPath({ pathId, ...restProps }) {

  return (
    <path {...restProps} d={pathCache[pathId]}></path>
  );
}

/**
 * creates a svg element with specified width and a height
 * @param {number} width
 * @param {number} height
 */
export function SVG({ width, height, children, ...restProps }) {

  return (
    <svg {...restProps} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width + 'px'} height={height + 'px'} viewBox={'0 0 ' + width + ' ' + height} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}
