# Roadmap de Design - Guia Completo

## Visão Geral

Esta é a área logada do produto, focada em permitir que designers e times de produto gerenciem seus roadmaps de design em uma visão de Gantt visual e intuitiva.

## Acesso

### URL
- **Landing Page Pública**: `/` ou `#`
- **Login/Cadastro**: `#app`
- **Dashboard de Projetos**: `#app` (após login)
- **Roadmap Específico**: `#roadmap/{project-id}`

### Primeiro Acesso

1. Na landing page, clique em "Acessar App" no canto superior direito
2. Você será direcionado para a tela de login
3. Caso não tenha conta, clique em "Criar conta"
4. Preencha:
   - Nome completo
   - Email
   - Senha (mínimo 8 caracteres)
   - Confirmação de senha
5. Após criar a conta, faça login

## Funcionalidades Principais

### 1. Dashboard de Projetos

Após o login, você verá o dashboard com todos os seus projetos.

**Ações Disponíveis:**
- **Criar Novo Projeto**: Botão "Novo Projeto" no canto superior direito
- **Ver Roadmap**: Clique em "Ver roadmap" em qualquer projeto
- **Logout**: Ícone no canto superior direito

**Estados do Projeto:**
- **Em andamento**: Projetos ativos
- **Arquivado**: Projetos pausados
- **Concluído**: Projetos finalizados

### 2. Criar Projeto

Ao clicar em "Novo Projeto", preencha:
- **Nome do projeto** (obrigatório): Ex: "Redesign do app mobile"
- **Descrição** (opcional): Breve contexto do projeto
- **Data de início** (padrão: hoje): Quando o projeto começa

O sistema criará automaticamente 3 fases padrão:
1. Discovery
2. Ideação
3. Prototipação

### 3. Roadmap em Gantt

Esta é a funcionalidade principal do produto.

#### Estrutura Visual

**Cabeçalho:**
- Mostra sprints (padrão: 2 semanas cada)
- Exibe semanas com intervalo de datas
- Lista dias úteis (Seg a Sex) com números

**Corpo:**
- Cada linha representa uma fase
- Timeline mostra apenas dias úteis
- Tarefas aparecem como blocos coloridos

#### Criar Tarefas (Click & Drag)

**Método 1: Clique e Arraste**
1. Posicione o cursor sobre uma fase
2. Clique e arraste horizontalmente sobre os dias
3. Solte o mouse
4. Um modal abrirá automaticamente com:
   - Nome da tarefa (focus automático)
   - Tipo: Atividade ou Reunião
   - Datas já preenchidas
5. Digite o nome e clique em "Salvar"

**Método 2: Editar Tarefa Existente**
1. Clique em qualquer tarefa no Gantt
2. Modal abrirá com todos os detalhes
3. Edite conforme necessário
4. Clique em "Salvar"

#### Tipos de Tarefas

**Atividade (padrão)**
- Cor: Azul
- Uso: Trabalho de design, pesquisa, análise
- Exemplos: "Entrevistas com usuários", "Wireframes de tela X"

**Reunião**
- Cor: Amarelo
- Uso: Alinhamentos, apresentações, cerimônias
- Exemplos: "Kickoff com stakeholders", "Design critique"

#### Campos da Tarefa

**Obrigatórios:**
- Nome da tarefa
- Fase (Discovery, Ideação, Prototipação)
- Tipo (Atividade ou Reunião)
- Data de início
- Data de término

**Opcionais:**
- Status: Planejada / Em andamento / Concluída
- Notas: Campo livre para anotações

### 4. Handoff

O handoff marca a data de entrega do projeto para desenvolvimento.

**Como Definir:**
1. Clique no botão "Handoff: [data]" no cabeçalho
2. Selecione uma data no calendário
3. A data será ajustada automaticamente para o próximo dia útil
4. Clique em "Salvar"

**Marcador Visual:**
- Linha vertical vermelha atravessando todas as fases
- Label "HANDOFF" no topo

**Validação Inteligente:**
- Se houver tarefas terminando após o handoff, o sistema exibe um alerta
- Mensagem: "X tarefa(s) terminam após a data de handoff. Revise seu planejamento."

### 5. Gestão de Fases

As fases aparecem como linhas no Gantt.

**Fases Padrão:**
1. Discovery
2. Ideação
3. Prototipação

*Nota: Funcionalidade de adicionar/editar/remover fases personalizadas pode ser adicionada no futuro.*

## Regras de Negócio

### Dias Úteis
- O sistema trabalha apenas com dias úteis (segunda a sexta)
- Fins de semana não aparecem na timeline
- Datas selecionadas em fins de semana são automaticamente ajustadas para a próxima segunda-feira

### Sprints
- Duração padrão: 2 semanas (10 dias úteis)
- Calculadas a partir da data de início do projeto
- Visualização clara no topo do Gantt

### Tarefas Paralelas
- Você pode ter múltiplas tarefas simultâneas
- Tarefas podem se sobrepor sem restrições
- Útil para representar trabalho paralelo de diferentes fluxos

### Validações
- Data de término deve ser >= data de início
- Todas as datas são alinhadas ao grid de dias úteis
- Handoff deve ser um dia útil

## Fluxos Principais

### Fluxo 1: Primeiro Projeto

```
1. Cadastro/Login
   ↓
2. Dashboard vazio → "Criar primeiro roadmap"
   ↓
3. Preencher: Nome, Descrição, Data início
   ↓
4. Sistema cria fases padrão
   ↓
5. Usuário é levado ao Gantt
   ↓
6. Criar tarefas com click & drag
   ↓
7. Definir handoff
```

### Fluxo 2: Criar Tarefa Rapidamente

```
1. Abrir roadmap de um projeto
   ↓
2. Escolher fase (ex: Discovery)
   ↓
3. Clicar e arrastar sobre 3 dias
   ↓
4. Modal abre
   ↓
5. Digitar "Entrevistas com usuários"
   ↓
6. Selecionar tipo: Atividade
   ↓
7. Salvar
   ↓
8. Tarefa aparece instantaneamente no Gantt
```

### Fluxo 3: Ajustar Planejamento

```
1. Ver tarefas no Gantt
   ↓
2. Clicar em tarefa existente
   ↓
3. Ajustar datas manualmente no modal
   ↓
4. Ou: Mudar status para "Em andamento"
   ↓
5. Adicionar notas
   ↓
6. Salvar
```

## Personas e Casos de Uso

### Persona 1: Líder de Design Solo

**Contexto:** Trabalha em 2-3 projetos simultâneos, precisa alinhar com devs e stakeholders

**Uso:**
1. Cria um projeto por iniciativa
2. Planeja sprints de 2 semanas
3. Marca reuniões em amarelo para não esquecer alinhamentos
4. Define handoff para comunicar prazo com devs
5. Atualiza status das tarefas conforme avança

### Persona 2: Freelancer de Produto

**Contexto:** Vários clientes, precisa saber quando está sobrecarregado

**Uso:**
1. Cria um projeto por cliente
2. Visualiza todos os projetos no dashboard
3. Entra em cada roadmap para planejar semanas
4. Usa tarefas paralelas para representar trabalho em múltiplos projetos
5. Handoff marca deadline de entrega para cliente

## Atalhos e Dicas

### Navegação Rápida
- `#app` → Dashboard (se logado) ou Login (se não logado)
- `#roadmap/{id}` → Abre roadmap diretamente
- `Voltar` no Gantt → Retorna ao dashboard

### Produtividade
- **Click & Drag**: Mais rápido que criar tarefa por formulário
- **Reuniões em Amarelo**: Fácil de identificar dependências
- **Handoff Visível**: Todo o time vê o prazo

### Melhor Prática
1. Defina o handoff logo no início do projeto
2. Use reuniões para marcar checkpoints importantes
3. Mantenha fases com 3-5 tarefas cada (não sobrecarregue)
4. Revise o roadmap semanalmente

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Validação**: Row Level Security (RLS)
- **Deploy**: Pronto para Netlify/Vercel

## Estrutura do Banco de Dados

### Tabelas

**projects**
- Armazena projetos do usuário
- Campos principais: name, start_date, handoff_date, sprint_duration_weeks

**phases**
- Fases do projeto (Discovery, Ideação, etc.)
- Ordenadas por campo `order`

**tasks**
- Tarefas dentro de cada fase
- Tipo: activity ou meeting
- Datas: start_date, end_date (apenas dias úteis)

### Segurança (RLS)

Todas as tabelas possuem Row Level Security ativado:
- Usuários só veem seus próprios projetos
- Cascata: deletar projeto → deleta fases → deleta tarefas
- Políticas para SELECT, INSERT, UPDATE, DELETE

## Próximas Evoluções

### Funcionalidades Futuras
- [ ] Arrastar tarefas para mover datas
- [ ] Redimensionar tarefas pelas bordas
- [ ] Adicionar/editar/remover fases customizadas
- [ ] Filtros: status, tipo, responsável
- [ ] Zoom: visualizar por dias, semanas ou meses
- [ ] Exportar roadmap como imagem ou PDF
- [ ] Colaboração: convidar membros do time
- [ ] Notificações: lembrete de handoff próximo
- [ ] Templates: salvar estrutura de projeto para reutilizar
- [ ] Login social: Google OAuth

## Suporte

Para dúvidas ou problemas:
1. Verifique se o navegador tem JavaScript habilitado
2. Limpe cache e cookies
3. Teste em modo anônimo
4. Console do navegador (F12) pode mostrar erros

## Conclusão

Este roadmap de design foi construído pensando na simplicidade e produtividade de designers. A interface visual com Gantt permite planejar rapidamente sem a complexidade de ferramentas enterprise como Jira.

**O foco é**: arrastar, soltar, ajustar e entregar. Sem configuração excessiva, apenas planejamento visual e claro.
