import fs from 'node:fs/promises';
import path from 'node:path';

type TemplateContext = {
  componentFileName: string;
  componentName: string;
  constantName: string;
  countLabelName: string;
  hookFileName: string;
  hookName: string;
  itemTypeName: string;
  itemsGetterName: string;
  moduleName: string;
  pascalName: string;
  serviceFileName: string;
};

function toKebabCase(input: string) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toPascalCase(input: string) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function createTemplateContext(moduleName: string): TemplateContext {
  const pascalName = toPascalCase(moduleName);

  return {
    componentFileName: `${moduleName}-card.tsx`,
    componentName: `${pascalName}Card`,
    constantName: `${moduleName.replace(/-/g, '_').toUpperCase()}_FEATURES`,
    countLabelName: `get${pascalName}CountLabel`,
    hookFileName: `use-${moduleName}.ts`,
    hookName: `use${pascalName}`,
    itemTypeName: `${pascalName}Item`,
    itemsGetterName: `get${pascalName}Items`,
    moduleName,
    pascalName,
    serviceFileName: `${moduleName}-service.ts`,
  };
}

function getModuleFiles(context: TemplateContext): Record<string, string> {
  const moduleImportBase = `@/components/${context.moduleName}`;

  return {
    [context.componentFileName]: `import { use${context.pascalName} } from '${moduleImportBase}/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ${context.componentName}() {
  const { countLabel, features, items } = ${context.hookName}();

  return (
    <Card className="border-border/70 bg-card/80 rounded-3xl shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-lg">${context.pascalName}</CardTitle>
        <CardDescription>
          Modulo gerado automaticamente para manter a estrutura de dominio consistente.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-border/70 bg-background/70 rounded-2xl border p-4"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground space-y-3 text-sm">
          <p>{countLabel}</p>
          <ul className="grid gap-2">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
`,
    'constants.ts': `export const ${context.constantName} = [
  'TODO: descreva a primeira responsabilidade deste modulo.',
  'TODO: descreva a segunda responsabilidade deste modulo.',
] as const;
`,
    'hooks/index.ts': `export { ${context.hookName} } from '@/components/${context.moduleName}/hooks/use-${context.moduleName}';
`,
    [path.join('hooks', context.hookFileName)]:
      `import { ${context.constantName} } from '${moduleImportBase}/constants';
import { ${context.itemsGetterName} } from '${moduleImportBase}/services/${context.serviceFileName.replace('.ts', '')}';
import { ${context.countLabelName} } from '${moduleImportBase}/utils';

export function ${context.hookName}() {
  const items = ${context.itemsGetterName}();

  return {
    countLabel: ${context.countLabelName}(items),
    features: ${context.constantName},
    hasItems: items.length > 0,
    items,
  };
}
`,
    'index.ts': `export { ${context.componentName} } from '@/components/${context.moduleName}/${context.componentFileName.replace('.tsx', '')}';
export { ${context.hookName} } from '@/components/${context.moduleName}/hooks';
export { ${context.itemsGetterName} } from '@/components/${context.moduleName}/services';
export { ${context.constantName} } from '@/components/${context.moduleName}/constants';
export { ${context.countLabelName} } from '@/components/${context.moduleName}/utils';
export type { ${context.itemTypeName} } from '@/components/${context.moduleName}/types';
`,
    'services/index.ts': `export { ${context.itemsGetterName} } from '@/components/${context.moduleName}/services/${context.serviceFileName.replace('.ts', '')}';
`,
    [path.join('services', context.serviceFileName)]:
      `import type { ${context.itemTypeName} } from '${moduleImportBase}/types';

export function ${context.itemsGetterName}(): ${context.itemTypeName}[] {
  return [
    {
      id: '${context.moduleName}-starter',
      title: 'TODO: item inicial do modulo',
      description: 'Atualize este mock com os dados reais ou com a integracao do dominio.',
    },
  ];
}
`,
    'types.ts': `export type ${context.itemTypeName} = {
  id: string;
  title: string;
  description: string;
};
`,
    'utils.ts': `import type { ${context.itemTypeName} } from '${moduleImportBase}/types';

export function ${context.countLabelName}(items: ${context.itemTypeName}[]) {
  return \`\${items.length} \${items.length === 1 ? 'item pronto para evoluir' : 'itens prontos para evoluir'}\`;
}
`,
  };
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function writeModuleFiles(moduleDir: string, files: Record<string, string>) {
  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(moduleDir, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }
}

async function main() {
  const rawModuleName = process.argv[2];

  if (!rawModuleName) {
    console.error('Uso: yarn generate:module <module-name>');
    process.exit(1);
  }

  const moduleName = toKebabCase(rawModuleName);

  if (!moduleName || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(moduleName)) {
    console.error(`Nome de modulo invalido: "${rawModuleName}".`);
    process.exit(1);
  }

  const moduleDir = path.join(process.cwd(), 'src', 'components', moduleName);

  if (await pathExists(moduleDir)) {
    console.error(`O modulo "${moduleName}" ja existe em src/components/${moduleName}.`);
    process.exit(1);
  }

  const files = getModuleFiles(createTemplateContext(moduleName));

  await writeModuleFiles(moduleDir, files);

  console.log(`Modulo criado com sucesso em src/components/${moduleName}`);
  console.log(`Comando de origem: ${rawModuleName} -> ${moduleName}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Falha inesperada ao gerar o modulo.';

  console.error(message);
  process.exit(1);
});
