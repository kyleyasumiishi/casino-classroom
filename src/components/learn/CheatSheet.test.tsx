import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheatSheet, CheatSheetButton } from './CheatSheet';

const entries = [
  { label: 'Goal', value: 'Beat the dealer' },
  { label: 'Blackjack', value: 'Pays 3:2' },
];

describe('CheatSheet', () => {
  it('renders all cheat sheet entries when open', () => {
    render(<CheatSheet entries={entries} isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByText('Goal')).toBeInTheDocument();
    expect(screen.getByText('Beat the dealer')).toBeInTheDocument();
    expect(screen.getByText('Blackjack')).toBeInTheDocument();
    expect(screen.getByText('Pays 3:2')).toBeInTheDocument();
  });

  it('does not render entries when closed', () => {
    render(<CheatSheet entries={entries} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.queryByText('Goal')).not.toBeInTheDocument();
  });

  it('entries show label and value', () => {
    render(<CheatSheet entries={entries} isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByText('Goal')).toBeInTheDocument();
    expect(screen.getByText('Beat the dealer')).toBeInTheDocument();
  });
});

describe('CheatSheetButton', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<CheatSheetButton onClick={onClick} />);
    await userEvent.click(screen.getByText('Cheat Sheet'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
