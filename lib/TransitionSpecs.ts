// IMPORTS
// ================================================================================================
import { FiniteField } from "@guildofweavers/galois";
import { isPowerOf2 } from "./utils";

// INTERFACES
// ================================================================================================
type Interval = [number, number];

interface Segment {
    readonly mask   : bigint[];
    readonly body   : any;
}

interface Loop {
    readonly inputs : string[];
    readonly init   : any;
}

interface Input {
    readonly scope  : string;
    readonly binary : boolean;
    readonly rank   : number;
}

interface InputRegister {
    readonly scope  : string;
    readonly binary : boolean;
    readonly parent?: number;
    readonly steps? : number;
}

// CLASS DEFINITION
// ================================================================================================
export class TransitionSpecs {
    
    readonly loops              : Loop[];
    readonly inputs             : Map<string, Input | undefined>;
    readonly segments           : Segment[];

    private _stepsToIntervals   : Map<number, Interval>;
    private _cycleLength        : number;

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor() {
        this.loops = [];
        this.inputs = new Map();
        this.segments = [];
        this._stepsToIntervals = new Map();
        this._cycleLength = 0;
    }

    // ACCESSORS
    // --------------------------------------------------------------------------------------------
    get inputs2(): InputRegister[] {
        const result: InputRegister[] = [];
        for (let input of this.inputs.values()) {
            let parent = this.getParentOf(input!.rank);
            let steps = input!.rank === this.loops.length - 1 ? this.cycleLength : undefined;
            result.push({ scope: input!.scope, binary: input!.binary, parent, steps });
        }
        return result;
    }

    get cycleLength(): number {
        return this._cycleLength;
    }

    // PUBLIC METHODS
    // --------------------------------------------------------------------------------------------
    addLoop(inputs: string[], init: any): void {
        this.loops.push({ inputs, init });
        for (let register of inputs) {
            // TODO: validate register
            this.inputs.set(register, undefined);
        }
    }

    addInput(register: string, scope: string, binary: boolean): void {
        let input = this.inputs.get(register);
        if (!input) {
            let rank = this.getInputRank(register) || 0; // TODO?
            input = { scope, binary, rank };
            this.inputs.set(register, input);
        }
        else {
            throw new Error(`input register ${register} is defined more than once`);
        }

        /* TODO
        const index = Number(register.slice(2));
        if (index !== this.inputs.size) {
            throw new Error(`input register ${register} is defined out of order`);
        }
        */
    }

    addSegment(intervals: Interval[], body: any): void {

        for (let interval of intervals) {
            let start = interval[0], end = interval[1];

            // make sure the interval is valid
            if (start < 1) {
                throw new Error(`invalid step interval [${start}..${end}]: start index must be greater than 0`);
            }
            else if (start > end) {
                throw new Error(`invalid step interval [${start}..${end}]: start index must be smaller than end index`);
            }
    
            // make sure the interval does not conflict with previously added intervals
            for (let i = start; i <= end; i++) {
                if (this._stepsToIntervals.has(i)) {
                    const [s2, e2] = this._stepsToIntervals.get(i)!;
                    throw new Error(`step interval [${start}..${end}] overlaps with interval [${s2}..${e2}]`);
                }
                this._stepsToIntervals.set(i, interval);
            }

            // update cycle length
            if (end >= this._cycleLength) {
                this._cycleLength = end + 1;
            }
        }

        // make mask in all other segments have the same length
        for (let segment of this.segments) {
            const diff = this._cycleLength - segment.mask.length;
            if (diff > 0) {
                let filling = new Array<bigint>(diff).fill(0n);
                segment.mask.push(...filling);
            }
        }

        // build the mask
        const mask = new Array<bigint>(this._cycleLength).fill(0n);
        for (let [start, end] of intervals) {
            for (let i = start; i <= end; i++) {
                mask[i] = 1n;
            }
        }

        // build and add the new segment to the list
        this.segments.push({ mask, body });
    }

    validate() {
        // make sure masks cover all steps
        if (this._stepsToIntervals.size < this._cycleLength) {
            for (let i = 1; i < this._cycleLength; i++) {
                if (!this._stepsToIntervals.has(i)) {
                    throw new Error(`step ${i} is not covered by any expression`);
                }
            }
        }

        // cycle length must be a power of 2
        if (!isPowerOf2(this._cycleLength)) {
            throw new Error('total number of steps must be a power of 2');
        }

        // make sure definitions for all inputs were provided
        for (let [register, input] of this.inputs) {
            if (!input) {
                throw new Error(`input register ${register} is used without being declared`);
            }
        }
    }

    getParentOf(rank: number): number | undefined {
        if (rank === 0) return undefined;
        const parent = this.loops[rank - 1].inputs[0];
        let index = 0;
        for (let input of this.inputs.keys()) {
            if (input === parent) {
                return index;
            }
            index++;
        }
    }

    // PRIVATE METHODS
    // --------------------------------------------------------------------------------------------
    private getInputRank(register: string): number | undefined {
        for (let i = 0; i < this.loops.length; i++) {
            if (this.loops[i].inputs.includes(register)) {
                return i;
            }
        }
    }
}