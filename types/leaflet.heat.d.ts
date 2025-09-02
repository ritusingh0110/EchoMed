declare module "leaflet.heat" {
  // side-effect module that augments Leaflet by adding L.heatLayer
  const plugin: unknown
  export default plugin
}

declare module "leaflet" {
  // heatmap point: [lat, lng, intensity]
  type HeatLatLngTuple = [number, number, number]

  interface Layer {}

  interface HeatLayer extends Layer {
    setLatLngs(points: HeatLatLngTuple[] | Array<[number, number, number]>): this
    addTo(map: Map): this
    remove(): this
    redraw(): this
    setOptions(options: {
      radius?: number
      blur?: number
      maxZoom?: number
      minOpacity?: number
      max?: number
      gradient?: Record<number, string>
    }): this
  }

  export function heatLayer(
    points: HeatLatLngTuple[] | Array<[number, number, number]>,
    options?: {
      radius?: number
      blur?: number
      maxZoom?: number
      minOpacity?: number
      max?: number
      gradient?: Record<number, string>
    },
  ): HeatLayer
}
