import { createServer } from 'vite';
import net from 'net';

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port, '0.0.0.0');
  });
}

async function getFreePort(preferredPort = 3001) {
  // Check preferred port first
  if (await isPortAvailable(preferredPort)) {
    return preferredPort;
  }
  // Otherwise find next available port starting from 3002
  let port = preferredPort + 1;
  while (port < preferredPort + 50) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error('No free port found in range');
}

async function start() {
  const freePort = await getFreePort(3001);
  console.log(`Detected verified free port: ${freePort}`);

  const server = await createServer({
    server: {
      port: freePort,
      strictPort: true,
      host: true
    }
  });

  await server.listen();
  console.log(`\n======================================================`);
  console.log(`⚡ VERSALY FLOW IS LIVE ON VERIFIED FREE PORT: ${freePort}`);
  console.log(`👉 URL: http://localhost:${freePort}/`);
  console.log(`======================================================\n`);
  server.printUrls();
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
