import { beforeEach, describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { ExampleForm } from '@/components/example';
import { render, screen, within } from '@/tests/render';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/lib/toast';

vi.mock('@/lib/toast', () => ({
  dismissToast: vi.fn(),
  showErrorToast: vi.fn(),
  showInfoToast: vi.fn(),
  showLoadingToast: vi.fn(() => 'loading-toast-id'),
  showSuccessToast: vi.fn(),
}));

describe('ExampleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os campos principais do formulario', () => {
    render(<ExampleForm />);

    expect(screen.getByLabelText('Titulo')).toBeInTheDocument();
    expect(screen.getByLabelText('Descricao')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Destaque na home')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar formulario' })).toBeInTheDocument();
  });

  it('exibe erros ao tentar enviar o formulario invalido', async () => {
    const user = userEvent.setup();

    render(<ExampleForm />);

    await user.click(screen.getByRole('button', { name: 'Salvar formulario' }));

    expect(
      await screen.findByText('Informe um titulo com pelo menos 2 caracteres.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('A descricao precisa ter pelo menos 10 caracteres.')
    ).toBeInTheDocument();
  });

  it('permite preencher e enviar dados validos', async () => {
    const user = userEvent.setup();

    render(<ExampleForm />);

    await user.type(screen.getByLabelText('Titulo'), 'Team Knowledge Base');
    await user.type(
      screen.getByLabelText('Descricao'),
      'Um formulario de exemplo para padronizar validacao e composicao com shadcn/ui.'
    );
    await user.click(screen.getByLabelText('Destaque na home'));
    await user.click(screen.getByRole('button', { name: 'Salvar formulario' }));

    expect(await screen.findByText('Ultimo envio simulado')).toBeInTheDocument();

    const submittedCard = screen.getByText('Ultimo envio simulado').closest('div');
    const scope = submittedCard ? within(submittedCard.parentElement ?? submittedCard) : screen;

    expect(scope.getByText(/Team Knowledge Base/i)).toBeInTheDocument();
    expect(scope.getByText(/product/i)).toBeInTheDocument();
    expect(
      scope.getByText((_, element) => element?.textContent?.trim() === 'Destaque: Sim')
    ).toBeInTheDocument();
    expect(showLoadingToast).toHaveBeenCalledWith('Salvando formulario...', {
      description: 'Validando dados e simulando persistencia.',
    });
    expect(showSuccessToast).toHaveBeenCalledWith('Formulario salvo com sucesso.', {
      description: 'O envio foi concluido e o preview foi atualizado.',
    });
    expect(showErrorToast).not.toHaveBeenCalled();
    expect(dismissToast).toHaveBeenCalledWith('loading-toast-id');
  });
});
