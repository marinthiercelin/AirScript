"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const Expression_1 = require("../Expression");
// CLASS DEFINITION
// ================================================================================================
class CreateVector extends Expression_1.Expression {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    constructor(elements) {
        let degree = [];
        for (let element of elements) {
            if (element.isScalar) {
                degree.push(element.degree);
            }
            else if (element.isList) {
                degree = degree.concat(element.degree);
            }
            else {
                throw new Error('vector elements must be scalars');
            }
        }
        super([degree.length, 0], degree);
        this.elements = elements;
    }
    // PUBLIC MEMBERS
    // --------------------------------------------------------------------------------------------
    toJsCode(assignTo, options = {}) {
        let code = `[${this.elements.map(e => e.toJsCode()).join(', ')}]`;
        if (!options.vectorAsArray) {
            code = `f.newVectorFrom(${code})`;
        }
        if (assignTo) {
            code = `${assignTo} = ${code};\n`;
        }
        return code;
    }
}
exports.CreateVector = CreateVector;
//# sourceMappingURL=CreateVector.js.map