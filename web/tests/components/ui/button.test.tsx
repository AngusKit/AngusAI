import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant='destructive'>Delete</Button>);

    let button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant='outline'>Outline</Button>);
    button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('border');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);

    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-8');

    rerender(<Button size='lg'>Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-10');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    );

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>With ref</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>);

    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });
});
