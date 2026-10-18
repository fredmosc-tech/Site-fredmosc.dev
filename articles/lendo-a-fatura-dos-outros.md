---
title: "Lendo a fatura dos outros: 14 meses como arquiteto de pré-vendas na Magalu Cloud"
excerpt: "O que faz um arquiteto de pré-vendas, as armadilhas que a fatura de nuvem esconde e por que a IA acelera o braçal, mas não assina a proposta."
date: "2026-10-18"
category: "Relato"
tags: ["Pré-vendas", "Arquitetura cloud", "Migração", "FinOps", "Carreira"]
---

# Lendo a fatura dos outros: 14 meses como arquiteto de pré-vendas na Magalu Cloud

Toda segunda-feira começava do mesmo jeito. Um executivo de contas mandava uma mensagem com um arquivo anexo e uma pergunta curta: "dá pra trazer isso pra gente?". O arquivo podia ser a fatura detalhada de uma empresa na AWS, um export de custos do Azure, o inventário de um datacenter VMware ou o desenho de arquitetura de uma startup que roda em três nuvens ao mesmo tempo.

Por quase 14 meses, responder essa pergunta com seriedade foi o meu trabalho na Magalu Cloud. Neste texto eu conto como é esse dia a dia, o que aprendi e as armadilhas que encontrei pelo caminho. Se você trabalha com infraestrutura ou desenvolvimento e já se perguntou o que faz um arquiteto de soluções em pré-vendas, este é o relato de quem estava na trincheira.

## O que faz um arquiteto de pré-vendas

Pense no mecânico que faz o orçamento antes de abrir o motor. Ele precisa ouvir o barulho, olhar o histórico do carro, entender como o dono dirige e, só então, dizer quanto vai custar e quanto tempo vai levar. Se errar para baixo, a oficina perde dinheiro. Se errar para cima, perde o cliente. Se prometer uma peça que não existe, perde a reputação.

O arquiteto de pré-vendas faz isso com infraestrutura de nuvem. Ele fica entre o time comercial, que conhece o cliente e a negociação, e o time técnico do cliente, que conhece o próprio ambiente melhor do que ninguém. O papel dele é traduzir um ambiente que existe hoje numa proposta de arquitetura que funcione no destino, com custo defensável e riscos ditos em voz alta.

Na prática, cada oportunidade passava por algumas etapas: entender por que o cliente quer migrar, ler o ambiente atual, desenhar o destino, precificar, apresentar e responder às perguntas difíceis. Os entregáveis eram a planilha de recursos no modelo oficial, o relatório técnico, a apresentação executiva e, quando a decisão merecia registro, um ADR.

## O de-para como raio-x

No centro de tudo isso existe uma etapa que o mercado chama de de-para: mapear cada recurso da origem para o equivalente no destino. Uma instância de 8 vCPUs e 32 GB de RAM na AWS vira qual flavor? Um banco gerenciado com alta disponibilidade vira qual topologia? Um cluster Kubernetes com nós ARM vira o quê numa nuvem x86?

Muita gente olha para o de-para como uma tarefa de planilha. Eu aprendi a enxergar como o raio-x da proposta. Sem ele, o arquiteto desenha no escuro. Com ele bem feito, aparecem as perguntas que importam: esse banco precisa mesmo de alta disponibilidade? Esse cluster está superdimensionado? Esse serviço tem equivalente gerenciado ou vai precisar de uma solução open source operada pelo cliente?

Algumas regras guiavam meu mapeamento. Memória igual ou maior que a origem vinha primeiro, depois CPU, depois o menor custo. Eu preferia sempre o encaixe mais justo, porque superdimensionar "por segurança" é a forma mais rápida de transformar uma proposta competitiva numa proposta cara. E a família de instâncias de maior desempenho de CPU só entrava com justificativa concreta: carga comprovadamente intensiva, origem em instâncias dedicadas ou exigência de licença.

O raio-x mostra o osso. A arquitetura é o que o médico decide fazer com ele.

## Quatro decisões que me ensinaram mais do que muito curso

Nenhum caso foi igual ao outro. Escolhi quatro situações, sem identificar clientes, que mostram o tipo de decisão que esse trabalho exige.

**A GPU que não existia.** Um cliente rodava inferência de IA em GPUs de um modelo que não fazia parte do catálogo da MGC. Tínhamos uma GPU mais potente, com o dobro de memória de vídeo. A comparação ingênua seria máquina por máquina, o que deixaria a proposta cara. Em vez disso, refiz a conta pelo que realmente limita esse tipo de carga: quanto do modelo cabe na memória da GPU. Montei cenários por tamanho de modelo e mostrei que, dependendo do caso, menos máquinas fariam o mesmo trabalho. A proposta virou uma pergunta técnica certa para o cliente responder, em vez de um número chutado.

**O cliente que não queria Kubernetes.** Uma empresa pequena rodava containers num orquestrador simples, com um time enxuto. A arquitetura "moderna" seria migrar tudo para Kubernetes. Escolhi o contrário: manter em máquinas virtuais, respeitando a maturidade operacional do time. Arquitetura boa é a que o cliente consegue operar na terça-feira às três da manhã.

**SAP fora do escopo.** Num inventário de datacenter on-premises, parte do ambiente era SAP. Forçar um encaixe teria deixado a proposta mais bonita e o projeto mais arriscado. Declarei essas cargas como fora do escopo, com a justificativa por escrito, e mapeei com cuidado só as máquinas com sistema operacional confirmado no inventário. Dizer "isso não" com clareza também é entregar arquitetura.

**Três cenários para uma decisão comercial.** Num cluster grande de busca, a dúvida era qual família de instâncias usar. Era uma decisão que dependia do apetite do cliente por desempenho e custo, não só de técnica. Montei três cenários lado a lado, do mais econômico ao de maior desempenho, com um híbrido no meio. O discurso foi escolhido na conversa, com os números prontos na mesa.

## As armadilhas da fatura (e a pressa, que é a maior delas)

Pré-venda tem um relógio próprio. Várias oportunidades correm em paralelo, cada uma com o prazo definido pela negociação, não pela complexidade do ambiente. Uma fatura de milhões de linhas pode chegar na quinta com reunião marcada para a segunda. Nesse ritmo, as armadilhas mais perigosas não são as difíceis. São as discretas, aquelas que passam batido quando o olho está correndo.

Billing de nuvem é cheio delas. Nenhuma tem a ver com saber ou não saber arquitetura: tem a ver com o jeito como cada provedor organiza os próprios dados. Estas quatro eu conheci de perto, e cada uma virou regra escrita.

**O sinal trocado.** Linhas de crédito e de custo às vezes convivem na mesma categoria, e uma delas, de transferência de dados, entrou na conta com o sinal invertido. Quando o número não fechou, refiz o material inteiro e publiquei uma versão nova que substituía a anterior de forma explícita, dizendo o que tinha mudado e por quê. Corrigir às claras custa um pouco de orgulho e paga em confiança.

**A mesma despesa, contada várias vezes.** Alguns exports trazem o mesmo gasto em vários níveis de agregação: por conta, por consolidação, pelo total da fatura. Somar tudo sem filtrar o tipo de registro multiplica o total. Hoje, a primeira coisa que faço com uma fatura nova é reconciliar o total com o valor que o cliente efetivamente pagou. Se não bate, nada mais anda.

**Máquinas que não param quietas.** Em ambientes com autoscaling agressivo, nós sobem e descem o dia inteiro. Contar IDs de instância infla o inventário. O dimensionamento correto vem da série de uso por hora de CPU e memória, não da contagem de máquinas que passaram por ali durante o mês.

**Custo zero não é serviço ausente.** Um serviço coberto por free tier aparece na fatura sem valor, mas continua em uso. Afirmar que o cliente não usa algo que ele usa derruba a credibilidade da proposta inteira. Passei a varrer todos os serviços da fatura e a distinguir "não aparece" de "aparece sem custo".

Dessas armadilhas nasceu o protocolo que passei a aplicar em todo entregável. Antes de gerar qualquer planilha ou apresentação, auditar todos os números contra a fonte, sem exceção. Separar o que foi medido do que é hipótese, e marcar a hipótese com a palavra "provavelmente", no texto e no slide. E desconfiar de economia alta demais: quando o percentual parece bom demais, a primeira pergunta é onde está a pegadinha.

O mais valioso foi o destino dessas regras. Elas não ficaram num caderno meu. Viraram documentação do time e, depois, etapa obrigatória da ferramenta que a gente construiu. Trabalhar num lugar onde um ajuste vira processo, e não vira caça ao culpado, faz toda a diferença na velocidade com que um time amadurece.

## Quando o argumento vai além do preço

Existe uma tentação na pré-venda: achar que todo caso se resolve com um percentual de economia. Muitas vezes a economia é real e expressiva. Em outras, os números ficam próximos, e aí o trabalho do arquiteto é mostrar o valor que não cabe numa célula de planilha.

Para empresas brasileiras, isso inclui coisas muito concretas. Pagar em real elimina a exposição ao câmbio, que pode virar a conta de um mês para o outro. Rodar a aplicação no Brasil reduz a latência para o usuário brasileiro. Ter suporte em português, no mesmo fuso, muda a experiência num incidente. E manter os dados sob jurisdição nacional é um tema que pesa na conversa com diretoria e jurídico.

Também aprendi a falar abertamente sobre o que cada nuvem tem e não tem. Nenhum provedor tem tudo. Quando um serviço gerenciado da origem não tinha equivalente direto, eu apresentava o contorno com tecnologia open source madura e deixava claro quem passaria a operar aquele componente. O cliente decide melhor quando enxerga o quadro inteiro, e uma proposta transparente constrói uma relação que dura além da assinatura do contrato.

## MigrAI: automatizar o braçal, manter o julgamento

Um de-para bem feito, com auditoria e relatório, chegava a levar uma semana de trabalho. Com a demanda crescendo, isso virou gargalo. Daí nasceu o MigrAI, uma ferramenta que eu liderei e construí junto com o time de arquitetura de pré-vendas da MGC.

Ela lê o material do cliente, faz o mapeamento para o catálogo da Magalu Cloud, precifica com a API pública de preços e gera a planilha, o relatório técnico e a apresentação prontos para a revisão do arquiteto. O tempo por cliente caiu de até uma semana para no máximo dois dias, inclusive em casos com faturas de milhões de linhas.

A decisão de arquitetura mais importante do MigrAI foi definir onde a IA entra e onde ela não entra. O modelo de linguagem só atua onde existe ambiguidade de texto, como interpretar o nome de uma linha de fatura que ninguém padronizou. Todo o resto é código determinístico em Python. Preço nunca sai de um modelo. Uma proposta de alto valor não pode depender de uma alucinação, e a pergunta "por que esse flavor?" precisa ter uma resposta que se repete toda vez que a análise roda.

As armadilhas da seção anterior entraram aqui como código. A auditoria é etapa obrigatória do pipeline: se os números não batem com a fonte, o processo para. O arquiteto revisa tudo antes de qualquer coisa chegar ao cliente, e cada análise ainda passava por três ou quatro rodadas de refino humano. O modelo de linguagem passou a rodar em GPUs da própria Magalu Cloud, para que os dados do cliente não saíssem do ambiente da empresa. Construir a ferramenta na mesma nuvem que a gente vende foi o melhor argumento de todos.

A lição que eu levo do MigrAI é simples de dizer: a IA acelera o trabalho braçal, mas a assinatura na proposta continua sendo do arquiteto.

## Para quem quer ser arquiteto de pré-vendas

Se você está pensando em seguir esse caminho, deixo quatro conselhos de quem passou por ele.

1. **Aprenda a ler fatura.** Billing de nuvem é um idioma próprio, cheio de níveis de agregação, créditos, descontos e compromissos de capacidade. Quem lê bem uma fatura entende o ambiente do cliente antes da primeira reunião.
2. **Pergunte o motivo antes de abrir o arquivo.** Por que o cliente quer migrar? Custo, latência, câmbio, soberania, insatisfação com o suporte? A resposta muda a arquitetura e muda o discurso.
3. **Diga as lacunas em voz alta.** O cliente vai descobrir de qualquer forma. É muito melhor que ele descubra pela sua proposta.
4. **Transforme cada armadilha em checklist.** Prazo curto é regra, não exceção. O que protege você nesse ritmo é um processo que confere o que o olho cansado deixa passar.

## Fechando

Esses 14 meses na Magalu Cloud me mostraram que arquitetura de pré-vendas é, no fundo, um trabalho de credibilidade. Ela se constrói com número auditável, com escolhas que respeitam a realidade do cliente e com honestidade sobre o que funciona e o que não funciona. Ver uma nuvem brasileira competindo de igual para igual com os grandes provedores, caso a caso, ao lado de um time que topou transformar aprendizado em ferramenta, foi das experiências mais ricas da minha carreira.

Se você trabalha com nuvem, me conta: qual foi a fatura mais difícil que você já teve que ler?
