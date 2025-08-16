import { el } from "@elemaudio/core";
import { PianoVoice, GuitarVoice, BassVoice, PercussionVoice } from "../audio/index.js";

export class InstrumentPanel {
    constructor(trackId, container, uiInstance) {
        this.trackId = trackId;
        this.container = container;
        this.uiInstance = uiInstance; // Ajout de uiInstance
        this.instrumentSelect = document.createElement('select');
        this.instrumentSelect.id = `instrument-select-${trackId}`;
        this.instrumentSelect.style.margin = '5px';

        this.instruments = {
            piano: new PianoVoice(`track-${trackId}`, 0, 440),
            guitar: new GuitarVoice(`track-${trackId}`, 0, 440),
            bass: new BassVoice(`track-${trackId}`, 0, 440),
            percussion: new PercussionVoice(`track-${trackId}`, 0, 440)
        };

        Object.keys(this.instruments).forEach(instrument => {
            const option = document.createElement('option');
            option.value = instrument;
            option.textContent = instrument.charAt(0).toUpperCase() + instrument.slice(1);
            this.instrumentSelect.appendChild(option);
        });

        this.instrumentSelect.addEventListener('change', this.handleInstrumentChange.bind(this));

        this.container.appendChild(this.instrumentSelect);
    }

    handleInstrumentChange(event) {
        const selectedInstrument = event.target.value;
        console.log(`Track ${this.trackId} instrument changed to ${selectedInstrument}`);
        this.uiInstance.synth.setVoice(this.trackId, this.instruments[selectedInstrument]); // Utilisation de this.uiInstance
    }
}
