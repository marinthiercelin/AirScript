"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
// ================================================================================================
const chevrotain_1 = require("chevrotain");
const errors_1 = require("./errors");
// LITERALS, REGISTERS, and IDENTIFIERS
// ================================================================================================
exports.HexLiteral = chevrotain_1.createToken({ name: "HexLiteral", pattern: /0x[0-9a-f]+/ });
exports.IntegerLiteral = chevrotain_1.createToken({ name: "IntegerLiteral", pattern: /0|[1-9]\d*/ });
exports.StringLiteral = chevrotain_1.createToken({ name: "StringLiteral", pattern: /'([^'\\]|\\.)*'/ });
exports.Identifier = chevrotain_1.createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });
exports.TraceRegister = chevrotain_1.createToken({ name: "TraceRegister", pattern: /\$[rn]\d{1,2}/ });
exports.RegisterBank = chevrotain_1.createToken({ name: "RegisterBank", pattern: /\$[rn]/ });
// KEYWORDS
// ================================================================================================
exports.Define = chevrotain_1.createToken({ name: "Define", pattern: /define/, longer_alt: exports.Identifier });
exports.Over = chevrotain_1.createToken({ name: "Over", pattern: /over/, longer_alt: exports.Identifier });
exports.Prime = chevrotain_1.createToken({ name: "Prime", pattern: /prime/, longer_alt: exports.Identifier });
exports.Field = chevrotain_1.createToken({ name: "Field", pattern: /field/, longer_alt: exports.Identifier });
exports.ResultExp = chevrotain_1.createToken({ name: "ResultExp", pattern: chevrotain_1.Lexer.NA });
exports.Yield = chevrotain_1.createToken({ name: "Yield", pattern: /yield/, longer_alt: exports.Identifier, categories: exports.ResultExp });
exports.Enforce = chevrotain_1.createToken({ name: "Enforce", pattern: /enforce/, longer_alt: exports.Identifier, categories: exports.ResultExp });
exports.Const = chevrotain_1.createToken({ name: "Const", pattern: /const/, longer_alt: exports.Identifier });
exports.Static = chevrotain_1.createToken({ name: "Static", pattern: /static/, longer_alt: exports.Identifier });
exports.Cycle = chevrotain_1.createToken({ name: "Cycle", pattern: /cycle/, longer_alt: exports.Identifier });
exports.Input = chevrotain_1.createToken({ name: "Input", pattern: /input/, longer_alt: exports.Identifier });
exports.Public = chevrotain_1.createToken({ name: "Public", pattern: /public/, longer_alt: exports.Identifier });
exports.Secret = chevrotain_1.createToken({ name: "Secret", pattern: /secret/, longer_alt: exports.Identifier });
exports.Element = chevrotain_1.createToken({ name: "Element", pattern: /element/, longer_alt: exports.Identifier });
exports.Boolean = chevrotain_1.createToken({ name: "Boolean", pattern: /boolean/, longer_alt: exports.Identifier });
exports.Transition = chevrotain_1.createToken({ name: "Transition", pattern: /transition/, longer_alt: exports.Identifier });
exports.Registers = chevrotain_1.createToken({ name: "Registers", pattern: /registers?/, longer_alt: exports.Identifier });
exports.Constraints = chevrotain_1.createToken({ name: "Constraints", pattern: /constraints?/, longer_alt: exports.Identifier });
exports.For = chevrotain_1.createToken({ name: "For", pattern: /for/, longer_alt: exports.Identifier });
exports.Each = chevrotain_1.createToken({ name: "Each", pattern: /each/, longer_alt: exports.Identifier });
exports.Init = chevrotain_1.createToken({ name: "Init", pattern: /init/, longer_alt: exports.Identifier });
exports.Steps = chevrotain_1.createToken({ name: "Steps", pattern: /steps?/, longer_alt: exports.Identifier });
exports.Do = chevrotain_1.createToken({ name: "Do", pattern: /do/, longer_alt: exports.Identifier });
exports.With = chevrotain_1.createToken({ name: "With", pattern: /with/, longer_alt: exports.Identifier });
exports.Nothing = chevrotain_1.createToken({ name: "Nothing", pattern: /nothing/, longer_alt: exports.Identifier });
exports.When = chevrotain_1.createToken({ name: "When", pattern: /when/, longer_alt: exports.Identifier });
exports.Else = chevrotain_1.createToken({ name: "Else", pattern: /else/, longer_alt: exports.Identifier });
exports.All = chevrotain_1.createToken({ name: "All", pattern: /all/, longer_alt: exports.Identifier });
exports.Prng = chevrotain_1.createToken({ name: "Prng", pattern: /prng/, longer_alt: exports.Identifier });
exports.Import = chevrotain_1.createToken({ name: "Import", pattern: /import/, longer_alt: exports.Identifier });
exports.From = chevrotain_1.createToken({ name: "From", pattern: /from/, longer_alt: exports.Identifier });
exports.As = chevrotain_1.createToken({ name: "As", pattern: /as/, longer_alt: exports.Identifier });
// OPERATORS
// ================================================================================================
exports.AddOp = chevrotain_1.createToken({ name: "AddOp", pattern: chevrotain_1.Lexer.NA });
exports.Plus = chevrotain_1.createToken({ name: "Plus", pattern: /\+/, categories: exports.AddOp });
exports.Minus = chevrotain_1.createToken({ name: "Minus", pattern: /-/, categories: exports.AddOp });
exports.MulOp = chevrotain_1.createToken({ name: "MulOp", pattern: chevrotain_1.Lexer.NA });
exports.Star = chevrotain_1.createToken({ name: "Star", pattern: /\*/, categories: exports.MulOp });
exports.Slash = chevrotain_1.createToken({ name: "Slash", pattern: /\//, categories: exports.MulOp });
exports.Pound = chevrotain_1.createToken({ name: "Pound", pattern: /#/, categories: exports.MulOp });
exports.ExpOp = chevrotain_1.createToken({ name: "ExpOp", pattern: /\^/ });
exports.Equals = chevrotain_1.createToken({ name: "Equals", pattern: /=/ });
exports.AssignOp = chevrotain_1.createToken({ name: "AssignOp", pattern: /<-/ });
// SYMBOLS
// ================================================================================================
exports.LCurly = chevrotain_1.createToken({ name: "LCurly", pattern: /{/ });
exports.RCurly = chevrotain_1.createToken({ name: "RCurly", pattern: /}/ });
exports.LSquare = chevrotain_1.createToken({ name: "LSquare", pattern: /\[/ });
exports.RSquare = chevrotain_1.createToken({ name: "RSquare", pattern: /]/ });
exports.LParen = chevrotain_1.createToken({ name: "LParen", pattern: /\(/ });
exports.RParen = chevrotain_1.createToken({ name: "RParen", pattern: /\)/ });
exports.LWedge = chevrotain_1.createToken({ name: 'LWedge', pattern: /</ });
exports.RWedge = chevrotain_1.createToken({ name: 'RWedge', pattern: />/ });
exports.Comma = chevrotain_1.createToken({ name: "Comma", pattern: /,/ });
exports.Colon = chevrotain_1.createToken({ name: "Colon", pattern: /:/ });
exports.Semicolon = chevrotain_1.createToken({ name: "Semicolon", pattern: /;/ });
exports.Ellipsis = chevrotain_1.createToken({ name: 'Ellipsis', pattern: /\.\.\./ });
exports.DoubleDot = chevrotain_1.createToken({ name: 'DoubleDot', pattern: /\.\./ });
exports.Tilde = chevrotain_1.createToken({ name: 'Tilde', pattern: /~/ });
exports.Ampersand = chevrotain_1.createToken({ name: 'Ampersand', pattern: /&/ });
exports.QMark = chevrotain_1.createToken({ name: 'QMark', pattern: /\?/ });
exports.EMark = chevrotain_1.createToken({ name: 'EMark', pattern: /!/ });
// WHITESPACE AND COMMENTS
// ================================================================================================
exports.WhiteSpace = chevrotain_1.createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: chevrotain_1.Lexer.SKIPPED
});
exports.Comment = chevrotain_1.createToken({
    name: "Comment",
    pattern: /\/\/.+/,
    group: "comments"
});
// ALL TOKENS
// ================================================================================================
exports.allTokens = [
    exports.WhiteSpace, exports.Comment,
    exports.Define, exports.Over, exports.Prime, exports.Field, exports.Transition, exports.Registers, exports.Steps, exports.Yield, exports.Enforce, exports.Constraints,
    exports.For, exports.Each, exports.Do, exports.With, exports.Nothing, exports.When, exports.Else, exports.Cycle, exports.Const, exports.Input, exports.Public, exports.Secret, exports.Element, exports.Boolean,
    exports.Static, exports.Import, exports.From, exports.As, exports.All, exports.Init, exports.Prng,
    exports.AssignOp, exports.Equals, exports.Plus, exports.Minus, exports.Star, exports.Slash, exports.Pound, exports.ExpOp, exports.MulOp, exports.AddOp,
    exports.LCurly, exports.RCurly, exports.LSquare, exports.RSquare, exports.LParen, exports.RParen, exports.LWedge, exports.RWedge, exports.Comma, exports.Colon, exports.Semicolon,
    exports.Ellipsis, exports.DoubleDot, exports.Tilde, exports.Ampersand, exports.QMark, exports.EMark,
    exports.Identifier,
    exports.TraceRegister, exports.RegisterBank,
    exports.HexLiteral, exports.IntegerLiteral, exports.StringLiteral
];
// EXPORT LEXER INSTANCE
// ================================================================================================
exports.lexer = new chevrotain_1.Lexer(exports.allTokens, { errorMessageProvider: errors_1.lexerErrorMessageProvider });
//# sourceMappingURL=lexer.js.map