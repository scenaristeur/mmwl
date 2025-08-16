/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";
import { Instrument } from './instrument.js';

export class PercussionVoice extends Instrument {
    constructor(key, gate, freq, attack = 0.01, decay = 0.1, sustain = 0.5, release = 0.5, position = 0) {
        super(key, gate, freq, attack, decay, sustain, release, position);
    }

    updateParams(params) {
        console.log("voice", params)
        if (params.attack !== undefined) this.attack = params.attack;
        if (params.decay !== undefined) this.decay = params.decay;
        if (params.sustain !== undefined) this.sustain = params.sustain;
        if (params.release !== undefined) this.release = params.release;
    }

    generate() {
        console.log("Voice:", this);
        console.log("Gate:", this.gate);
        console.log("Freq:", this.freq);
        console.log("Key:", this.key);

        const gateNode = el.const({ key: `${this.key}:gate`, value: this.gate });
        const freqNode = el.const({ key: `${this.key}:freq`, value: this.freq });
        const positionNode = el.const({ key: `${this.key}:position`, value: this.position });

        // ADSR envelope
        const env = el.adsr(
            this.attack,
            this.decay,
            this.sustain,
            this.release,
            gateNode,
        );
        console.log("ADSR Env Attack:", this.attack);
        console.log("ADSR Env Decay:", this.decay);
        console.log("ADSR Env Sustain:", this.sustain);
        console.log("ADSR Env Release:", this.release);
        console.log("ADSR Env Gate:", gateNode);

        // Percussion waveform approximation
        const waveform = el.impulse(freqNode);

        // Modulate frequency based on position
        const modulatedFreqNode = el.add(freqNode, el.mul(0.1, positionNode));
        console.log("Waveform:", waveform);

        // Use positionNode to adjust the waveform or any other aspect if needed
        // For now, we'll just return the waveform multiplied by the gate and envelope
        return el.mul(gateNode, el.mul(env, waveform));
    }
}
