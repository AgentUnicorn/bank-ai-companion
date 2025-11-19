import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
          'process.env.SERVER_URL': JSON.stringify(env.SERVER_URL),
          'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
          'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
          'process.env.OPENAI_REALTIME_MODEL': JSON.stringify(env.OPENAI_REALTIME_MODEL),
          'process.env.OPENAI_TRANSCRIPT_MODEL': JSON.stringify(env.OPENAI_TRANSCRIPT_MODEL),
          'process.env.BANKING_MCP_SERVER_URL': JSON.stringify(env.BANKING_MCP_SERVER_URL),
          'process.env.BANKING_MCP_AUTH_TOKEN': JSON.stringify(env.BANKING_MCP_AUTH_TOKEN),
      },
      build: {
        sourcemap: false,
      }
    };
});
