# 🌬️ Respira KIDS - Sistema SaaS

Plataforma SaaS dedicada ao bem-estar infantil através de técnicas de respiração e mindfulness, criando momentos especiais de conexão entre pais e filhos.

## 🎨 Brand Identity

- **Azul**: `#92D3C7` - Cor principal "Respira"
- **Vermelho**: `#F39D94` - Cor principal "KIDS"  
- **Bege**: `#FDF0DE` - Fundos suaves
- **Roxo**: `#4E1963` - Títulos e acentos
- **Amarelo**: `#FDCD1F` - Cata-vento
- **Verde**: `#C6E09F` - Cata-vento
- **Cinza**: `#7A7A7A` - Textos secundários
- **Branco**: `#FFFFFF` - Fundos limpos

## 🛠️ Stack Tecnológica

- **Frontend**: Vue.js 3 + TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: Vue Router 4
- **Build**: Vite
- **Code Quality**: ESLint + Prettier

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── views/         # Páginas da aplicação
├── router/        # Configuração de rotas
├── utils/         # Funções utilitárias
├── assets/        # Assets processados
└── main.ts        # Entry point

public/
└── images/        # Imagens da marca organizadas
    ├── logos/     # Logotipos
    └── brand/     # Elementos da marca
```

## 🏗️ Arquitetura

Para diretrizes detalhadas de desenvolvimento, consulte:
**[📖 ARQUITETURA.md](./ARQUITETURA.md)** - Princípios, padrões e boas práticas

### Princípios Fundamentais
- **Single Responsibility** - Uma responsabilidade por componente
- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple
- **YAGNI** - You Aren't Gonna Need It  
- **Single Source of Truth** - Centralização de dados

## 🚀 Ambiente de Desenvolvimento

### IDE Recomendado
[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desabilite Vetur)

### Suporte a Types para `.vue`
O TypeScript precisa do [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para reconhecer tipos em arquivos `.vue`.

## ⚡ Comandos de Desenvolvimento

### Instalação Inicial
```bash
npm install
```

### Desenvolvimento Local
```bash
npm run dev          # Servidor de desenvolvimento (http://localhost:5173)
```

### Build e Deploy
```bash
npm run build        # Build para produção
npm run preview      # Preview da build local
```

### Qualidade de Código
```bash
npm run lint         # ESLint
npm run type-check   # Verificação de tipos TypeScript
```

## 📋 Próximos Passos

- [x] Sistema de autenticação com Google OAuth
- [x] Dashboard profissional para fisioterapeutas
- [x] Componentes base reutilizáveis
- [x] Interface responsiva
- [ ] Módulo de exercícios respiratórios
- [ ] Área familiar
- [ ] Relatórios de progresso

## 📚 Documentação

- **[🏗️ Arquitetura](./ARQUITETURA.md)** - Diretrizes de desenvolvimento
- **[🚀 Integração Supabase](./INTEGRACAO-SUPABASE.md)** - Padrões de banco de dados
- **[🖼️ Imagens](./IMAGENS-INSTRUCOES.md)** - Instruções para assets

## 🤝 Contribuição

1. Siga os princípios definidos em **[ARQUITETURA.md](./ARQUITETURA.md)**
2. Use as cores oficiais da marca
3. Mantenha componentes simples e reutilizáveis
4. Teste em diferentes tamanhos de tela
5. Documente mudanças significativas

## 📄 Licença

Projeto privado - Respira KIDS © 2024