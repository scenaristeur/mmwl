/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";

export class Instrument {
    constructor(key, gate, freq, attack = 0.01, decay = 0.1, sustain = 0.5, release = 0.5, position = 0) {
        this.key = key;
        this.gate = gate;
        this.freq = freq;
        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;
        this.position = position;
    }

    updateParams(params) {
        console.log("voice", params)
        if (params.attack !== undefined) this.attack = params.attack;
        if (params.decay !== undefined) this.decay = params.decay;
        if (params.sustain !== undefined) this.sustain = params.sustain;
        if (params.release !== undefined) this.release = params.release;
    }

    generate() {
        throw new Error("This method should be overridden by subclasses");
    }
}
