const context = new AudioContext();

const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

const volume = context.createGain();
volume.gain.value = 0.5;

const out = context.destination;

osc.connect(volume);
volume.connect(out);

const osc2 = context.createOscillator();
osc2.frequency.value = 800;
osc2.type = 'sine';
osc2.start();

const volume2 = context.createGain();
volume2.gain.value = 0.5;

osc2.connect(volume2);
volume2.connect(out);
