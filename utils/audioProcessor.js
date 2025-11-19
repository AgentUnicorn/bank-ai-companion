// utils/audioProcessor.js

/**
 * An AudioWorkletProcessor that converts float32 audio data to 16-bit PCM,
 * calculates its volume, and posts both back to the main thread.
 * This runs in a separate thread from the main UI thread to prevent audio glitches.
 */
class AudioProcessor extends AudioWorkletProcessor {
  /**
   * @param {Float32Array[][]} inputs
   * @param {Float32Array[][]} outputs
   * @param {Record<string, Float32Array>} parameters
   * @returns {boolean}
   */
  process(inputs, outputs, parameters) {
    // We expect one input, with one channel.
    const input = inputs[0];
    const inputChannel = input[0];

    // inputChannel can be undefined if no audio is currently being received.
    if (!inputChannel) {
      return true;
    }

    const l = inputChannel.length;
    
    // --- Calculate RMS volume ---
    let sum = 0.0;
    for (let i = 0; i < l; i++) {
        sum += inputChannel[i] * inputChannel[i];
    }
    const volume = Math.sqrt(sum / l);

    // --- Convert Float32Array to Int16Array (16-bit PCM) ---
    // The input data is in the range of [-1.0, 1.0].
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      // Clamp the value between -1 and 1 before converting.
      const s = Math.max(-1, Math.min(1, inputChannel[i]));
      // Convert to 16-bit integer, covering the full range [-32768, 32767].
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // --- Post both PCM data and volume back to the main thread ---
    // The third argument is a list of transferable objects, allowing for
    // a fast, zero-copy transfer of the ArrayBuffer.
    this.port.postMessage({ pcm: int16, volume: volume }, [int16.buffer]);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);