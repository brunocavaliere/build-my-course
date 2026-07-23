vi.mock('@/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    openAiModel: 'test-model',
  },
}));

import { generateLessonContent } from '@/modules/lessons/services/generate-lesson-content';

const input = {
  courseTitle: 'SQL Course',
  courseGoal: 'Learn SQL',
  level: 'Beginner',
  courseLanguage: 'pt-BR',
  moduleTitle: 'Fundamentals',
  moduleDescription: 'Core SQL ideas',
  lessonTitle: 'Introduction to SQL',
  lessonDescription: 'Understand SQL basics',
  estimatedMinutes: 45,
};

function block(
  type: string,
  overrides: Partial<{
    title: string | null;
    content: string | null;
    items: string[];
    language: string | null;
    question: string | null;
    answer: string | null;
    correction: string | null;
  }> = {}
) {
  return {
    type,
    title: null,
    content: null,
    items: [],
    language: null,
    question: null,
    answer: null,
    correction: null,
    ...overrides,
  };
}

function validLessonPayload() {
  return {
    blocks: [
      block('objective', {
        title: 'O que você aprenderá',
        items: ['Consultar uma tabela', 'Entender uma consulta'],
      }),
      block('context', {
        title: 'Por que SQL existe',
        content: 'Uma aplicação precisa recuperar dados de forma previsível.',
      }),
      block('concept', {
        title: 'Tabelas e registros',
        content: 'Uma tabela organiza dados relacionados em linhas e colunas.',
      }),
      block('concept', {
        title: 'A consulta como uma pergunta',
        content: 'Uma consulta descreve quais dados você deseja obter e sob quais condições.',
      }),
      block('process', {
        title: 'Da pergunta ao resultado',
        items: ['Defina a pergunta', 'Escolha a tabela', 'Selecione as colunas'],
      }),
      block('example', {
        title: 'Consultando clientes',
        content: 'Vamos construir a consulta a partir de uma necessidade real.',
      }),
      block('code', {
        content: 'SELECT nome FROM clientes;',
        language: 'sql',
      }),
      block('insight', {
        title: 'Selecione somente o necessário',
        content: 'Escolher as colunas torna a intenção da consulta mais clara.',
      }),
      block('mistake', {
        title: 'Consultar sem entender a tabela',
        content: 'Isso pode produzir um resultado que parece correto, mas não responde à pergunta.',
        correction: 'Inspecione a estrutura e confirme o significado de cada coluna.',
      }),
      block('checkpoint', {
        title: 'Pare e pense',
        question: 'Qual coluna responde à pergunta sobre o nome do cliente?',
        answer: 'A coluna `nome`, pois ela representa exatamente o dado solicitado.',
      }),
      block('summary', {
        title: 'O que fica desta aula',
        items: ['SQL expressa perguntas', 'Tabelas organizam registros', 'Colunas têm significado'],
        content: 'Agora você pode construir uma primeira consulta com intenção clara.',
      }),
    ],
  };
}

describe('generateLessonContent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns structured pedagogical blocks and a markdown representation', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: validLessonPayload(),
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks).toHaveLength(11);
    expect(result.blocks[0]).toMatchObject({
      type: 'objective',
      position: 1,
    });
    expect(result.blocks[6]).toMatchObject({
      type: 'code',
      language: 'sql',
    });
    expect(result.content).toContain('## O que você aprenderá');
    expect(result.content).toContain('```sql');

    const request = vi.mocked(fetch).mock.calls[0]?.[1];
    const body = JSON.parse(String(request?.body));

    expect(body.text.format.type).toBe('json_schema');
    expect(body.input[1].content[0].text).toContain('Estimated lesson duration: 45 minutes');
  });

  it('parses structured JSON from output_text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify(validLessonPayload()),
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'checkpoint')).toBe(true);
  });

  it('accepts empty strings in fields unused by a block type', async () => {
    const payload = validLessonPayload();

    payload.blocks = payload.blocks.map((item) => ({
      ...item,
      title: item.title ?? '',
      content: item.content ?? '',
      language: item.language ?? '',
      question: item.question ?? '',
      answer: item.answer ?? '',
      correction: item.correction ?? '',
    }));

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks).toHaveLength(11);
    expect(result.blocks.some((item) => item.type === 'process')).toBe(true);
  });

  it('drops an invalid optional process block instead of failing the entire lesson', async () => {
    const payload = validLessonPayload();
    const processBlock = payload.blocks.find((item) => item.type === 'process');

    if (!processBlock) {
      throw new Error('Expected fixture to include a process block.');
    }

    processBlock.items = ['Passo unico'];

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'process')).toBe(false);
    expect(result.blocks.some((item) => item.type === 'summary')).toBe(true);
  });

  it('drops a mistake block without a correction instead of failing the entire lesson', async () => {
    const payload = validLessonPayload();
    const mistakeBlock = payload.blocks.find((item) => item.type === 'mistake');

    if (!mistakeBlock) {
      throw new Error('Expected fixture to include a mistake block.');
    }

    mistakeBlock.correction = null;

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'mistake')).toBe(false);
    expect(result.blocks.map((item) => item.position)).toEqual(
      result.blocks.map((_, index) => index + 1)
    );
  });

  it('throws a timeout-specific message', async () => {
    const timeoutError = new Error('timed out');
    timeoutError.name = 'AbortError';
    vi.spyOn(global, 'fetch').mockRejectedValue(timeoutError);

    await expect(generateLessonContent(input)).rejects.toThrow(
      'Lesson generation timed out. Please try again.'
    );
  });

  it('keeps a lesson without a nonessential pedagogical block', async () => {
    const payload = validLessonPayload();
    payload.blocks = payload.blocks.filter((item) => item.type !== 'checkpoint');

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'checkpoint')).toBe(false);
    expect(result.blocks.some((item) => item.type === 'summary')).toBe(true);
  });

  it('keeps sufficiently detailed content when the summary block is missing', async () => {
    const payload = validLessonPayload();
    payload.blocks = payload.blocks.filter((item) => item.type !== 'summary');

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'summary')).toBe(false);
    expect(result.content.length).toBeGreaterThanOrEqual(300);
  });

  it('keeps a sufficiently detailed lesson even when a preferred block type is missing', async () => {
    const payload = validLessonPayload();
    payload.blocks = payload.blocks.filter((item) => item.type !== 'context');

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output_parsed: payload,
      }),
    } as Response);

    const result = await generateLessonContent(input);

    expect(result.blocks.some((item) => item.type === 'context')).toBe(false);
    expect(result.blocks.length).toBeGreaterThanOrEqual(5);
  });

  it('uses provider error message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        error: { message: 'Provider said no' },
      }),
    } as Response);

    await expect(generateLessonContent(input)).rejects.toThrow('Provider said no');
  });

  it('throws when OpenAI returns empty content', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [{ content: [{ text: '   ' }] }],
      }),
    } as Response);

    await expect(generateLessonContent(input)).rejects.toThrow(
      'OpenAI returned empty lesson content.'
    );
  });

  it('maps unknown thrown values to a generic message', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue('unexpected');

    await expect(generateLessonContent(input)).rejects.toThrow(
      'Unable to generate lesson content right now.'
    );
  });
});
