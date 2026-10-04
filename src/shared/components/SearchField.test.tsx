import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchField } from './SearchField';

const DEBOUNCE_MS = 400;

function setup(initialValue = '') {
  const onValueChange = vi.fn<(value: string) => void>();
  // No delay between keystrokes, so user-event never waits on the (fake) timers.
  const user = userEvent.setup({ delay: null });
  const view = render(
    <SearchField label="Search by name" value={initialValue} onValueChange={onValueChange} />,
  );
  const input = screen.getByRole('searchbox', { name: 'Search by name' });

  const rerenderWithValue = (value: string) =>
    view.rerender(
      <SearchField label="Search by name" value={value} onValueChange={onValueChange} />,
    );

  return { user, input, onValueChange, rerenderWithValue };
}

describe('SearchField', () => {
  beforeEach(() => {
    // shouldAdvanceTime: Testing Library awaits a real setTimeout(0) after each event and only
    // knows how to flush Jest's fake timers, so the fake clock must also tick on its own.
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('commits once, after the user stops typing', async () => {
    const { user, input, onValueChange } = setup();

    await user.type(input, 'rick');
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(DEBOUNCE_MS));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('rick');
  });

  it('commits immediately on Enter, trimming whitespace', async () => {
    const { user, input, onValueChange } = setup();

    await user.type(input, '  morty {Enter}');

    expect(onValueChange).toHaveBeenCalledWith('morty');
    act(() => vi.advanceTimersByTime(DEBOUNCE_MS));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('adopts external value changes (e.g. "Clear filters")', () => {
    const { input, rerenderWithValue, onValueChange } = setup('rick');

    rerenderWithValue('');

    expect(input).toHaveValue('');
    act(() => vi.advanceTimersByTime(DEBOUNCE_MS));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps newer keystrokes when its own commit echoes back', async () => {
    const { user, input, onValueChange, rerenderWithValue } = setup();

    await user.type(input, 'ric');
    act(() => vi.advanceTimersByTime(DEBOUNCE_MS));
    expect(onValueChange).toHaveBeenLastCalledWith('ric');

    // The user keeps typing before the parent re-renders with the committed value.
    await user.type(input, 'k');
    rerenderWithValue('ric');

    expect(input).toHaveValue('rick');
    act(() => vi.advanceTimersByTime(DEBOUNCE_MS));
    expect(onValueChange).toHaveBeenLastCalledWith('rick');
  });

  it('clears and commits immediately with the clear button', async () => {
    const { user, input, onValueChange } = setup('rick');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith('');
  });
});
