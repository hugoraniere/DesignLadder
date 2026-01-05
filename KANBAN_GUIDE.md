# Guia do Kanban

## Visão Geral

O Kanban foi adicionado ao produto para gerenciar tarefas menores, operacionais e rápidas que complementam o roadmap macro (Gantt). Cada projeto possui seu próprio Kanban independente.

## Acessando o Kanban

1. Acesse um projeto
2. No topo da página, você verá duas abas: **Roadmap** e **Kanban**
3. Clique na aba **Kanban** para alternar para a visualização do quadro

## Primeira Vez: Escolhendo um Template

Na primeira vez que você acessar o Kanban de um projeto, será solicitado que escolha um template:

### Templates Disponíveis

1. **Clássico** - Estrutura tradicional de fluxo de trabalho
   - Backlog
   - Em andamento
   - Concluído

2. **Tempo** - Organização temporal de tarefas
   - Hoje
   - Amanhã
   - Essa semana
   - Em breve

**Importante:** O template é apenas o estado inicial. Todas as colunas são 100% editáveis depois.

## Gerenciando Colunas

### Criar Nova Coluna

1. Role até o final do quadro
2. Clique no botão **"+ Nova coluna"**
3. Digite o nome da coluna
4. Pressione **Enter** ou clique em **"Adicionar"**

### Renomear Coluna

1. Clique no ícone de três pontos (⋮) no canto da coluna
2. Selecione **"Renomear"**
3. Digite o novo nome
4. Pressione **Enter** ou clique no ícone ✓

### Excluir Coluna

1. Clique no ícone de três pontos (⋮) no canto da coluna
2. Selecione **"Excluir coluna"**
3. Confirme a ação

**Atenção:** Não é possível excluir se houver apenas 1 coluna restante.

### Reordenar Colunas

- Arraste e solte as colunas para reordená-las (funcionalidade disponível via drag-and-drop nativo do navegador)

## Gerenciando Cards (Tarefas)

### Criar Card Rápido

**Método 1 - Botão:**
1. Clique em **"+ Adicionar card"** na coluna desejada
2. Digite o título
3. Pressione **Enter** ou clique em **"Adicionar"**

**Método 2 - Inline:**
1. Clique em **"+ Adicionar card"**
2. Digite o título e pressione **Enter**

### Mover Cards Entre Colunas

- **Arraste e solte** o card para outra coluna
- O card será movido e sua posição atualizada automaticamente

### Reordenar Cards Dentro da Coluna

- **Arraste e solte** o card para cima ou para baixo dentro da mesma coluna
- A ordem será salva automaticamente

### Editar Card Detalhadamente

1. Clique no card para abrir o painel lateral de edição
2. No painel lateral você pode editar:
   - **Título*** (obrigatório)
   - **Descrição** (opcional)
   - **Prioridade**: Baixa / Média / Alta
   - **Data de vencimento** (opcional)
   - **Tags** (opcional)

### Adicionar Tags

1. Abra o painel de edição do card
2. Na seção "Tags", digite o nome da tag
3. Pressione **Enter** ou clique no botão **+**
4. Para remover, clique no **X** ao lado da tag

### Excluir Card

1. Abra o painel de edição do card
2. Clique no botão vermelho **"Excluir"**
3. Confirme a ação

## Indicadores Visuais nos Cards

### Prioridade
- **Verde** = Baixa
- **Amarelo** = Média
- **Vermelho** = Alta

### Data de Vencimento
- Exibida com ícone de calendário
- **Vermelho com alerta** = Tarefa atrasada

### Vinculação com Roadmap
- Ícone de link azul indica que o card está vinculado a uma tarefa do roadmap

### Tags
- Aparecem como badges cinzas no card

## Integração com Roadmap (Opcional)

Cards do Kanban podem ser vinculados a tarefas macro do Roadmap:

- Quando vinculado, o card mostra o badge "Roadmap" em azul
- Isso é apenas uma referência visual - não sincroniza datas automaticamente
- Útil para conectar tarefas operacionais às entregas maiores

## Trocando de Template

Se você quiser começar do zero com um novo template:

1. Clique em **"Trocar template"** no topo do Kanban
2. Escolha o novo template
3. **Atenção:** Isso substituirá todas as colunas e cards existentes

## Boas Práticas

### Para Tarefas Rápidas e Operacionais
- Use o Kanban para tarefas de curto prazo (dias/semanas)
- Mantenha cards simples e acionáveis
- Use tags para categorizar (ex: "bug", "design", "dev")

### Para Planejamento Macro
- Use o Roadmap (Gantt) para planejamento de longo prazo
- Defina fases e atividades maiores
- Estabeleça dependências e sprints

### Workflow Recomendado
1. Crie o roadmap macro no Gantt
2. Quebre atividades grandes em tarefas menores no Kanban
3. Vincule cards do Kanban às tarefas do Roadmap quando relevante
4. Mova cards pelo Kanban conforme o trabalho progride

## Atalhos e Dicas

- **Enter** = Confirmar criação/edição rápida
- **Escape** = Cancelar criação/edição
- **Arrastar e soltar** = Mover cards e reordenar
- **Clicar no card** = Abrir edição detalhada
- **Número na coluna** = Contador de cards

## Exemplo de Uso

### Cenário: Projeto de Design de App Mobile

**Roadmap (Gantt):**
- Discovery (2 semanas)
- Ideação (1 semana)
- Prototipação (3 semanas)

**Kanban - Template "Clássico":**

**Backlog:**
- Pesquisar apps concorrentes
- Criar personas
- Mapear jornada do usuário

**Em andamento:**
- Entrevistar 5 usuários
- Analisar dados de analytics

**Concluído:**
- Kickoff do projeto
- Definir objetivos

Cada tarefa do Kanban pode estar vinculada à fase "Discovery" do Roadmap, criando uma conexão visual entre micro e macro.

## Suporte Técnico

- **Schema do banco**: `kanban_columns` e `kanban_cards`
- **RLS habilitado**: Apenas o dono do projeto pode acessar/modificar
- **Cascade delete**: Deletar projeto remove Kanban automaticamente
- **Positions automáticas**: Sistema mantém ordenação sequencial

## Estrutura de Dados

### Coluna (kanban_columns)
```
- id: uuid
- project_id: uuid
- name: text
- position: integer
- created_at, updated_at
```

### Card (kanban_cards)
```
- id: uuid
- column_id: uuid
- title: text (obrigatório)
- description: text (opcional)
- priority: 'low' | 'medium' | 'high'
- due_date: date (opcional)
- tags: text[] (opcional)
- position: integer
- linked_roadmap_task_id: uuid (opcional)
- created_at, updated_at
```

## Limitações Conhecidas

- Não há sincronização automática de datas entre Kanban e Roadmap
- Drag-and-drop funciona melhor em desktop
- Tags são texto livre (sem autocomplete por enquanto)
- Não há filtros ou busca avançada (MVP)

## Roadmap Futuro (Possíveis Melhorias)

- [ ] Filtrar cards por tag, prioridade, data
- [ ] Busca de cards
- [ ] Notificações de prazo
- [ ] Sincronização de datas com roadmap
- [ ] Anexos nos cards
- [ ] Comentários nos cards
- [ ] Atribuição de cards a membros da equipe
- [ ] Histórico de movimentações
- [ ] Templates customizados salvos

---

**Versão:** 1.0
**Data:** 05/01/2026
**Status:** ✅ Funcional
