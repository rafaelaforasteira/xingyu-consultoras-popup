# xingyu-consultoras-popup

Projeto inicial do pop-up de consultoras da Xingyu.

## Objetivo

Exibir um modal de atendimento com rodízio circular de consultoras, direcionamento individual para WhatsApp e base para futura integração com a LinkPage da Xingyu.

## Estado atual

- Demo funcional do modal.
- Rodízio Round Robin no backend em memória.
- Endpoint de health check.
- Endpoint de eventos de clique.
- Números de WhatsApp estão como placeholders e precisam ser substituídos antes de produção.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5178`.

## Próximos passos

1. Persistir o rodízio em SQLite para torná-lo global e resiliente a reinícios.
2. Registrar analytics em banco.
3. Capturar UTMs e referrer.
4. Fazer a segunda passagem visual comparando diretamente com a LP oficial da Xingyu.
5. Adicionar testes automatizados.
6. Empacotar o widget para integração na página oficial.
