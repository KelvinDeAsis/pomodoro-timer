class AudioEngine {
  context = null;
  jazz = null;
  brown = null;
  alertNodes = new Set();
  alertTimer = null;
  alertEnd = null;
  enabled = { jazz: false, brown: false };
  volumes = { jazz: 35, brown: 25, alert: 50 };
  ducked = false;

  async unlock() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new Error('This browser does not support audio.');
    if (!this.context) this.context = new Context();
    await this.context.resume();
    if (this.context.state !== 'running') throw new Error('Audio is blocked. Tap an audio control to enable it.');
  }

  jazzBus() {
    if (this.jazz) return this.jazz;
    const media = new Audio(`${import.meta.env.BASE_URL}audio/late-night-radio.mp3`);
    media.loop = true;
    const source = this.context.createMediaElementSource(media);
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 4800;
    const gain = this.context.createGain();
    source.connect(filter).connect(gain).connect(this.context.destination);
    this.jazz = { media, gain };
    return this.jazz;
  }

  brownBus() {
    if (this.brown) return this.brown;
    const length = this.context.sampleRate * 12;
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const values = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < length; i++) { previous = (previous + Math.random() * 0.04 - 0.02) / 1.02; values[i] = previous * 3.5; }
    // Blend the loop boundary so replay never introduces a sharp click.
    const fade = Math.floor(this.context.sampleRate * .04);
    for (let i = 0; i < fade; i++) { const mix = i / fade; const end = values[length - fade + i]; values[i] = end * (1 - mix) + values[i] * mix; }
    const source = this.context.createBufferSource(); source.buffer = buffer; source.loop = true;
    const gain = this.context.createGain(); gain.gain.value = 0;
    const filter = this.context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 700;
    source.connect(filter).connect(gain).connect(this.context.destination); source.start();
    this.brown = { source, gain };
    return this.brown;
  }

  setVolumes(settings) {
    this.volumes = { jazz: settings.jazzVolume, brown: settings.brownVolume, alert: settings.alertVolume };
    this.mix();
  }
  mix() {
    if (!this.context) return;
    for (const key of ['jazz', 'brown']) if (this[key]) this[key].gain.gain.setTargetAtTime(this.enabled[key] ? this.volumes[key] / 100 * (this.ducked ? .2 : 1) : 0, this.context.currentTime, .08);
  }
  async toggle(key) {
    await this.unlock();
    const enable = !this.enabled[key];
    if (key === 'jazz') { const bus = this.jazzBus(); if (enable) await bus.media.play(); else bus.media.pause(); }
    else this.brownBus();
    this.enabled[key] = enable; this.mix();
    return { ...this.enabled };
  }
  chime(until) {
    if (!this.context || this.context.state !== 'running' || Date.now() >= until) return;
    const secondsLeft = (until - Date.now()) / 1000;
    for (const [i, frequency] of [523.25, 659.25, 783.99].entries()) {
      const offset = i * .18;
      if (offset >= secondsLeft) break;
      const node = this.context.createOscillator(); const gain = this.context.createGain();
      node.type = 'sine'; node.frequency.value = frequency;
      const start = this.context.currentTime + offset;
      const duration = Math.min(.7, secondsLeft - offset);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(this.volumes.alert / 100 * .18, start + Math.min(.025, duration / 2));
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      node.connect(gain).connect(this.context.destination);
      this.alertNodes.add(node);
      node.onended = () => { this.alertNodes.delete(node); node.disconnect(); gain.disconnect(); };
      node.start(start); node.stop(start + duration);
    }
  }
  startAlert(until) {
    this.stopAlert();
    if (!this.context || Date.now() >= until) return;
    this.ducked = true; this.mix(); this.chime(until);
    this.alertTimer = setInterval(() => this.chime(until), 3000);
    this.alertEnd = setTimeout(() => this.stopAlert(), Math.max(0, until - Date.now()));
  }
  stopAlert() {
    clearInterval(this.alertTimer); clearTimeout(this.alertEnd);
    this.alertTimer = null; this.alertEnd = null;
    for (const node of this.alertNodes) { try { node.stop(); } catch { /* Already stopped. */ } }
    this.alertNodes.clear(); this.ducked = false; this.mix();
  }
  destroy() {
    this.stopAlert(); this.jazz?.media.pause();
    this.brown?.source.stop(); this.context?.close();
  }
}
export default AudioEngine;
