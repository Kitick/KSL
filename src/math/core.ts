export function roundTo(n: number, t: number = 1): number {
	return Math.round(n / t) * t;
}

export function getRangeOffset(a: number, b: number): [number, number] {
	if(a < b){ return [b - a, a]; }
	else{ return [a - b, b]; }
}

export function getMinMax(a: number, b: number): [number, number] {
	if(a < b){ return [a, b]; }
	else{ return [b, a]; }
}

export function clamp(n: number, a: number, b: number): number {
	const [min, max] = getMinMax(a, b);
	if(n < min){ return min; }
	if(n > max){ return max; }
	return n;
}

export function isWithin(n: number, a: number, b: number): boolean {
	const [min, max] = getMinMax(a, b);
	return n >= min && n <= max;
}

export function randomValue(): number;
export function randomValue(a: number, b: number): number;

export function randomValue(a: number = 0, b: number = 1): number {
	const [range, offset] = getRangeOffset(a, b);
	return Math.random() * range + offset;
}

export function randomInt(a: number, b: number): number {
	const [range, offset] = getRangeOffset(a, b);
	return Math.floor(Math.random() * (range + 1) + offset);
}

export function linearMap(n: number, a1: number, b1: number, a2: number, b2: number): number {
	const [inRange, inOffset] = getRangeOffset(a1, b1);
	const [outRange, outOffset] = getRangeOffset(a2, b2);

	return (n - inOffset) * outRange / inRange + outOffset;
}

export function circularWrap(n: number, a: number, b: number = 0): number {
	const [range, offset] = getRangeOffset(a, b);
	return ((n - offset) % range + range) % range + offset;
}

export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function factorial(n: number): number {
	if(n < 0){ throw new RangeError("Cannot compute factorial of a negative number"); }

	let result = 1;
	for(let i = 2; i <= n; i++){
		result *= i;
	}

	return result;
}

export function gcd(a: number, b: number): number {
	a = Math.abs(a);
	b = Math.abs(b);

	while(b !== 0){
		const r = a % b;
		a = b;
		b = r;
	}

	return a;
}

export function lcm(a: number, b: number): number {
	return Math.abs(a * b) / gcd(a, b);
}

export function isPrime(n: number): boolean {
	if(n <= 1){ return false; }
	if(n <= 3){ return true; }
	if(n % 2 === 0 || n % 3 === 0){ return false; }

	const limit = Math.sqrt(n);
	for(let i = 5; i <= limit; i += 6){
		if(n % i === 0 || n % (i + 2) === 0){ return false; }
	}

	return true;
}