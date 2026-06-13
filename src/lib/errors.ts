export const DEFAULT_ERROR_MESSAGES = {
  genericTitle: 'Algo saiu do esperado',
  genericDescription: 'Ocorreu uma falha inesperada. Tente novamente ou volte em alguns instantes.',
  queryDescription:
    'Nao foi possivel carregar os dados solicitados. Verifique a conexao e tente novamente.',
  notFoundTitle: 'Conteudo nao encontrado',
  notFoundDescription: 'A pagina ou recurso que voce tentou acessar nao existe mais ou foi movido.',
} as const;

export function getErrorMessage(
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGES.genericDescription
) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}
