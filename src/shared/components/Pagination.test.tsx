import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

function setup(currentPage: number, totalPages: number) {
  const onPageChange = vi.fn<(page: number) => void>();
  render(
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />,
  );
  return { onPageChange, user: userEvent.setup() };
}

describe('Pagination', () => {
  it('renders nothing when there is a single page', () => {
    setup(1, 1);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('marks the current page for assistive technology', () => {
    setup(6, 42);
    expect(screen.getByRole('button', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 5' })).not.toHaveAttribute('aria-current');
  });

  it('disables "Previous" on the first page and "Next" on the last one', () => {
    const { unmount } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    unmount();

    render(<Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('reports the requested page', async () => {
    const { user, onPageChange } = setup(6, 42);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    await user.click(screen.getByRole('button', { name: 'Page 42' }));

    expect(onPageChange.mock.calls).toEqual([[7], [5], [42]]);
  });
});
