export class LinkedNode<T, Links extends number> {
	data: T;
	private links: Array<LinkedNode<T, Links> | null>;

	constructor(data: T, links: number){
		this.data = data;
		this.links = new Array(links).fill(null);
	}

	get<LN extends LinkedNode<T, Links>>(link: Links): LN {
		const node = this.links[link];
		if(node === null){ throw new Error(`Link ${link} is not set`); }
		return node as LN;
	}

	tryget<LN extends LinkedNode<T, Links>>(link: Links): LN | null {
		return this.links[link] as LN | null;
	}

	has(link: Links): boolean {
		return this.links[link] !== null;
	}

	link(other: LinkedNode<T, Links> | null, link: Links): void {
		this.links[link] = other;
	}

	unlink(link: Links): void {
		this.links[link] = null;
	}

	chain(other: LinkedNode<T, Links>, link: Links): void {
		other.links[link] = this.links[link];
		this.links[link] = other;
	}

	clear(): void {
		this.links.fill(null);
	}
}