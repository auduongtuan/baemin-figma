export function hexToWebRgb(hex: string): webRGB;
export function hexToWebRgb(hex: string, alpha: number): webRGBA;
export function hexToWebRgb(hex: string, alpha?: number) {
  let r = parseInt(hex.slice(1, 3), 16),
  g = parseInt(hex.slice(3, 5), 16),
  b = parseInt(hex.slice(5, 7), 16);
  if(alpha) {
    return [r, g, b, alpha];
  }
  else {
    return [r,g,b];
  }
}
export function webRGBToString(color: webRGB | webRGBA): string {
  let [r,g,b,a] = color;
  if (typeof a == 'number') {
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}
export function hexToWebRgbString(hex: string, alpha?: number): string {
  let [r, g, b] = hexToWebRgb(hex);
  if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export const namesRGB = ['r', 'g', 'b']

/**
 * this function converts figma color to RGB(A) (array)
 */

// figmaRGBToWebRGB({r: 0.887499988079071, g: 0.07058823853731155, b: 0.0665624737739563})
//=> [226, 18, 17]

export function figmaRGBToWebRGB(color: RGBA): webRGBA
export function figmaRGBToWebRGB(color: RGB): webRGB
export function figmaRGBToWebRGB(color): any {
	const rgb = []

	namesRGB.forEach((e, i) => {
		rgb[i] = Math.round(color[e] * 255)
	})

	if (color['a'] !== undefined) rgb[3] = Math.round(color['a'] * 100) / 100
	return rgb
}

/**
 * this function converts RGB(A) color (array) to figma color
 */

// webRGBToFigmaRGB([226, 18, 17])
//=> {r: 0.8862745098039215, g: 0.07058823529411765, b: 0.06666666666666667}

export function webRGBToFigmaRGB(color: webRGBA): RGBA
export function webRGBToFigmaRGB(color: webRGB): RGB
export function webRGBToFigmaRGB(color: number[]): any {
	const rgb = {};
	namesRGB.forEach((e, i) => {
		rgb[e] = color[i] / 255
	})

	if (color[3] !== undefined) rgb['a'] = color[3]
	return rgb;
}

/**
 * this function converts figma color to HEX (string)
 */

// figmaRGBToHex({ r: 0, g: 0.1, b: 1 })
//=> #001aff

export function figmaRGBToHex(color: RGB | RGBA): string {
	let hex = '#'

	const rgb = figmaRGBToWebRGB(color) as webRGB | webRGBA
	hex += ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)

	if (rgb[3] !== undefined) {
		const a = Math.round(rgb[3] * 255).toString(16)
		if (a.length == 1) {
			hex += '0' + a
		} else {
			if (a !== 'ff') hex += a
		}
	}
	return hex
}

/**
 * this function converts HEX color (string) to figma color
 */

// hexToFigmaRGB(#001aff)
//=> { r: 0, g: 0.10196078431372549, b: 1 }


export function hexToFigmaRGB(color: string): RGB | RGBA {
	let opacity = ''

	color = color.toLowerCase()

	if (color[0] === '#') color = color.slice(1)
	if (color.length === 3) {
		color = color.replace(/(.)(.)(.)?/g, '$1$1$2$2$3$3')
	} else if (color.length === 8) {
		const arr = color.match(/(.{6})(.{2})/)
		color = arr[1]
		opacity = arr[2]
	}

	const num = parseInt(color, 16)
	const rgb = [num >> 16, (num >> 8) & 255, num & 255]

	if (opacity) {
		rgb.push(parseInt(opacity, 16) / 255)
		return webRGBToFigmaRGB(rgb as webRGBA)
	} else {
		return webRGBToFigmaRGB(rgb as webRGB)
	}
}

export function webStringToWebRgb(color: string): webRGB | webRGBA | undefined {
	if(color.startsWith('rgb')) {
		let match = color.match(/[\d\.]+/g);
		if(match) {
			let rgb = match.map(Number);
			if(rgb.length == 3) {
				return rgb as webRGB;
			}
			else if(rgb.length == 4) {
				return rgb as webRGBA;
			}
		}
	}
	if(color.startsWith('#')) {
		return hexToWebRgb(color) as webRGB;
	}
}

export type webRGB = [number, number, number]
export type webRGBA = [number, number, number, number];