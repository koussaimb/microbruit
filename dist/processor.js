registerProcessor('rnnoise-processor', class extends AudioWorkletProcessor {
    constructor() {
      super();
      this._rnnoiseModule = null;
      this.port.onmessage = async (event) => {
        if (event.data.type === 'init') {
          this._rnnoiseModule = await createRNNWasmModule();
        }
      };
    }
  
    process(inputs, outputs) {
      const input = inputs[0];
      const output = outputs[0];
      const inputChannel = input[0];
      const outputChannel = output[0];
      console.log('rnnoise est en cours du runnnnnnnn');
      if (this._rnnoiseModule) {
        this._rnnoiseModule.process(inputChannel, outputChannel);
      } else {
        outputChannel.set(inputChannel);
      }
  
      return true;
    }
  });
  