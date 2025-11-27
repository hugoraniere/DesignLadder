# Como Adicionar Subdomínio no Netlify e Provisionar SSL

## Erro Atual
```
NET::ERR_CERT_COMMON_NAME_INVALID
```

Isso acontece porque o certificado SSL atual só cobre `designladder.site`, mas não cobre `admin.designladder.site`.

## Solução: Adicionar Domain Alias no Netlify

### Passo a Passo

1. **Acesse o Netlify Dashboard**
   - Vá para: https://app.netlify.com
   - Faça login na sua conta

2. **Selecione seu site**
   - Clique no site do Design Ladder

3. **Vá para Domain Settings**
   - No menu lateral, clique em **Domain management** ou **Domain settings**

4. **Adicione o Domain Alias**
   - Procure pela seção **Domain aliases** ou **Custom domains**
   - Clique no botão **Add domain alias** ou **Add custom domain**
   - Digite: `admin.designladder.site`
   - Clique em **Verify** (o Netlify verificará se o DNS está configurado)
   - Clique em **Add domain** para confirmar

5. **Aguarde o Provisionamento do SSL**
   - O Netlify automaticamente solicitará um certificado SSL via Let's Encrypt
   - Esse processo geralmente leva de 1 a 10 minutos
   - Você verá um status "Provisioning certificate" ou similar
   - Quando estiver pronto, mudará para "HTTPS enabled" com um ícone de cadeado verde

6. **Verifique o SSL**
   - Após alguns minutos, acesse: https://admin.designladder.site
   - O navegador não deve mostrar mais o erro de certificado
   - Você deve ver o cadeado verde na barra de endereços

## Verificação do DNS (já configurado)

Você mencionou que já criou o registro CNAME:
```
Type:  CNAME
Name:  admin
Value: designladder.site
```

Isso está correto! ✓

## Troubleshooting

### Se o Netlify disser "DNS verification failed"

Verifique se o DNS já propagou:
- Acesse: https://dnschecker.org/#CNAME/admin.designladder.site
- Deve mostrar o CNAME apontando para `designladder.site`
- Se não aparecer, aguarde mais alguns minutos pela propagação DNS

### Se o SSL não provisionar após 15 minutos

1. Remova o domain alias no Netlify
2. Aguarde 2 minutos
3. Adicione novamente
4. Isso força o Netlify a tentar provisionar o SSL novamente

### Se ainda não funcionar

Verifique se você tem alguma configuração de DNS adicional:
- CAA records que possam bloquear Let's Encrypt
- Proxy/CDN (como Cloudflare) em modo proxy (laranja)
  - Se estiver usando Cloudflare, deixe o registro em modo "DNS only" (cinza)

## Como Deve Ficar Após a Configuração

No Netlify, você verá:

```
Primary domain:
  designladder.site
  ✓ HTTPS enabled

Domain aliases:
  admin.designladder.site
  ✓ HTTPS enabled
```

## Certificado SSL

O Netlify usa **Let's Encrypt** e cria um certificado que cobre:
- `designladder.site`
- `www.designladder.site` (se configurado)
- `admin.designladder.site`

Cada domain alias recebe seu próprio certificado SSL automaticamente.

## Tempo de Provisionamento

- **Adição do domain alias**: Imediato
- **Verificação DNS**: 1-5 minutos (se DNS já propagou)
- **Provisionamento SSL**: 1-10 minutos
- **Total**: ~10-15 minutos do início ao fim

## Resultado Final

Após completar esses passos:

✅ https://designladder.site → Landing page (SSL válido)
✅ https://admin.designladder.site → Admin login (SSL válido)

Ambos os domínios terão certificados SSL válidos e o erro `NET::ERR_CERT_COMMON_NAME_INVALID` será resolvido.
