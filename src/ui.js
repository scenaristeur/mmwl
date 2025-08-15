export class UI {
  constructor(synth) {
    this.synth = synth;
    this.initUI();
  }

  initUI() {
    document.addEventListener('DOMContentLoaded', () => {
      const controlsDiv = document.createElement('div');
      controlsDiv.id = 'controls';

      const playButton = document.createElement('button');
      playButton.id = 'play';
      playButton.textContent = 'Play';

      const stopButton = document.createElement('button');
      stopButton.id = 'stop';
      stopButton.textContent = 'Stop';

      controlsDiv.appendChild(playButton);
      controlsDiv.appendChild(stopButton);

      // ADSR Controls
      const adsrControlsDiv = document.createElement('div');
      adsrControlsDiv.id = 'adsr-controls';

      const createAdsrControl = (id, label, min, max, step, initialValue) => {
        const controlDiv = document.createElement('div');

        const controlLabel = document.createElement('label');
        controlLabel.textContent = label;
        controlLabel.setAttribute('for', id);

        const controlInput = document.createElement('input');
        controlInput.type = 'range';
        controlInput.id = id;
        controlInput.min = min;
        controlInput.max = max;
        controlInput.step = step;
        controlInput.value = initialValue;

        const controlValue = document.createElement('span');
        controlValue.id = `${id}-value`;
        controlValue.textContent = initialValue;

        controlInput.addEventListener('input', (event) => {
          controlValue.textContent = event.target.value;
          // Update the corresponding ADSR parameter in PianoVoice
          this.synth.voices.forEach(voice => {
            voice.updateParams({ [id]: parseFloat(event.target.value) });
          });
        });

        controlDiv.appendChild(controlLabel);
        controlDiv.appendChild(controlInput);
        controlDiv.appendChild(controlValue);

        return controlDiv;
      };

      adsrControlsDiv.appendChild(createAdsrControl('attack', 'Attack:', 0, 1, 0.01, 0.01));
      adsrControlsDiv.appendChild(createAdsrControl('decay', 'Decay:', 0, 1, 0.01, 0.1));
      adsrControlsDiv.appendChild(createAdsrControl('sustain', 'Sustain:', 0, 1, 0.01, 0.5));
      adsrControlsDiv.appendChild(createAdsrControl('release', 'Release:', 0, 1, 0.01, 0.5));

      document.body.appendChild(controlsDiv);
      document.body.appendChild(adsrControlsDiv);

      // Event listeners for play and stop buttons
      playButton.addEventListener('click', () => {
        const midiNote = 60; // Example MIDI note number for C4
        this.synth.playNote(midiNote);
      });

      stopButton.addEventListener('click', () => {
        const midiNote = 60; // Example MIDI note number for C4
        this.synth.stopNote(midiNote);
      });
    });
  }

  init(handler) {
    const getStartedButton = document.querySelector("#get-started-button");
    getStartedButton.addEventListener("click", () => handler());
    getStartedButton.addEventListener("keypress", () => handler());
  }

  getStarted() {
    document.querySelector("#get-started").remove();
    document.querySelector("#indicators").style.display = "grid";
  }

  setMIDINote(note) {
    document.querySelector("#midi-note").textContent = note.toString();
  }

  setFrequency(freq) {
    document.querySelector("#frequency").textContent = `${freq.toFixed(0).toString()} Hz`;
  }

  setControllers(controllers, selectedController, handler) {
    const controllerButtons = controllers.map((name) => {
      let button = document.createElement("button");
      button.textContent = name;
      button.addEventListener("click", () => handler(name));
      button.addEventListener("keypress", () => handler(name));

      if (selectedController && selectedController === name) {
        button.style.backgroundColor = "#d70d75";
      }

      return button;
    });

    document.querySelector("#controllers").replaceChildren(...controllerButtons);
  }

  selectController(name) {
    let controllerButtons = document.querySelector("#controllers").children;

    Array.from(controllerButtons).map((button) => {
      if (button.textContent === name) {
        button.style.backgroundColor = "#d70d75";
      } else {
        button.style.backgroundColor = "#1a1a1a";
      }
    });
  }
}
