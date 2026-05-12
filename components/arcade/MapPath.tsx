/**
 * Decorative dotted travel paths drawn between destinations on the pixel map.
 * Coordinates are in a 1200x600 viewBox; the SVG stretches to fill its
 * container, so paths line up regardless of grid pixel size.
 */
export function MapPath() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      {/* Hub roughly at (600, 320). Paths radiate to the destinations. */}
      {/* Hub → Calendar Castle (top-left) */}
      <path className="map-path" d="M 600 320 Q 480 220, 240 140" />
      {/* Hub → Itinerary Road (top-mid) */}
      <path className="map-path" d="M 600 320 Q 600 220, 600 140" />
      {/* Hub → Idea Cave (top-right) */}
      <path className="map-path" d="M 600 320 Q 760 220, 960 140" />
      {/* Hub → Budget Bank (left) */}
      <path className="map-path" d="M 600 320 Q 360 320, 120 320" />
      {/* Hub → Packing Forest (right) */}
      <path className="map-path" d="M 600 320 Q 820 320, 1000 320" />
      {/* Hub → Achievement Tower (far right) */}
      <path className="map-path" d="M 600 320 Q 880 280, 1120 240" />
      {/* Hub → Quest Village (bottom-left) */}
      <path className="map-path" d="M 600 320 Q 420 440, 240 500" />
      {/* Hub → Party Camp (bottom-mid) */}
      <path className="map-path" d="M 600 320 Q 600 440, 600 500" />
      {/* Hub → Memory Lake (bottom-right) */}
      <path className="map-path" d="M 600 320 Q 800 440, 960 500" />
    </svg>
  );
}
