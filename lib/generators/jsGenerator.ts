// IMPORTS
// ================================================================================================
import { AirModule, StarkLimits } from "@guildofweavers/air-script";
import { ScriptSpecs } from "../ScriptSpecs";
import * as jsTemplate from '../templates/JsModuleTemplate';

// PUBLIC FUNCTIONS
// ================================================================================================
export function generateJsModule(specs: ScriptSpecs, limits: StarkLimits, extensionFactor: number): AirModule {

    let code = `'use strict';\n\n`;

    // set up module variables
    const maxConstraintDegree = specs.maxTransitionConstraintDegree;
    const compositionFactor = 2**Math.ceil(Math.log2(maxConstraintDegree));

    code += `const stateWidth = ${specs.mutableRegisterCount};\n`;
    code += `const extensionFactor = ${extensionFactor};\n`;
    code += `const compositionFactor = ${compositionFactor};\n`;
    code += `const maxTraceLength = ${limits.maxTraceLength};\n\n`;

    // build transition function and constraints
    code += `function applyTransition(r, k, s, p, c, i) {\n${buildTransitionFunctionBody(specs)}}\n`;
    code += `function evaluateConstraints(r, n, k, s, p, c, i) {\n${buildTransitionConstraintsBody(specs)}}\n\n`;

    // add functions from the template
    for (let prop in jsTemplate) {
        code += `${(jsTemplate as any)[prop].toString()}\n`;
    }
    code += '\n';

    // build return object
    code += 'return {\n';
    code += `name: \`${specs.name}\`,\n`;
    code += `field: f,\n`;
    code += `stateWidth: stateWidth,\n`;
    code += `publicInputCount: ${specs.publicRegisters.length},\n`;
    code += `secretInputCount: ${specs.secretRegisters.length},\n`;
    code += `maxConstraintDegree: ${specs.maxTransitionConstraintDegree},\n`;
    code += `initProof,\n`;
    code += `initVerification\n`;
    code += '};';

    // create and execute module builder function
    const buildModule = new Function('f', 'g', 'registerSpecs', 'loopSpecs', 'constraints', code);
    return buildModule(
        specs.field,
        specs.constantBindings,
        buildRegisterSpecs(specs),
        buildLoopSpecs(specs),
        specs.transitionConstraintsSpecs,
    );
}

// HELPER FUNCTIONS
// ================================================================================================
function buildTransitionFunctionBody(specs: ScriptSpecs): string {
    let code = 'let result;\n';
    code += specs.transitionFunction.toJsCode('result');
    code += specs.transitionFunction.isScalar ? `return [result];\n` : `return result.values;\n`;
    return code;
}

function buildTransitionConstraintsBody(specs: ScriptSpecs): string {
    let code = 'let result;\n';
    code += specs.transitionConstraints.toJsCode('result');
    code += specs.transitionConstraints.isScalar ? `return [result];\n` : `return result.values;\n`;
    return code;
}

function buildLoopSpecs(specs: ScriptSpecs): jsTemplate.LoopSpecs {
    return {
        traceTemplate   : specs.loopController.inputTemplate,
        segmentMasks    : specs.loopController.segmentMasks,
        baseCycleLength : specs.baseCycleLength
    };
}

function buildRegisterSpecs(specs: ScriptSpecs): jsTemplate.RegisterSpecs {
    return {
        k: specs.staticRegisters,
        s: specs.secretRegisters,
        p: specs.publicRegisters
    };
}