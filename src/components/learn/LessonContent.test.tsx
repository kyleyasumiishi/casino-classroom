import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonContent } from './LessonContent';
import type { LessonSection } from '../../types/lesson';

const mockSection: LessonSection = {
  id: 'test-section',
  title: 'Test Section',
  content: [
    { type: 'text', body: 'This is a text block.' },
    { type: 'heading', level: 2, text: 'Heading Two' },
    { type: 'heading', level: 3, text: 'Heading Three' },
    { type: 'tip', body: 'This is a tip.' },
    { type: 'warning', body: 'This is a warning.' },
    {
      type: 'example',
      scenario: 'Test scenario',
      action: 'Test action',
      result: 'Test result',
    },
    {
      type: 'payoutTable',
      rows: [
        { bet: 'Pass', pays: '1:1', houseEdge: '1.41%' },
      ],
    },
  ],
};

describe('LessonContent', () => {
  const defaultProps = {
    section: mockSection,
    onNext: vi.fn(),
    onPrev: vi.fn(),
    isFirst: false,
    isLast: false,
  };

  it('renders text blocks as paragraphs', () => {
    render(<LessonContent {...defaultProps} />);
    expect(screen.getByText('This is a text block.')).toBeInTheDocument();
  });

  it('renders headings at correct level', () => {
    render(<LessonContent {...defaultProps} />);
    const h2 = screen.getByText('Heading Two');
    expect(h2.tagName).toBe('H2');
    const h3 = screen.getByText('Heading Three');
    expect(h3.tagName).toBe('H3');
  });

  it('renders tip blocks with tip styling', () => {
    render(<LessonContent {...defaultProps} />);
    expect(screen.getByText('Tip')).toBeInTheDocument();
    expect(screen.getByText('This is a tip.')).toBeInTheDocument();
  });

  it('renders warning blocks with warning styling', () => {
    render(<LessonContent {...defaultProps} />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning.')).toBeInTheDocument();
  });

  it('renders example blocks with scenario/action/result', () => {
    render(<LessonContent {...defaultProps} />);
    expect(screen.getByText('Test scenario')).toBeInTheDocument();
    expect(screen.getByText('Test action')).toBeInTheDocument();
    expect(screen.getByText('Test result')).toBeInTheDocument();
  });

  it('renders payout table blocks', () => {
    render(<LessonContent {...defaultProps} />);
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('1:1')).toBeInTheDocument();
    expect(screen.getByText('1.41%')).toBeInTheDocument();
  });

  it('next button calls onNext', async () => {
    const onNext = vi.fn();
    render(<LessonContent {...defaultProps} onNext={onNext} />);
    await userEvent.click(screen.getByText('Next'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('prev button calls onPrev', async () => {
    const onPrev = vi.fn();
    render(<LessonContent {...defaultProps} onPrev={onPrev} />);
    await userEvent.click(screen.getByText('Previous'));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('prev button hidden when isFirst is true', () => {
    render(<LessonContent {...defaultProps} isFirst={true} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('next button shows "Finish" when isLast is true', () => {
    render(<LessonContent {...defaultProps} isLast={true} />);
    expect(screen.getByText('Finish')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
});
