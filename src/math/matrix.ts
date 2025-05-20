type MatrixArray = Array<Array<number>>;

export class Matrix<R extends number, C extends number> {
	private data: MatrixArray;

	constructor(data: MatrixArray) {
		this.data = data;
	}

	static new<R extends number, C extends number>(data: MatrixArray): Matrix<R, C> {
		return new Matrix(data);
	}

	copy(): Matrix<R, C> {
		const data = new Array(this.data.length);
		for(let i = 0; i < this.data.length; i++) {
			data[i] = [...this.data[i]];
		}
		return new Matrix(data);
	}

	static zero<R extends number, C extends number>(rows: R, cols: C): Matrix<R, C> {
		const data = new Array(rows);
		for(let i = 0; i < rows; i++) {
			data[i] = new Array(cols).fill(0);
		}
		return new Matrix(data);
	}

	get rows(): R { return this.data.length as R; }
	get cols(): C { return this.data[0].length as C; }
	get size(): [R, C] { return [this.rows, this.cols]; }
}