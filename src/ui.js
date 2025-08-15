import { Timeline } from './timeline';
import { Record } from './record';

export class UI {
  constructor(synth, noteEmitter) {
    this.synth = synth;
    this.noteEmitter = noteEmitter;
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

      const recordButton = document.createElement('button');
      recordButton.id = 'record';
      recordButton.textContent = 'Record';

      const stopRecordButton = document.createElement('button');
      stopRecordButton.id = 'stop-record';
      stopRecordButton.textContent = 'Stop Record';

      const playRecordButton = document.createElement('button');
      playRecordButton.id = 'play-record';
      playRecordButton.textContent = 'Play Record';

      controlsDiv.appendChild(playButton);
      controlsDiv.appendChild(stopButton);
      controlsDiv.appendChild(recordButton);
      controlsDiv.appendChild(stopRecordButton);
      controlsDiv.appendChild(playRecordButton);

      // Loop checkbox
      const loopCheckbox = document.createElement('input');
      loopCheckbox.type = 'checkbox';
      loopCheckbox.id = 'loop';
      loopCheckbox.checked = true; // Checked by default

      const loopLabel = document.createElement('label');
      loopLabel.textContent = 'Loop';
      loopLabel.setAttribute('for', 'loop');

      controlsDiv.appendChild(loopCheckbox);
      controlsDiv.appendChild(loopLabel);

      // Event listener for loop checkbox
      loopCheckbox.addEventListener('change', (event) => {
        this.record.loop = event.target.checked;
      });

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

      // Initialize Record
      this.record = new Record(this.noteEmitter);

      // Event listeners for record, stop record, and play record buttons
      recordButton.addEventListener('click', () => {
        this.record.startRecording(this.selectedTrack);
        recordButton.classList.add('active');
      });

      stopRecordButton.addEventListener('click', () => {
        if (this.record.recording) {
          this.record.stopRecording();
          recordButton.classList.remove('active');
        } else {
          this.record.stopPlaying();
          playRecordButton.classList.remove('active');
        }
      });

      playRecordButton.addEventListener('click', () => {
        this.record.playRecording(this.selectedTrack);
        playRecordButton.classList.add('active');
      });

      this.noteEmitter.on("stopAll", () => {
        playRecordButton.classList.remove('active');
      });

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

    // Initialize Timeline
    new Timeline(this);

    // Select the default track
    this.selectTrack('track1');
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
