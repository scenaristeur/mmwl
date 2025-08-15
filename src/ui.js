export class UI {
  constructor(synth) {
    this.synth = synth;
    this.selectedTrack = 'track1'; // Default selected track
    this.initUI();
  }

  initUI() {
    document.addEventListener('DOMContentLoaded', () => {
      const mainDiv = document.getElementById('main');

      // Controls
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
          console.log(event.target.value);
          controlValue.textContent = event.target.value;
          // Update the corresponding ADSR parameter in Synth
          this.synth.updateParams({ [id]: parseFloat(event.target.value) });
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

      // Append elements to main
      mainDiv.appendChild(controlsDiv);
      mainDiv.appendChild(adsrControlsDiv);

      // Event listeners for play and stop buttons
      playButton.addEventListener('click', () => {
        const midiNote = 60; // Example MIDI note number for C4
        this.synth.playNote(midiNote, this.selectedTrack);
        this.addNoteIndicator(this.selectedTrack, Math.random() * 100);
      });

      stopButton.addEventListener('click', () => {
        const midiNote = 60; // Example MIDI note number for C4
        this.synth.stopNote(midiNote, this.selectedTrack);
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
    document.querySelector("#layout").style.display = "grid";

    // Timeline with 4 tracks
    const timelineDiv = document.getElementById('timeline');

    const track1 = document.createElement('div');
    track1.id = 'track1';
    track1.className = 'track';

    const track2 = document.createElement('div');
    track2.id = 'track2';
    track2.className = 'track';

    const track3 = document.createElement('div');
    track3.id = 'track3';
    track3.className = 'track';

    const track4 = document.createElement('div');
    track4.id = 'track4';
    track4.className = 'track';

    timelineDiv.appendChild(track1);
    timelineDiv.appendChild(track2);
    timelineDiv.appendChild(track3);
    timelineDiv.appendChild(track4);

    // Select the default track
    this.selectTrack('track1');

    // Track selection
    document.querySelectorAll('.track').forEach(track => {
      track.addEventListener('click', () => {
        console.log(track);
        this.selectTrack(track.id);
      });
    });

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case '1':
          this.selectTrack('track1');
          break;
        case '2':
          this.selectTrack('track2');
          break;
        case '3':
          this.selectTrack('track3');
          break;
        case '4':
          this.selectTrack('track4');
          break;
      }
    });
  }

  addNoteIndicator(trackId, position) {
    const track = document.querySelector(`#${trackId}`);
    const noteIndicator = document.createElement('div');
    noteIndicator.className = 'note-indicator';
    noteIndicator.style.left = `${position}%`;

    track.appendChild(noteIndicator);

    // Remove the note indicator after a short delay
    setTimeout(() => {
      track.removeChild(noteIndicator);
    }, 5000); // 5 seconds
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

  selectTrack(trackId) {
    // Deselect all tracks
    document.querySelectorAll('.track').forEach(track => {
      track.classList.remove('selected');
    });

    // Select the clicked track
    const selectedTrack = document.querySelector(`#${trackId}`);
    selectedTrack.classList.add('selected');

    // Update the selected track
    this.selectedTrack = trackId;
  }
}
