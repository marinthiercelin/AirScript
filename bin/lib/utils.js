"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CONSTANTS
// ================================================================================================
exports.BLOCK_ID_PREFIX = '$_b';
var ProcedureParams;
(function (ProcedureParams) {
    ProcedureParams["thisTraceRow"] = "$_r";
    ProcedureParams["nextTraceRow"] = "$_n";
    ProcedureParams["staticRow"] = "$_k";
})(ProcedureParams = exports.ProcedureParams || (exports.ProcedureParams = {}));
const MAX_SYMBOL_LENGTH = 128;
const SYMBOL_REGEXP = /[a-zA-Z]\w*/g;
// MATH
// ================================================================================================
function isPowerOf2(value) {
    if (typeof value === 'bigint') {
        return (value !== 0n) && (value & (value - 1n)) === 0n;
    }
    else {
        return (value !== 0) && (value & (value - 1)) === 0;
    }
}
exports.isPowerOf2 = isPowerOf2;
// VALIDATORS
// ================================================================================================
function validate(condition, errorMessage) {
    if (!condition)
        throw new Error(errorMessage);
}
exports.validate = validate;
function validateSymbolName(name) {
    validate(name.length <= MAX_SYMBOL_LENGTH, `symbol '${name}' is invalid: symbol length cannot exceed ${MAX_SYMBOL_LENGTH} characters`);
    const matches = name.match(SYMBOL_REGEXP);
    validate(matches !== null && matches.length === 1, `symbol '${name}' is invalid`);
}
exports.validateSymbolName = validateSymbolName;
//# sourceMappingURL=utils.js.map