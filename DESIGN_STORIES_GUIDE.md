# Guia do Roadmap de Histórias de Design

## Visão Geral

O Roadmap foi transformado em um sistema de **Histórias de Design**, onde você pode planejar múltiplas iniciativas em paralelo, cada uma com suas próprias fases sequenciais. Cada história aparece como uma faixa horizontal na timeline, com suas fases exibidas como segmentos coloridos contínuos.

## Conceitos Principais

### História de Design
Uma história representa uma iniciativa maior de design (ex: "Redesign da Home", "Nova Feature de Busca", "Sistema de Notificações"). Cada história possui:
- **Nome**: Identificador da iniciativa
- **Cor**: Identificação visual única
- **Data de início e fim**: Calculadas automaticamente pelas fases
- **Fases internas**: Segmentos sequenciais (Discovery, Ideação, Prototipação, etc)
- **Data de handoff**: Marcador opcional de entrega

### Fases
As fases ficam **dentro** de cada história e são contínuas:
- Cada fase começa onde a anterior termina (sem gaps)
- Duração definida em dias úteis
- Ajustáveis por drag-and-drop dos divisores
- Cores customizáveis ou herdadas da história

### Sprints
Sprints são referências visuais na timeline:
- Configuráveis em 1, 2, 3 ou 4 semanas
- Aparecem no topo da timeline
- Não afetam datas das histórias (apenas visual)

---

## Criando Histórias

### Primeira História

1. Acesse um projeto
2. Clique na aba **"Roadmap"**
3. Se não houver histórias, clique em **"Criar Primeira História"**
4. Preencha os dados no modal

### Histórias Adicionais

1. Clique no botão **"+ Nova História"** no canto superior direito
2. Preencha os dados

### Dados da História

**Nome da história*** (obrigatório)
- Ex: "Redesign da Home", "Nova Feature de Pagamentos"

**Cor identificadora**
- Escolha entre 8 cores predefinidas
- Serve para identificar rapidamente na timeline

**Data de início***
- Quando a história começa
- Primeira fase inicia nesta data

**Data de handoff** (opcional)
- Quando a história será entregue
- Aparece como marcador vermelho "HANDOFF"

**Fases da história**
- Por padrão: Discovery (10 dias), Ideação (5 dias), Prototipação (15 dias)
- Adicione, remova ou edite fases conforme necessário
- Cada fase precisa de nome e duração em dias
- Total de dias é calculado automaticamente

---

## Gerenciando Histórias

### Visualizar Histórias

Todas as histórias aparecem como faixas horizontais na timeline:
- **Área lateral esquerda**: Nome, cor, datas, handoff
- **Timeline**: Fases coloridas sequenciais

### Editar História

1. Clique no ícone de três pontos (⋮) na história
2. Selecione **"Editar história"**
3. Modifique os dados
4. Clique em **"Salvar alterações"**

### Excluir História

1. Clique no ícone de três pontos (⋮) na história
2. Selecione **"Excluir história"**
3. Confirme a ação

**Atenção**: Esta ação não pode ser desfeita.

### Colapsar/Expandir História

1. Clique na seta (▼/▶) ao lado do nome da história
2. História colapsada oculta as fases (economiza espaço)
3. Útil quando há muitas histórias no roadmap

---

## Ajustando Fases

### Divisores entre Fases

Entre cada fase há uma **linha vertical fina** que serve como divisor:
- Passe o mouse sobre o divisor
- Ele ficará mais escuro e mostrará um ícone de grip
- **Arraste** para a esquerda ou direita
- A duração das fases será ajustada automaticamente

### Como Funciona

- Arrastar para **direita**: Aumenta a fase à esquerda, diminui a da direita
- Arrastar para **esquerda**: Diminui a fase à esquerda, aumenta a da direita
- A última fase não pode ser redimensionada por drag (use o modal de edição)

### Dica

Você pode fazer ajustes rápidos sem abrir o modal. Ideal para refinar durações durante o planejamento.

---

## Controles de Zoom

### Níveis de Zoom

Disponíveis no canto superior direito:
- **50%**: Visão muito compacta (mais semanas visíveis)
- **75%**: Visão compacta
- **100%**: Visão padrão
- **150%**: Visão expandida
- **200%**: Visão muito expandida (mais detalhes)

### Usando Zoom

**Botões rápidos**:
- Clique em **[-]** para diminuir zoom
- Clique em **[+]** para aumentar zoom

**Seleção direta**:
- Clique no percentual desejado (50%, 75%, 100%, 150%, 200%)

O zoom altera o espaçamento entre dias/semanas sem distorcer as histórias. Útil para:
- **Zoom out (50-75%)**: Visão macro de várias semanas
- **Zoom in (150-200%)**: Análise detalhada de cada dia

---

## Configuração de Sprint

### Duração do Sprint

1. Clique no botão **"Sprint: X semanas"**
2. Escolha a duração desejada: 1, 2, 3 ou 4 semanas
3. A timeline atualizará automaticamente

### Visualização de Sprints

Sprints aparecem no topo da timeline como:
- Blocos horizontais com labels "Sprint 1", "Sprint 2", etc
- Divisões verticais entre sprints
- Fundo cinza para contraste

### Para Que Serve?

Sprints servem como **referência visual** para:
- Alinhamento de histórias com ciclos de desenvolvimento
- Planejamento de entregas por sprint
- Sincronização com metodologias ágeis

**Importante**: Sprints não alteram as datas das histórias. É apenas visual.

---

## Planejamento com Múltiplas Histórias

### Histórias Paralelas

Você pode ter várias histórias rodando simultaneamente:

**Exemplo de Roadmap**:
```
Sprint 1        Sprint 2        Sprint 3
┌─────────────┬─────────────┬─────────────┐
│ Redesign Home (azul)                    │
│ Discovery → Ideação → Prototipação      │
│                                         │
│     Nova Busca (verde)                  │
│     Discovery → Ideação → Proto         │
│                                         │
│              Sistema Notif (laranja)    │
│              Disc → Ideação → Proto     │
└─────────────┴─────────────┴─────────────┘
```

### Estratégias de Planejamento

**Complementaridade**:
- Histórias pequenas podem rodar enquanto grandes estão em andamento
- Ex: Prototipar Feature A enquanto descobre Feature B

**Dependências Visuais**:
- Alinhe visualmente histórias que dependem uma da outra
- Ex: História B começa quando História A entrega

**Capacidade de Time**:
- Não sobrecarregue: evite muitas histórias simultaneamente
- Use cores para separar por squad/área

---

## Marcadores de Handoff

### O Que É Handoff?

Data de entrega/transição da história para desenvolvimento, stakeholders, etc.

### Visualização

- Aparece como uma **linha vertical vermelha** na timeline
- Label **"HANDOFF"** no topo da linha
- Posicionado exatamente na data definida

### Configurando Handoff

**Ao criar história**:
1. Preencha o campo "Data de handoff"
2. Deve ser igual ou posterior à data de término

**Ao editar história**:
1. Edite a história
2. Altere ou remova a data de handoff
3. Salve as alterações

### Casos de Uso

- Marcar quando o design será entregue ao dev
- Indicar deadline para cliente
- Sincronizar com sprints ou milestones
- Planejamento de releases

---

## Workflow Recomendado

### 1. Planejar Iniciativas

- Liste as histórias de design do trimestre/semestre
- Defina prioridade e ordem
- Escolha cores para cada área/squad

### 2. Configurar Sprints

- Defina duração do sprint (ex: 2 semanas)
- Use como referência para alinhar histórias

### 3. Criar Histórias no Roadmap

- Crie cada história com fases realistas
- Ajuste durações com base em experiência
- Defina handoffs alinhados com sprints

### 4. Ajustar com Drag

- Arraste divisores de fases para refinar durações
- Teste diferentes configurações
- Use zoom para análise detalhada

### 5. Manter Atualizado

- Colapse histórias concluídas
- Adicione novas histórias conforme planejamento evolui
- Ajuste fases conforme necessário

### 6. Tarefas no Kanban

- Use o Kanban (aba ao lado) para tarefas operacionais
- Vincule cards do Kanban às fases das histórias
- Roadmap = macro, Kanban = micro

---

## Casos de Uso Reais

### Cenário 1: Squad de Produto

**Contexto**: Time de 3 designers, 4 sprints de 2 semanas

**Histórias**:
1. **Redesign da Home** (azul) - 6 semanas
   - Discovery (2 semanas)
   - Ideação (1 semana)
   - Prototipação (2 semanas)
   - Testes (1 semana)

2. **Nova Feature de Busca** (verde) - 4 semanas
   - Discovery (1 semana)
   - Ideação (1 semana)
   - Prototipação (2 semanas)

3. **Sistema de Notificações** (laranja) - 3 semanas
   - Discovery (1 semana)
   - Prototipação (2 semanas)

**Planejamento**:
- Semanas 1-2: Redesign Home (Discovery)
- Semanas 3-4: Redesign Home (Ideação) + Nova Busca (Discovery)
- Semanas 5-6: Redesign Home (Proto) + Nova Busca (Ideação)
- Semanas 7-8: Redesign Home (Proto/Testes) + Nova Busca (Proto) + Notificações (Discovery)

### Cenário 2: Freelancer / Consultor

**Contexto**: Vários projetos simultâneos

**Histórias**:
1. **Cliente A - App Mobile** (azul)
2. **Cliente B - Website** (verde)
3. **Cliente C - Dashboard** (roxo)

**Uso**:
- Cada cor representa um cliente
- Handoffs alinhados com datas de entrega contratadas
- Sprint de 1 semana para revisões semanais
- Zoom out (50%) para visão geral de todos os clientes

### Cenário 3: Agência de Design

**Contexto**: Múltiplos projetos, múltiplos squads

**Histórias por Squad**:
- **Squad Mobile** (azul): 2 histórias em paralelo
- **Squad Web** (verde): 3 histórias escalonadas
- **Squad Branding** (laranja): 1 história longa

**Uso**:
- Cores identificam squads
- Sprint de 2 semanas alinhado com cliente
- Zoom variável conforme reunião (in para detalhes, out para apresentação)
- Colapsar histórias concluídas para limpar visão

---

## Dicas e Truques

### Organização Visual

- Use cores consistentes (ex: azul = mobile, verde = web)
- Colapse histórias antigas para focar no presente/futuro
- Ajuste zoom conforme contexto (reunião, planejamento solo, etc)

### Performance

- Limite o número de histórias ativas (recomendado: até 10)
- Exclua histórias muito antigas (archive externo se necessário)
- Histórias colapsadas carregam mais rápido

### Planejamento

- Comece com fases padrão e ajuste com experiência
- Use drag para experimentar durações sem salvar
- Handoff como checkpoint, não como prazo rígido

### Integração Kanban

- Roadmap = planejamento macro (semanas/meses)
- Kanban = execução micro (dias/tarefas)
- Crie cards no Kanban para cada fase da história
- Vincule cards a tarefas do roadmap (campo opcional)

---

## Atalhos e Controles

### Teclado
- **Escape**: Fechar modais

### Mouse
- **Click**: Selecionar/editar
- **Drag horizontal**: Ajustar durações de fases
- **Scroll horizontal**: Navegar timeline
- **Click na seta**: Colapsar/expandir história

### Timeline
- **Zoom out**: Mais contexto, menos detalhe
- **Zoom in**: Menos contexto, mais detalhe
- **Sprint**: Referência visual, não funcional

---

## Limitações Conhecidas

- Histórias não podem ter gaps entre fases (sempre contínuas)
- Última fase de uma história não pode ser redimensionada por drag
- Datas não consideram feriados automaticamente
- Sem dependências formais entre histórias (apenas visual)
- Sem filtros avançados (MVP)

---

## Diferenças do Sistema Anterior

### Antes (Sistema de Fases)
- Fases fixas na lateral (Discovery, Ideação, Prototipação)
- Uma lista vertical de tarefas
- Fases compartilhadas por todo o projeto

### Agora (Sistema de Histórias)
- Múltiplas histórias horizontais
- Cada história tem suas próprias fases
- Fases internas ajustáveis por drag
- Múltiplas histórias simultâneas
- Zoom e sprint configuráveis

### Migração
- Dados antigos (phases, tasks) permanecem no banco
- Novo sistema é independente
- Você pode criar histórias do zero
- Sistema antigo não é mais acessível via interface

---

## Próximas Melhorias Possíveis

- [ ] Arrastar histórias para reordenar verticalmente
- [ ] Filtrar histórias por cor/status
- [ ] Dependências formais entre histórias
- [ ] Exportar roadmap como imagem
- [ ] Templates de histórias
- [ ] Duplicar histórias
- [ ] Feriados e calendário customizado
- [ ] Milestones globais (além de handoffs)
- [ ] Comentários em histórias
- [ ] Histórico de alterações

---

**Versão:** 2.0 (Design Stories)
**Data:** 05/01/2026
**Status:** ✅ Funcional
