import { test, expect } from '@playwright/test';

test.describe('Portfólio', () => {
  test('abre com meu nome no título e no topo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Eduardo Souza/);
    await expect(page.locator('#heroName')).toContainText('Eduardo');
  });

  test('tem os links de contato', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute('href', /linkedin\.com\/in\/eduardotsouza/);
    await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute('href', /github\.com\/EduardoSouza-tech/);
    await expect(page.locator('a[href^="mailto:"]').first()).toBeAttached();
  });

  // Teste de API: pede cada imagem direto ao servidor e confere a resposta
  test('todas as imagens existem no servidor', async ({ page, request }) => {
    await page.goto('/');
    const fontes = await page.locator('img[src]').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') as string));
    expect(fontes.length).toBeGreaterThan(0);
    for (const src of fontes) {
      const resposta = await request.get(src);
      expect(resposta.status(), `imagem ${src}`).toBe(200);
    }
  });

  test('carrega sem erros de JavaScript', async ({ page }) => {
    const erros: string[] = [];
    page.on('pageerror', (erro) => erros.push(erro.message));
    await page.goto('/');
    await page.waitForLoadState('load');
    expect(erros).toEqual([]);
  });
});
