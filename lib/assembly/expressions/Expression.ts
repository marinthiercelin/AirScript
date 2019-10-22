// IMPORTS
// ================================================================================================
import { Dimensions } from "../../utils";

// INTERFACES
// ================================================================================================
export type ExpressionDegree = bigint | bigint[] | bigint[][];

export interface JsCodeOptions {
    vectorAsArray?: boolean;
}

export interface AssemblyOptions {
    vectorAsList?: boolean;
}

// CLASS DEFINITION
// ================================================================================================
export abstract class Expression {

    readonly dimensions : Dimensions;
    readonly degree     : ExpressionDegree;
    readonly children   : Expression[]

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(dimensions: Dimensions, degree: ExpressionDegree, children: Expression[] = []) {
        this.dimensions = dimensions;
        this.degree = degree
        this.children = children;
    }

    // ABSTRACT METHODS
    // --------------------------------------------------------------------------------------------
    abstract toString(options?: AssemblyOptions): string;

    // DIMENSION METHODS AND ACCESSORS
    // --------------------------------------------------------------------------------------------
    get isScalar(): boolean {
        return (this.dimensions[0] === 0 && this.dimensions[1] === 0);
    }

    get isVector(): boolean {
        return (this.dimensions[0] > 0 && this.dimensions[1] === 0);
    }

    get isMatrix(): boolean {
        return (this.dimensions[1] > 0);
    }

    isSameDimensions(e: Expression) {
        return this.dimensions[0] === e.dimensions[0]
            && this.dimensions[1] === e.dimensions[1];
    }
}

// NOOP EXPRESSION
// ================================================================================================
export class NoopExpression extends Expression {

    constructor(dimensions: Dimensions, degree: ExpressionDegree) {
        super(dimensions, degree);
    }

    toString(): string {
        return ``;
    }
}