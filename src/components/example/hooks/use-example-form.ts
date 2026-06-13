'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { EXAMPLE_FORM_GENRES } from '@/components/example/constants';
import { exampleFormSchema } from '@/components/example/schemas';
import type { ExampleFormValues } from '@/components/example/types';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/lib/toast';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useExampleForm() {
  const [submittedValues, setSubmittedValues] = useState<ExampleFormValues | null>(null);

  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      genre: 'product',
      featured: false,
    },
  });

  async function handleValidSubmit(values: ExampleFormValues) {
    const loadingToastId = showLoadingToast('Salvando formulario...', {
      description: 'Validando dados e simulando persistencia.',
    });

    try {
      await wait(120);
      setSubmittedValues(values);
      showSuccessToast('Formulario salvo com sucesso.', {
        description: 'O envio foi concluido e o preview foi atualizado.',
      });
    } catch {
      showErrorToast('Nao foi possivel salvar o formulario.', {
        description: 'Tente novamente em instantes.',
      });
    } finally {
      dismissToast(loadingToastId);
    }
  }

  return {
    form,
    genreOptions: EXAMPLE_FORM_GENRES,
    onSubmit: form.handleSubmit(handleValidSubmit),
    submittedValues,
  };
}
