# Configuração de Autenticação - Supabase

## Problema Comum: Email Confirmation

Por padrão, o Supabase requer confirmação de email para novos usuários. Isso significa que após criar uma conta, o usuário precisa clicar em um link enviado por email antes de poder fazer login.

Para este produto, recomendamos **desabilitar** a confirmação de email para uma experiência mais fluida.

## Como Desabilitar Email Confirmation

### Passo 1: Acessar o Dashboard do Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication** → **Providers**

### Passo 2: Configurar Email Provider

1. Clique em **Email** na lista de providers
2. Role até a seção **"Email Confirmation"**
3. **DESMARQUE** a opção **"Enable email confirmations"**
4. Clique em **Save**

### Passo 3: Configurar Auto Confirm (Opcional mas Recomendado)

Se você quiser que os usuários sejam automaticamente confirmados sem precisar de email:

1. Vá em **Authentication** → **Email Templates**
2. Em **Confirm signup**, você pode ver o template de email
3. Como desabilitamos a confirmação, este email não será mais enviado

## Verificar se Está Funcionando

### Teste Manual

1. Abra o app e clique em "Acessar App"
2. Clique em "Criar conta"
3. Preencha:
   - Nome: Teste
   - Email: teste@example.com
   - Senha: senha123456
   - Confirmar senha: senha123456
4. Clique em "Criar conta"
5. Se a confirmação estiver **desabilitada**: você será redirecionado automaticamente para o dashboard
6. Se a confirmação estiver **habilitada**: você verá uma mensagem de sucesso mas não conseguirá fazer login até confirmar o email

### Verificar no Console do Navegador

Abra o DevTools (F12) e vá na aba Console. Se houver erro de autenticação, você verá mensagens como:
- `Email not confirmed`
- `User not found`

## Alternativa: Habilitar Email Confirmation

Se você **quiser** manter a confirmação de email (mais seguro para produção):

### Modificar o Código

Você precisará atualizar o componente `SignUp.tsx` para mostrar uma mensagem diferente:

```typescript
// Após signUp bem-sucedido
if (!error) {
  if (data.user && !data.session) {
    // Email confirmation está habilitado
    setSuccess(true);
    setMessage('Conta criada! Verifique seu email para confirmar.');
  } else {
    // Email confirmation está desabilitado
    setSuccess(true);
    setMessage('Conta criada com sucesso!');
    // Redirecionar para dashboard
  }
}
```

### Configurar SMTP

Para enviar emails, você precisa configurar um provedor SMTP:

1. Vá em **Project Settings** → **Auth**
2. Em **SMTP Settings**, configure:
   - Host SMTP (ex: smtp.gmail.com)
   - Port (ex: 587)
   - Email remetente
   - Senha

Provedores recomendados:
- **SendGrid** (gratuito até 100 emails/dia)
- **Mailgun** (gratuito até 1000 emails/mês)
- **Gmail SMTP** (para testes)

## Solução de Problemas

### "Email ou senha incorretos" ao fazer login

**Causa**: Usuário criado mas email não foi confirmado

**Solução**:
1. Desabilite email confirmation (passos acima)
2. Delete o usuário atual no Supabase Dashboard
3. Crie a conta novamente

### Usuário não aparece na tabela auth.users

**Causa**: Erro na criação ou email confirmation pendente

**Solução**:
```sql
-- Verificar usuários pendentes
SELECT email, email_confirmed_at, created_at
FROM auth.users
WHERE email_confirmed_at IS NULL;

-- Para confirmar manualmente (apenas para testes)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'seu@email.com';
```

### "User already registered" mas não consegue fazer login

**Causa**: Conta existe mas email não foi confirmado

**Solução**:
```sql
-- Verificar status do usuário
SELECT id, email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'hugo.ranirere@gmail.com';

-- Se email_confirmed_at for NULL, confirmar manualmente:
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'hugo.ranirere@gmail.com';
```

## Configuração Recomendada para MVP

Para desenvolvimento e MVP inicial:

1. ✅ **Desabilitar** email confirmation
2. ✅ Permitir cadastro automático sem verificação
3. ✅ Login imediato após cadastro
4. ❌ Não configurar SMTP ainda
5. ❌ Não usar magic links ainda

Para produção:

1. ✅ **Habilitar** email confirmation
2. ✅ Configurar SMTP com provedor confiável
3. ✅ Customizar templates de email
4. ✅ Adicionar rate limiting
5. ✅ Configurar redirects corretos

## Comandos Úteis

### Verificar usuários existentes

```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

### Deletar usuário de teste

```sql
-- CUIDADO: Isso deleta permanentemente o usuário e todos os dados associados
DELETE FROM auth.users WHERE email = 'teste@example.com';
```

### Confirmar todos os usuários pendentes (apenas para dev)

```sql
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

## Contato e Suporte

Se você continuar tendo problemas com autenticação:

1. Verifique o console do navegador (F12)
2. Verifique os logs do Supabase Dashboard
3. Tente criar usuário em modo anônimo do navegador
4. Limpe cookies e cache

## Status Atual

Para o email `hugo.ranirere@gmail.com`:
- Usuário não existe no banco de dados
- Provável que a conta foi criada mas email não foi confirmado
- Ou houve erro na criação

**Ação recomendada**: Desabilitar email confirmation e criar conta novamente.
