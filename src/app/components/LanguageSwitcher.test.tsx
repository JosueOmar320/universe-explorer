import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/app/layout/AppShell';
import { HomePage } from '@/app/pages/HomePage';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { renderRoutes } from '@/test/render';

const renderHome = () =>
  renderRoutes([{ Component: AppShell, children: [{ index: true, Component: HomePage }] }]);

describe('LanguageSwitcher', () => {
  it('exposes the current language to assistive technology', () => {
    renderHome();

    const group = screen.getByRole('group', { name: 'Language' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('lang', 'es');
  });

  it('translates the interface, updates <html lang> and remembers the choice', async () => {
    const { user } = renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('One shell.');

    await user.click(screen.getByRole('button', { name: 'Español' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Un shell.');
    expect(screen.getByRole('navigation', { name: 'Universos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('lang', 'es');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
  });

  it('keeps API data untranslated (proper names stay as they are)', async () => {
    const { user } = renderHome();

    await user.click(screen.getByRole('button', { name: 'Español' }));

    expect(screen.getByRole('heading', { level: 3, name: 'Rick and Morty' })).toBeInTheDocument();
  });
});
