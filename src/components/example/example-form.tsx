'use client';

import { CheckCircle2 } from 'lucide-react';

import { useExampleForm } from '@/components/example/hooks/use-example-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function ExampleForm() {
  const { form, genreOptions, onSubmit, submittedValues } = useExampleForm();

  return (
    <Card className="bg-card/80 border-border/70 rounded-3xl backdrop-blur">
      <CardHeader>
        <CardTitle>Exemplo de formulario</CardTitle>
        <CardDescription>
          React Hook Form, Zod e shadcn/ui trabalhando juntos com schema, hook e componente
          separados.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Operating Systems for Teams" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome curto para identificar o recurso no produto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-28 resize-none"
                      placeholder="Descreva o objetivo principal deste conteudo..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use este campo para detalhes mais longos e instrucoes iniciais.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genreOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Exemplo de campo composto usando Select do shadcn/ui.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="border-border/70 flex flex-row items-start gap-3 rounded-2xl border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Destaque na home</FormLabel>
                    <FormDescription>
                      Marque para indicar que este conteudo deve aparecer com prioridade.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando...' : 'Salvar formulario'}
            </Button>
          </form>
        </Form>

        {submittedValues ? (
          <div className="bg-accent/60 border-border/70 rounded-2xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              <p className="text-sm font-medium">Ultimo envio simulado</p>
            </div>
            <div className="text-muted-foreground grid gap-2 text-sm">
              <p>
                <span className="text-foreground font-medium">Titulo:</span> {submittedValues.title}
              </p>
              <p>
                <span className="text-foreground font-medium">Categoria:</span>{' '}
                {submittedValues.genre}
              </p>
              <p>
                <span className="text-foreground font-medium">Destaque:</span>{' '}
                {submittedValues.featured ? 'Sim' : 'Nao'}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
