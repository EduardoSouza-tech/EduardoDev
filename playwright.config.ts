import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // No CI, um test.only esquecido faz o pipeline falhar
  forbidOnly: !!process.env.CI,
  // No CI, tenta de novo uma vez antes de dar o teste como quebrado
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    // Guarda o passo a passo do teste quando ele falha e é repetido
    trace: 'on-first-retry',
  },
  // Cada teste roda duas vezes: num navegador de computador e num celular emulado
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  // Sobe o site localmente antes dos testes, então o PR é testado antes de ir para o ar
  webServer: {
    command: 'npx http-server . -p 4173 -c-1 -s',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
