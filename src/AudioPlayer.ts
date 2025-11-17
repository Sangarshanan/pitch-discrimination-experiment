export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private loadedFiles: Set<string> = new Set();

  async initialize() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('AudioContext created, state:', this.audioContext.state);
    await this.preloadAudioFiles();
    console.log('Audio files preloaded. Loaded count:', this.getLoadedCount());
  }

  private async preloadAudioFiles() {
    const frequencies = Array.from({ length: 10 }, (_, i) => 128 + i);
    const types = ['voice', 'piano'];

    for (const type of types) {
      for (const freq of frequencies) {
        try {
          await this.loadAudioFile(type as 'voice' | 'piano', freq);
        } catch (error) {
          console.warn(`Failed to load ${type}/${freq}.wav:`, error);
        }
      }
    }
  }

  private async loadAudioFile(type: 'voice' | 'piano', frequency: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    const key = `${type}-${frequency}`;
    if (this.loadedFiles.has(key)) {
      return;
    }

    try {
      const response = await fetch(`/media/${type}/${frequency}.wav`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.audioBuffers.set(key, audioBuffer);
      this.loadedFiles.add(key);
    } catch (error) {
      console.error(`Error loading audio file ${type}/${frequency}.wav:`, error);
      throw error;
    }
  }

  async playSound(type: 'voice' | 'piano', frequency: number): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    // Resume AudioContext if suspended (required by browsers after user interaction)
    if (this.audioContext.state === 'suspended') {
      console.log('Resuming AudioContext...');
      await this.audioContext.resume();
    }

    const key = `${type}-${frequency}`;
    const buffer = this.audioBuffers.get(key);

    if (!buffer) {
      throw new Error(`Audio file not loaded: ${key}`);
    }

    console.log(`Playing sound: ${key}, duration: ${buffer.duration.toFixed(2)}s`);

    return new Promise((resolve) => {
      const source = this.audioContext!.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext!.destination);

      source.onended = () => {
        console.log(`Finished playing: ${key}`);
        resolve();
      };
      source.start(0);
    });
  }

  async playSequence(
    type: 'voice' | 'piano',
    frequencies: number[],
    gapMs: number = 1000
  ): Promise<void> {
    console.log(`Starting sequence: ${type}, frequencies: [${frequencies.join(', ')}]`);

    for (let i = 0; i < frequencies.length; i++) {
      console.log(`Playing sound ${i + 1} of ${frequencies.length}: ${frequencies[i]}Hz`);
      await this.playSound(type, frequencies[i]);

      if (i < frequencies.length - 1) {
        console.log(`Waiting ${gapMs}ms before next sound...`);
        await this.delay(gapMs);
      }
    }

    console.log('Sequence complete!');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isLoaded(type: 'voice' | 'piano', frequency: number): boolean {
    return this.loadedFiles.has(`${type}-${frequency}`);
  }

  getLoadedCount(): number {
    return this.loadedFiles.size;
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioBuffers.clear();
    this.loadedFiles.clear();
  }
}