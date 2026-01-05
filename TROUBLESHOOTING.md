# Troubleshooting - Problemas de Login e Preview

## Status Atual

### Problema 1: Login não funciona ✅ DIAGNOSTICADO

**Sintoma:** Não consegue criar conta ou fazer login

**Diagnóstico:**
- O banco de dados está vazio (0 usuários)
- O email `hugo.ranirere@gmail.com` não existe no sistema
- Isso indica que o signup não está completando OU confirmação de email está habilitada

**Causa Provável:**
O Supabase tem **confirmação de email HABILITADA** por padrão. Quando você cria uma conta:
1. O usuário é criado no banco
2. Mas a sessão NÃO é criada
3. Você precisa clicar no link de confirmação enviado por email
4. Só depois disso você consegue fazer login

**Solução:**

#### Opção 1: Desabilitar Confirmação de Email (RECOMENDADO para MVP)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **Providers**
4. Clique em **Email**
5. **DESMARQUE** "Enable email confirmations"
6. Clique em **Save**
7. Tente criar conta novamente

#### Opção 2: Configurar SMTP para enviar emails

Se você quer manter a confirmação de email:
1. Configure um provedor SMTP (Gmail, SendGrid, Mailgun)
2. O usuário receberá email de confirmação
3. Após confirmar, poderá fazer login

### Problema 2: Preview não carrega ✅ DIAGNOSTICADO

**Sintoma:** Erros de WebSocket no console

**Diagnóstico:**
```
WebSocket connection failed: Error during WebSocket handshake: Unexpected response code: 400
"wss://localhost:undefined/?token=..." cannot be parsed as a URL
```

**Causa:**
Estes são erros do **Hot Module Replacement (HMR)** do Vite. Não afetam a funcionalidade do app.

**Soluções:**

1. **Ignorar os erros** - São apenas avisos do dev server, não afetam o app
2. **Recarregar a página** - Geralmente resolve
3. **Limpar cache do navegador**
4. **Testar em modo anônimo**

## Como Testar Agora

### Teste 1: Verificar Autenticação

Abra o arquivo `test-auth.html` em um navegador:

```bash
# Se você tem um servidor local
open test-auth.html
# OU navegue para: file:///path/to/test-auth.html
```

Este teste vai:
- ✅ Verificar conexão com Supabase
- ✅ Tentar criar uma conta de teste
- ✅ Mostrar se email confirmation está habilitado
- ✅ Tentar fazer login
- ✅ Verificar se a sessão foi criada

### Teste 2: Console do Navegador

1. Abra o app no navegador
2. Pressione **F12** para abrir DevTools
3. Vá na aba **Console**
4. Tente criar uma conta
5. Você verá logs detalhados:

```
[AuthContext] signUp iniciado para: teste@example.com
[AuthContext] signUp resposta: { hasUser: true, hasSession: false, error: undefined }
[AuthContext] Usuário criado mas sem sessão - confirmação de email pode estar habilitada
[SignUp] Conta criada com sucesso!
```

**Interpretação:**
- `hasUser: true, hasSession: false` = Email confirmation ESTÁ HABILITADO
- `hasUser: true, hasSession: true` = Email confirmation DESABILITADO (ideal)

### Teste 3: Verificar no Banco

Execute no console do Supabase ou usando SQL:

```sql
-- Ver todos os usuários
SELECT
    id,
    email,
    created_at,
    email_confirmed_at,
    confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Ver usuários pendentes de confirmação
SELECT email, created_at
FROM auth.users
WHERE email_confirmed_at IS NULL;
```

## Correção Rápida (Se email confirmation estiver habilitado)

### Para usuários já criados mas não confirmados:

```sql
-- Confirmar manualmente o usuário
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'hugo.ranirere@gmail.com';
```

### Verificar se funcionou:

```sql
SELECT email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'hugo.ranirere@gmail.com';
```

Agora tente fazer login novamente.

## Melhorias Implementadas

### Logging Detalhado

Adicionamos `console.log` em todos os pontos críticos:

**AuthContext:**
- ✅ Início do signUp
- ✅ Resposta do Supabase (user, session, error)
- ✅ Detecção de email confirmation
- ✅ Login com detalhes

**SignUp Component:**
- ✅ Tentativa de criar conta
- ✅ Tratamento de erros detalhado
- ✅ Redirecionamento automático

**Login Component:**
- ✅ Tentativa de login
- ✅ Tratamento de erros melhorado

### Tratamento de Erros Melhorado

Agora mostramos mensagens mais claras:
- ❌ "Este email já está cadastrado"
- ❌ "Email não confirmado. Verifique sua caixa de entrada."
- ❌ "Email ou senha incorretos"
- ❌ "Erro: [mensagem específica]"

### Redirecionamento Automático

Após criar conta com sucesso:
1. Mostra mensagem de sucesso
2. Aguarda 1.5 segundos
3. Redireciona automaticamente para `#app`

## Próximos Passos

1. **Verificar configuração do Supabase:**
   - Abra o Dashboard
   - Desabilite email confirmation

2. **Testar criação de conta:**
   - Use `test-auth.html` OU
   - Use a interface do app com DevTools aberto (F12)

3. **Verificar logs no console:**
   - Deve mostrar `hasSession: true`
   - Se mostrar `hasSession: false`, email confirmation ainda está habilitado

4. **Reportar resultado:**
   - Se ainda não funcionar, copie os logs do console
   - Informe qual mensagem de erro aparece

## Arquivos Modificados

- ✅ `src/contexts/AuthContext.tsx` - Logging detalhado
- ✅ `src/components/SignUp.tsx` - Melhor tratamento de erro
- ✅ `src/components/Login.tsx` - Já tinha bom tratamento
- ✅ `test-auth.html` - Ferramenta de teste standalone
- ✅ `AUTH_SETUP.md` - Guia completo de configuração

## Comandos Úteis

```bash
# Rebuild do projeto
npm run build

# Ver logs do dev server
npm run dev

# Verificar erros TypeScript
npm run typecheck

# Executar linter
npm run lint
```

## Contato

Se os problemas persistirem após:
1. ✅ Desabilitar email confirmation
2. ✅ Verificar logs do console
3. ✅ Testar com `test-auth.html`

Forneça:
- Screenshots dos erros
- Logs completos do console
- Resultado da query SQL de usuários
