// IMPORTS
// ================================================================================================
import { Expression, ConstantValue, LoadOperation, NoopExpression, StoreOperation } from "./expressions";
import { FieldDeclaration, StaticRegister, InputRegister, LocalVariable } from "./declarations";

// INTERFACES
// ================================================================================================
export interface TransitionSignature {
    width       : number;
    span        : number;
    locals      : LocalVariable[];
}

// CLASS DEFINITION
// ================================================================================================
export class ModuleInfo {

    readonly field                  : FieldDeclaration;

    readonly constants              : ConstantValue[];
    readonly staticRegisters        : StaticRegister[];
    readonly inputRegisters         : InputRegister[];

    private readonly tFunctionSig   : TransitionSignature;
    private tFunctionBody?          : Expression;

    private readonly tConstraintsSig: TransitionSignature;
    private tConstraintsBody?       : Expression;

    private tRegistersExpression    : Expression;
    private sRegistersExpression    : Expression;
    private iRegistersExpression    : Expression;

    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(
        field: FieldDeclaration,
        constants: ConstantValue[], sRegisters: StaticRegister[], iRegisters: InputRegister[],
        tFunctionSig: TransitionSignature, tConstraintsSig: TransitionSignature
    ) {
        this.field = field;
        this.constants = constants;
        this.staticRegisters = sRegisters;
        this.inputRegisters = iRegisters;
        this.tFunctionSig = tFunctionSig;
        this.tConstraintsSig = tConstraintsSig;

        const tRegistersDegree = new Array(this.stateWidth).fill(1n);
        this.tRegistersExpression = new NoopExpression([this.stateWidth, 0], tRegistersDegree);
        const sRegistersDegree = new Array(this.staticRegisters.length).fill(1n);
        this.sRegistersExpression = new NoopExpression([this.staticRegisters.length, 0], sRegistersDegree);
        const iRegistersDegree = new Array(this.inputRegisters.length).fill(1n);
        this.iRegistersExpression = new NoopExpression([this.inputRegisters.length, 0], iRegistersDegree);
    }

    // ACCESSORS
    // --------------------------------------------------------------------------------------------
    get stateWidth(): number {
        return this.tFunctionSig.width;
    }

    get constraintCount(): number {
        return this.tConstraintsSig.width;
    }

    get inTransitionFunction(): boolean {
        return (this.tFunctionBody === undefined);
    }

    get transitionFunctionBody(): Expression {
        if (!this.tFunctionBody) throw new Error(`transition function body hasn't been set`);
        return this.tFunctionBody;
    }

    set transitionFunctionBody(value: Expression) {
        if (this.tFunctionBody)
            throw new Error(`transition function body has already been set`);
        else if (!value.isVector)
            throw new Error(`transition function must evaluate to a vector`);
        else if (value.dimensions[0] !== this.stateWidth)
            throw new Error(`transition function must evaluate to a vector of ${this.stateWidth} elements`);

        this.tFunctionBody = value;
    }

    get transitionConstraintsBody(): Expression {
        if (!this.tConstraintsBody) throw new Error(`transition constraints body hasn't been set`);
        return this.tConstraintsBody;
    }

    set transitionConstraintsBody(value: Expression) {
        if (this.tConstraintsBody)
            throw new Error(`transition constraints body has already been set`);
        else if (!value.isVector)
            throw new Error(`transition constraints must evaluate to a vector`);
        else if (value.dimensions[0] !== this.constraintCount)
            throw new Error(`transition constraints must evaluate to a vector of ${this.constraintCount} elements`);

        this.tConstraintsBody = value;
    }

    // PUBLIC METHODS
    // --------------------------------------------------------------------------------------------
    buildLoadOperation(operation: string, index: number): LoadOperation {
        if (operation === 'load.const') {
            if (index <= this.constants.length)
                throw new Error(`constant with index ${index} has not been defined`);
            return new LoadOperation(operation, index, this.constants[index]);
        }
        else if (operation === 'load.trace') {
            this.validateFrameIndex(index);
            return new LoadOperation(operation, index, this.tRegistersExpression);
        }
        else if (operation === 'load.fixed') {
            this.validateFrameIndex(index);
            if (this.staticRegisters.length === 0) 
                throw new Error('static registers have not been defined');
            return new LoadOperation(operation, index, this.sRegistersExpression);
        }
        else if (operation === 'load.input') {
            this.validateFrameIndex(index);
            if (this.staticRegisters.length === 0) 
                throw new Error('input registers have not been defined');
            return new LoadOperation(operation, index, this.iRegistersExpression);
        }
        else if (operation === 'load.local') {
            const variable = this.getLocalVariable(index);
            const value = variable.getValue(index);
            return new LoadOperation(operation, index, value);
        }
        else {
            throw new Error(`load operation '${operation}' is not valid`)
        }
    }

    buildStoreOperation(operation: string, index: number, value: Expression): StoreOperation {
        if (operation === 'save.local') {
            const variable = this.getLocalVariable(index);
            variable.setValue(value, index);
            return new StoreOperation(operation, index, value);
        }
        else {
            throw new Error(`store operation '${operation}' is not valid`)
        }
    }

    // OUTPUT METHOD
    // --------------------------------------------------------------------------------------------
    toString() {
        
        let code = `\n  ${this.field.toString()}`;

        if (this.constants.length > 0) {
            code += '\n  ' + this.constants.map(c => `(const ${c.toString()})`).join(' ');
        }

        if (this.staticRegisters.length > 0) {
            code += '\n  ' + this.staticRegisters.map(r => r.toString()).join(' ');
        }

        if (this.inputRegisters.length > 0) {
            code += '\n  ' + this.inputRegisters.map(r => r.toString()).join(' ');
        }
        
        // transition function
        let tFunction = `\n    (frame ${this.tFunctionSig.width} ${this.tFunctionSig.span})`;
        if (this.tFunctionSig.locals.length > 0) {
            tFunction += '\n    ' + this.tFunctionSig.locals.map(v => v.toString()).join(' ');
        }
        tFunction += `\n    ${this.tFunctionBody!.toString()}`;
        code += `\n  (transition${tFunction})`;

        // transition constraints
        let tConstraints = `\n    (frame ${this.tConstraintsSig.width} ${this.tConstraintsSig.span})`;
        if (this.tConstraintsSig.locals.length > 0) {
            tConstraints += `\n    ` + this.tConstraintsSig.locals.map(v => v.toString()).join(' ');
        }
        tConstraints += `\n    ${this.tConstraintsBody!.toString()}`;
        code += `\n  (evaluation${tConstraints})`;

        return `(module${code}\n)`;
    }

    // PRIVATE METHODS
    // --------------------------------------------------------------------------------------------
    getLocalVariable(index: number): LocalVariable {
        const locals = (this.inTransitionFunction)
            ? this.tFunctionSig.locals
            : this.tConstraintsSig.locals;

        if (index >= locals.length)
            throw new Error(`local variable ${index} has not defined`);
        
        return locals[index];
    }

    validateFrameIndex(index: number) {
        if (this.inTransitionFunction) {
            if (index > 0)
                throw new Error('cannot access future register states from transition function');
        }
        else {
            if (index > 1)
                throw new Error('cannot access register states beyond the next step from transition constraints');
        }
    }
}