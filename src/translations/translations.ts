export const translations = {
  en: {
    newLanding: {
      hero: {
        title: "Evaluate your design team's maturity",
        subtitle: "Discover your current maturity level and receive a personalized plan to improve operations, processes, quality, and strategic impact.",
        duration: "4–6 minutes",
        report: "Instant report",
        cta: "Start Diagnostic"
      },
      why: {
        title: "Why this diagnostic exists",
        text: "The maturity of a design team directly influences the quality of deliveries, collaboration with Product/Engineering, and design's ability to generate business impact. But few companies really know where they stand — and where to start evolving.\n\nThis diagnostic was created to help design teams gain clarity about their current level, identify blind spots, and receive a practical plan to advance to the next stage."
      },
      who: {
        title: "Who should answer",
        description: "This diagnostic is ideal for professionals who influence — or want to influence — the operation, quality, and strategy of the design team:",
        roles: [
          {
            title: "Heads / Managers of Design",
            description: "Assess team maturity to structure processes, rituals, and career development."
          },
          {
            title: "Product Designers (JR → Principal)",
            description: "Understand how their team operates today and how they can gain more clarity, predictability, and impact in day-to-day work."
          },
          {
            title: "UX Researchers",
            description: "Identify collaboration gaps, processes, and evidence within the product cycle."
          },
          {
            title: "PMs working closely with design",
            description: "Evaluate the efficiency of the PM–Design–Engineering flow and friction points in delivery."
          },
          {
            title: "Founders building their first team",
            description: "Know exactly where to start and how to evolve a small team without depending on a Head of Design."
          }
        ],
        note: "Teams of any size can respond — from 1 person to 50."
      },
      notes: {
        title: "Quick notes",
        items: [
          {
            title: "Confidential responses",
            description: "Your answers are confidential and used exclusively for product research."
          },
          {
            title: "No forced newsletters",
            description: "You'll only hear from me if you opt in as an early tester."
          },
          {
            title: "Based on real scenarios",
            description: "Please answer based on your actual team experience, not hypotheticals."
          }
        ]
      },
      footer: {
        research: {
          title: "Have a specific challenge on your team?",
          description: "Share your insights in our complementary research form.",
          cta: "Share Your Challenge"
        },
        tagline: "Design Ladder — DesignOps Research Project"
      }
    },
    landing: {
      hero: {
        title: "What's the biggest problem holding your design team back?",
        subtitle: "I'm collecting real challenges from design teams to understand what truly needs fixing. Share yours in a quick 3–4 minute form.",
        cta: "Share your challenge",
        subtitle2: "Want to stay in the loop? Just drop your email in the form."
      },
      what: {
        title: "What kind of challenges count?",
        collaboration: {
          title: "Collaboration & Alignment",
          description: "Handoffs with PM/dev, missing context, decisions lost in chat, last-minute scope changes."
        },
        operations: {
          title: "Operations & Processes",
          description: "No clear rituals, chaotic requests, lack of prioritization, design work invisible to the rest of the org."
        },
        quality: {
          title: "Quality, Impact & Growth",
          description: "Design debt piling up, inconsistent UI, no metrics, hard to show impact or justify headcount."
        }
      },
      faq: {
        title: "A few quick notes",
        confidential: {
          title: "Confidential responses",
          description: "Your responses are confidential and used solely for product research."
        },
        newsletter: {
          title: "No newsletter trap",
          description: "You only hear from me if you opt-in as an early tester."
        },
        real: {
          title: "Real humans only",
          description: "Please answer based on your actual team, not hypotheticals."
        }
      },
      footer: {
        tagline: "Design Ladder — DesignOps Research Project",
        language: "Language"
      }
    },
    form: {
      header: "Design Ladder",
      intro: {
        title: "A quick check on your design team's reality",
        subtitle: "Answer a few focused questions about how your design team works. It takes about 3–4 minutes and helps map real DesignOps problems.",
        required: "*All fields are required unless marked as optional."
      },
      problem: {
        label: "What's the most relevant problem your design team struggles with?",
        placeholder: "Describe what actually happens… meetings, tools, communication…",
        help: "The more concrete, the more useful."
      },
      outcome: {
        label: "What outcome would you like after solving this problem?",
        placeholder: "E.g. fewer context switches, clearer priorities, less rework…",
        help: "Think in terms of how the team's day-to-day would change."
      },
      frequency: {
        title: "Frequency & Team context",
        label: "How often does this problem occur?",
        placeholder: "Select frequency",
        options: {
          once: "Once in a while (a few times a year)",
          weekly: "Weekly (once or twice a week)",
          daily: "Daily (at least once a day)",
          multiple: "Multiple times a day (several times daily)"
        }
      },
      companySize: {
        label: "What's your company size?",
        placeholder: "Select company size",
        options: {
          "1-10": "1-10 employees",
          "11-50": "11-50 employees",
          "51-200": "51-200 employees",
          "201-1000": "201-1000 employees",
          "1000+": "1000+ employees"
        }
      },
      teamSize: {
        label: "How big is your team?",
        placeholder: "Select team size",
        options: {
          just_me: "Just me",
          "2-5": "2-5 people",
          "6-10": "6-10 people",
          "11-20": "11-20 people",
          "20+": "20+ people"
        }
      },
      budget: {
        label: "How much would your company be willing to pay for a solution like this?",
        placeholder: "Select budget range",
        options: {
          under_100: "Under $100/month",
          "100-500": "$100-500/month",
          "500-2000": "$500-2000/month",
          "2000-5000": "$2000-5000/month",
          "5000+": "$5000+/month",
          not_sure: "Not sure yet"
        }
      },
      role: {
        label: "What's your role?",
        placeholder: "Select your role",
        options: {
          designer: "Product Designer",
          lead: "Design Lead / Manager",
          director: "Design Director / VP",
          ops: "DesignOps / Operations",
          founder: "Founder / C-level",
          pm: "Product Manager",
          other: "Other"
        }
      },
      urgency: {
        label: "What is the urgency of resolving this problem?",
        placeholder: "Select urgency",
        options: {
          urgent: "Urgent (within weeks)",
          soon: "Soon (1-3 months)",
          this_year: "This year",
          exploring: "Just exploring options"
        }
      },
      contact: {
        title: "Contact & Opt-in",
        earlyTester: {
          label: "If we come up with a solution, would you be open to becoming an early tester?",
          yes: "Yes, I'd love to try it out",
          no: "No, just sharing feedback"
        },
        companyName: {
          label: "Company name"
        },
        email: {
          label: "Your email"
        }
      },
      submit: "Submit your insights",
      submitting: "Submitting...",
      success: {
        title: "Thanks for sharing.",
        message: "Your answers will directly influence what I build next for DesignOps teams.",
        messageEarlyTester: " I'll reach out when I have something to try.",
        back: "Back to home"
      },
      errors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email",
        selectOption: "Please select an option"
      },
      back: "Back",
      confirmBack: {
        title: "Leave without saving?",
        message: "You have unsaved changes. Are you sure you want to leave?",
        confirm: "Leave",
        cancel: "Stay"
      },
      submitError: "An error occurred. Please try again."
    },
    maturityForm: {
      title: "Design Team Maturity Diagnosis",
      subtitle: "Discover your team's maturity level and get personalized recommendations",
      back: "Back",
      submit: "Get My Results",
      submitting: "Calculating...",
      submitError: "An error occurred. Please try again.",
      sections: {
        contact: "Your Information",
        processes: "Design Processes",
        collaboration: "Collaboration with Product & Engineering",
        designSystem: "Design System & Documentation",
        research: "User Research & Quality",
        culture: "People, Career & Culture"
      },
      fields: {
        fullName: {
          label: "Full Name"
        },
        email: {
          label: "Email"
        },
        company: {
          label: "Company (optional)"
        },
        role: {
          label: "Role / Function",
          placeholder: "Select your role",
          options: [
            { value: "head_lead", label: "Head / Lead of Design" },
            { value: "product_designer", label: "Product Designer / UX / UI" },
            { value: "researcher", label: "Researcher" },
            { value: "ux_writer", label: "UX Writer / Content Designer" },
            { value: "product_manager", label: "Product Manager" },
            { value: "engineering", label: "Engineering / Tech Lead" },
            { value: "other", label: "Other" }
          ]
        }
      },
      questions: {
        q1: {
          text: "How does the design team organize its deliveries?",
          options: [
            { value: 1, label: "Each designer works their own way; no standard exists." },
            { value: 2, label: "We have some standards, but not everyone follows them." },
            { value: 3, label: "We use a common basic process for most projects." },
            { value: 4, label: "We have a clear, documented process that is regularly reviewed." },
            { value: 5, label: "Our process is solid, metrics-based, and adapted by context." }
          ]
        },
        q2: {
          text: "Does the team have structured rituals (critiques, reviews, retros, etc.)?",
          options: [
            { value: 1, label: "No formal rituals." },
            { value: 2, label: "We have sporadic rituals, without much discipline." },
            { value: 3, label: "We have some fixed rituals, but not always well executed." },
            { value: 4, label: "We have recurring rituals with good participation and records." },
            { value: 5, label: "Rituals are part of the official calendar and we evaluate their impact." }
          ]
        },
        q3: {
          text: "How does design participate in the process with Product and Engineering?",
          options: [
            { value: 1, label: "Design is only called to draw screens at the end." },
            { value: 2, label: "Design enters late, shortly before implementation." },
            { value: 3, label: "Design participates in discovery on some projects." },
            { value: 4, label: "Design frequently co-leads discovery with PM." },
            { value: 5, label: "Decisions are made based on design + engineering evidence." }
          ]
        },
        q4: {
          text: "How is communication and handoff between Design and Development?",
          options: [
            { value: 1, label: "Confusing deliveries, lots of rework." },
            { value: 2, label: "Minimally organized handoff, but with frequent failures." },
            { value: 3, label: "Regular handoff with few problems." },
            { value: 4, label: "Structured handoff with Design System and documentation." },
            { value: 5, label: "Continuous handoff, integrated with tools (Dev Mode, integrations, etc.)." }
          ]
        },
        q5: {
          text: "Does the team have a Design System?",
          options: [
            { value: 1, label: "We don't have a Design System." },
            { value: 2, label: "We only have a loose library in Figma." },
            { value: 3, label: "We have an initial Design System used in part of the products." },
            { value: 4, label: "We have a mature and documented Design System." },
            { value: 5, label: "Design System is governed, versioned, and integrated with code." }
          ]
        },
        q6: {
          text: "How does the team document design decisions (why things are the way they are)?",
          options: [
            { value: 1, label: "Almost nothing is documented." },
            { value: 2, label: "We only document in some specific projects." },
            { value: 3, label: "We document some important decisions." },
            { value: 4, label: "We have consistent documentation accessible to the team." },
            { value: 5, label: "Documentation is living, updated, and part of our workflow." }
          ]
        },
        q7: {
          text: "How often does the team conduct user research?",
          options: [
            { value: 1, label: "Never or almost never." },
            { value: 2, label: "Very rarely, without a defined method." },
            { value: 3, label: "With some regularity, depending on priority." },
            { value: 4, label: "Research is a standard part of discovery." },
            { value: 5, label: "We have continuous research, repository, and reuse learnings." }
          ]
        },
        q8: {
          text: "How is the quality of design deliveries ensured?",
          options: [
            { value: 1, label: "Depends on each designer's care." },
            { value: 2, label: "We use some informal checklists." },
            { value: 3, label: "We have regular design reviews." },
            { value: 4, label: "We have structured reviews with clear acceptance criteria." },
            { value: 5, label: "We have design QA with metrics, testing, and validation before launch." }
          ]
        },
        q9: {
          text: "Is there clarity of roles, levels, and career paths in design?",
          options: [
            { value: 1, label: "No clarity exists, everything is somewhat confusing." },
            { value: 2, label: "We have some clarity, but it's informal." },
            { value: 3, label: "We have a partial career ladder used in some evaluations." },
            { value: 4, label: "We have clear career ladder, active PDIs, and monitoring." },
            { value: 5, label: "We have a strong culture of continuous development, mentoring, and evidence." }
          ]
        },
        q10: {
          text: "How is design perceived in the company?",
          options: [
            { value: 1, label: "As 'who draws screens'." },
            { value: 2, label: "Important, but still very operational." },
            { value: 3, label: "Relevant partner for product decisions." },
            { value: 4, label: "Strong influence on roadmap and strategic decisions." },
            { value: 5, label: "Strategic pillar of the company, with a seat in business discussions." }
          ]
        },
        q11: {
          text: "What is the culture regarding design feedback and critique?",
          options: [
            { value: 1, label: "There's little to no culture of constructive feedback." },
            { value: 2, label: "Feedback happens but is often informal and inconsistent." },
            { value: 3, label: "Regular critiques with the team, but limited cross-functional participation." },
            { value: 4, label: "Strong feedback culture with cross-functional participation." },
            { value: 5, label: "Design critiques are strategic moments that influence company decisions." }
          ]
        }
      },
      errors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email"
      },
      confirmBack: {
        title: "Leave without saving?",
        message: "You have unsaved changes. Are you sure you want to leave?",
        confirm: "Leave",
        cancel: "Stay"
      }
    },
    maturityResult: {
      title: "Your Results Are Ready!",
      subtitle: "Here's your design team maturity diagnosis",
      back: "Back to Home",
      maturityScore: "maturity score",
      nextSteps: "Recommended Next Steps",
      cta: {
        title: "Ready to level up?",
        description: "Get in touch to learn how Design Ladder can help your team evolve.",
        button: "Get in Touch"
      },
      levels: {
        1: {
          title: "Level 1 – Initial (Chaotic)",
          description: "Design in your organization is basic or non-existent. There's generally no defined design process, and when there is a designer, their focus is only on creating visually attractive screens. Product decisions rarely consider research or user feedback.",
          characteristicsTitle: "Current State",
          characteristics: [
            "Lack of communication between design and other areas",
            "No user research or testing conducted",
            "Design is undervalued – seen only as 'making things pretty'",
            "Constant rework due to lack of process"
          ],
          nextSteps: [
            "Create a basic style guide to ensure visual consistency",
            "Include at least one user feedback session (even informal) before launches",
            "Schedule short meetings between designers and developers to align expectations",
            "Document what works and what doesn't in the product",
            "Establish basic communication channels between design and other teams"
          ]
        },
        2: {
          title: "Level 2 – Emergent (Connected)",
          description: "The company already recognizes the importance of UX/design to some extent. Specific practices emerge: defined personas, some occasional usability testing, and designers collaborating more closely with developers and PMs.",
          characteristicsTitle: "Current State",
          characteristics: [
            "Design initiatives are not yet consistent or comprehensive",
            "Lack of long-term vision for design",
            "Design is called upon only tactically",
            "Weak design culture – UX practices are first to be cut when projects tighten"
          ],
          nextSteps: [
            "Formalize rituals: make user testing a fixed step before each important release",
            "Align design with business objectives, presenting results in product metrics",
            "Invest in education: bring external training or content to improve team skills",
            "Consider hiring a Design Lead to guide the team",
            "Expand design influence beyond specific projects"
          ]
        },
        3: {
          title: "Level 3 – Structured",
          description: "The organization has an established design team with several designers and possibly an intermediate leader. Design processes are defined and standardized: UX/UI guidelines exist, component libraries (Design System) are beginning to take shape.",
          characteristicsTitle: "Current State",
          characteristics: [
            "Difficulty quantifying design impact on business",
            "UX efforts performed but not always measured or communicated",
            "Some compartmentalization: design team is efficient internally but needs to improve integration",
            "Challenge influencing high-level strategies"
          ],
          nextSteps: [
            "Implement UX metrics (NPS, conversion rate, user engagement) linked to design initiatives",
            "Adopt DesignOps practices for scalability: improve Design System with robust documentation",
            "Automate handoffs to development and incorporate quick post-launch feedback",
            "Align design to company OKRs to demonstrate value to executives",
            "Map how design activities contribute to larger goals"
          ]
        },
        4: {
          title: "Level 4 – Advanced",
          description: "Design is highly integrated into the organization. Decisions are driven by UX data and continuous research. There's complete formalization: design actively participates in product planning, a mature Design System is adopted by all teams.",
          characteristicsTitle: "Current State",
          characteristics: [
            "High maturity level but can use design more proactively for innovation",
            "Decisions based on UX evidence but could drive more strategic change",
            "Risk of excessive bureaucratization with many processes",
            "Need to maintain creativity and holistic vision"
          ],
          nextSteps: [
            "Elevate design to the heart of corporate strategy",
            "Involve design team in defining product roadmap and exploring new business opportunities",
            "Conduct design sprints for innovation and advanced exploratory research",
            "Integrate UX metrics even more deeply with business KPIs",
            "Promote experimentation culture: encourage bold pilots and prototypes with real users"
          ]
        },
        5: {
          title: "Level 5 – Strategic (Visionary)",
          description: "The highest maturity level represents organizations where design is part of the central strategy and future vision. All processes, tools, and teams are aligned around a user-centered design and continuous innovation mindset.",
          characteristicsTitle: "Current State",
          characteristics: [
            "Design is a clearly recognized competitive differentiator",
            "Predictive user research to anticipate latent needs",
            "Unified experiences across all brand touchpoints",
            "Active participation of design leaders in company strategic council"
          ],
          nextSteps: [
            "Maintain excellence: facilitate constant training programs and internal communities of practice",
            "Compare with market leaders through external benchmarks",
            "Document and share internal success cases to keep everyone aligned with the vision",
            "Explore design frontiers: new technologies, methods, and trends",
            "Monitor continuous evolution and signal any areas showing regression or advancement opportunities"
          ]
        }
      }
    }
  },
  pt: {
    newLanding: {
      hero: {
        title: "Avalie a maturidade do seu time de design",
        subtitle: "Descubra seu nível atual e receba um plano personalizado para evoluir operações, processos, qualidade e impacto.",
        duration: "4–6 minutos",
        report: "Relatório imediato",
        cta: "Iniciar Diagnóstico"
      },
      why: {
        title: "Por que este diagnóstico existe",
        text: "A maturidade do time de design influencia diretamente a qualidade das entregas, a colaboração com Produto/Engenharia e a capacidade do design gerar impacto no negócio. Mas poucas empresas sabem onde realmente estão — e por onde começar a evoluir.\n\nEste diagnóstico foi criado para ajudar equipes de design a obter clareza sobre seu nível atual, identificar pontos cegos e receber um plano prático para avançar para o próximo estágio."
      },
      who: {
        title: "Quem deve responder",
        description: "Este diagnóstico é ideal para profissionais que influenciam — ou querem influenciar — a operação, a qualidade e a estratégia do time de design:",
        roles: [
          {
            title: "Heads / Managers de Design",
            description: "Avaliam a maturidade do time para estruturar processos, rituais e desenvolvimento de carreira."
          },
          {
            title: "Product Designers (JR → Principal)",
            description: "Entendem como sua equipe opera hoje e como podem ganhar mais clareza, previsibilidade e impacto no dia a dia."
          },
          {
            title: "UX Researchers",
            description: "Identificam gaps de colaboração, processos e evidências dentro do ciclo de produto."
          },
          {
            title: "PMs que trabalham próximo ao design",
            description: "Avaliam a eficiência do fluxo PM–Design–Engenharia e pontos de fricção na entrega."
          },
          {
            title: "Fundadores construindo seu primeiro time",
            description: "Sabem exatamente por onde começar e como evoluir um time pequeno sem depender de um Head de Design."
          }
        ],
        note: "Times de qualquer tamanho podem responder — de 1 pessoa a 50."
      },
      notes: {
        title: "Algumas notas rápidas",
        items: [
          {
            title: "Respostas confidenciais",
            description: "Suas respostas são confidenciais e usadas exclusivamente para pesquisa de produto."
          },
          {
            title: "Sem newsletter forçada",
            description: "Você só recebe notícias minhas se optar por ser um testador inicial."
          },
          {
            title: "Baseado em experiência real",
            description: "Por favor, responda com base na sua equipe real, não em hipóteses."
          }
        ]
      },
      footer: {
        research: {
          title: "Tem algum desafio específico no seu time?",
          description: "Compartilhe seus insights no nosso formulário de pesquisa complementar.",
          cta: "Compartilhar Desafio"
        },
        tagline: "Design Ladder — Projeto de Pesquisa em DesignOps"
      }
    },
    landing: {
      hero: {
        title: "Qual é o maior problema dentro do seu time de design?",
        subtitle: "Estou coletando desafios reais de equipes de design para entender o que realmente precisa ser resolvido. Compartilhe o seu em um formulário rápido de 3–4 minutos.",
        cta: "Compartilhe seu desafio",
        subtitle2: "Quer ficar por dentro? Apenas deixe seu email no formulário."
      },
      what: {
        title: "Que tipo de desafios contam?",
        collaboration: {
          title: "Colaboração e Alinhamento",
          description: "Handoffs com PM/dev, falta de contexto, decisões perdidas no chat, mudanças de escopo de última hora."
        },
        operations: {
          title: "Operações e Processos",
          description: "Sem rituais claros, solicitações caóticas, falta de priorização, trabalho de design invisível para o resto da org."
        },
        quality: {
          title: "Qualidade, Impacto e Crescimento",
          description: "Dívida de design acumulando, UI inconsistente, sem métricas, difícil mostrar impacto ou justificar headcount."
        }
      },
      faq: {
        title: "Algumas notas rápidas",
        confidential: {
          title: "Respostas confidenciais",
          description: "Suas respostas são confidenciais e usadas exclusivamente para pesquisa de produto."
        },
        newsletter: {
          title: "Sem armadilha de newsletter",
          description: "Você só recebe notícias minhas se optar por ser um testador inicial."
        },
        real: {
          title: "Apenas humanos reais",
          description: "Por favor, responda com base na sua equipe real, não em hipóteses."
        }
      },
      footer: {
        tagline: "Design Ladder — Projeto de Pesquisa em DesignOps",
        language: "Idioma"
      }
    },
    form: {
      header: "Design Ladder",
      intro: {
        title: "Um check rápido sobre a realidade do seu time de design",
        subtitle: "Responda algumas perguntas focadas sobre como sua equipe de design trabalha. Leva cerca de 3-4 minutos e ajuda a mapear problemas reais de DesignOps.",
        required: "*Todos os campos são obrigatórios, exceto quando marcados como opcionais."
      },
      problem: {
        label: "Qual é o problema mais relevante que sua equipe de design enfrenta?",
        placeholder: "Descreva o que realmente acontece… reuniões, ferramentas, comunicação…",
        help: "Quanto mais concreto, mais útil."
      },
      outcome: {
        label: "Que resultado você gostaria de ter depois de resolver este problema?",
        placeholder: "Ex: menos trocas de contexto, prioridades mais claras, menos retrabalho…",
        help: "Pense em termos de como o dia a dia da equipe mudaria."
      },
      frequency: {
        title: "Frequência e contexto da equipe",
        label: "Com que frequência este problema ocorre?",
        placeholder: "Selecione a frequência",
        options: {
          once: "De vez em quando (algumas vezes por ano)",
          weekly: "Semanalmente (uma ou duas vezes por semana)",
          daily: "Diariamente (pelo menos uma vez por dia)",
          multiple: "Várias vezes por dia (diversas vezes ao dia)"
        }
      },
      companySize: {
        label: "Qual o tamanho da sua empresa?",
        placeholder: "Selecione o tamanho da empresa",
        options: {
          "1-10": "1-10 funcionários",
          "11-50": "11-50 funcionários",
          "51-200": "51-200 funcionários",
          "201-1000": "201-1000 funcionários",
          "1000+": "1000+ funcionários"
        }
      },
      teamSize: {
        label: "Qual o tamanho da sua equipe?",
        placeholder: "Selecione o tamanho da equipe",
        options: {
          just_me: "Só eu",
          "2-5": "2-5 pessoas",
          "6-10": "6-10 pessoas",
          "11-20": "11-20 pessoas",
          "20+": "20+ pessoas"
        }
      },
      budget: {
        label: "Quanto sua empresa estaria disposta a pagar por uma solução assim?",
        placeholder: "Selecione a faixa de orçamento",
        options: {
          under_100: "Menos de $100/mês",
          "100-500": "$100-500/mês",
          "500-2000": "$500-2000/mês",
          "2000-5000": "$2000-5000/mês",
          "5000+": "$5000+/mês",
          not_sure: "Ainda não sei"
        }
      },
      role: {
        label: "Qual é sua função?",
        placeholder: "Selecione sua função",
        options: {
          designer: "Product Designer",
          lead: "Design Lead / Manager",
          director: "Design Director / VP",
          ops: "DesignOps / Operações",
          founder: "Fundador / C-level",
          pm: "Product Manager",
          other: "Outro"
        }
      },
      urgency: {
        label: "Qual é a urgência de resolução desse problema?",
        placeholder: "Selecione a urgência",
        options: {
          urgent: "Urgente (em semanas)",
          soon: "Em breve (1-3 meses)",
          this_year: "Este ano",
          exploring: "Apenas explorando opções"
        }
      },
      contact: {
        title: "Contato e Participação",
        earlyTester: {
          label: "Se criarmos uma solução, você estaria aberto a se tornar um testador inicial?",
          yes: "Sim, adoraria experimentar",
          no: "Não, só compartilhando feedback"
        },
        companyName: {
          label: "Nome da empresa"
        },
        email: {
          label: "Seu email"
        }
      },
      submit: "Enviar seus insights",
      submitting: "Enviando...",
      success: {
        title: "Obrigado por compartilhar.",
        message: "Suas respostas influenciarão diretamente o que construirei a seguir para equipes de DesignOps.",
        messageEarlyTester: " Entrarei em contato quando tiver algo para testar.",
        back: "Voltar à página inicial"
      },
      errors: {
        required: "Este campo é obrigatório",
        invalidEmail: "Por favor, insira um email válido",
        selectOption: "Por favor, selecione uma opção"
      },
      back: "Voltar",
      confirmBack: {
        title: "Sair sem salvar?",
        message: "Você tem alterações não salvas. Tem certeza que deseja sair?",
        confirm: "Sair",
        cancel: "Ficar"
      },
      submitError: "Ocorreu um erro. Por favor, tente novamente."
    },
    maturityForm: {
      title: "Diagnóstico de Maturidade do Time de Design",
      subtitle: "Descubra o nível de maturidade do seu time e receba recomendações personalizadas",
      back: "Voltar",
      submit: "Ver Meu Resultado",
      submitting: "Calculando...",
      submitError: "Ocorreu um erro. Por favor, tente novamente.",
      sections: {
        contact: "Suas Informações",
        processes: "Processos de Design",
        collaboration: "Colaboração com Produto e Engenharia",
        designSystem: "Design System e Documentação",
        research: "Pesquisa de Usuário e Qualidade",
        culture: "Pessoas, Carreira e Cultura"
      },
      fields: {
        fullName: {
          label: "Nome Completo"
        },
        email: {
          label: "Email"
        },
        company: {
          label: "Empresa (opcional)"
        },
        role: {
          label: "Cargo / Função",
          placeholder: "Selecione seu cargo",
          options: [
            { value: "head_lead", label: "Head / Lead de Design" },
            { value: "product_designer", label: "Product Designer / UX / UI" },
            { value: "researcher", label: "Researcher" },
            { value: "ux_writer", label: "UX Writer / Content Designer" },
            { value: "product_manager", label: "Product Manager" },
            { value: "engineering", label: "Engineering / Tech Lead" },
            { value: "other", label: "Outro" }
          ]
        }
      },
      questions: {
        q1: {
          text: "Como o time de design organiza suas entregas?",
          options: [
            { value: 1, label: "Cada designer trabalha do seu jeito; não existe padrão." },
            { value: 2, label: "Temos alguns padrões, mas não são seguidos por todos." },
            { value: 3, label: "Usamos um processo básico comum para grande parte dos projetos." },
            { value: 4, label: "Temos um processo claro, documentado e revisado periodicamente." },
            { value: 5, label: "Nosso processo é sólido, baseado em métricas e adaptado por contexto." }
          ]
        },
        q2: {
          text: "O time possui rituais estruturados (critiques, reviews, retros, etc.)?",
          options: [
            { value: 1, label: "Nenhum ritual formal." },
            { value: 2, label: "Temos rituais esporádicos, sem muita disciplina." },
            { value: 3, label: "Temos alguns rituais fixos, mas nem sempre bem executados." },
            { value: 4, label: "Temos rituais recorrentes, com boa participação e registros." },
            { value: 5, label: "Rituais são parte do calendário oficial e avaliamos seu impacto." }
          ]
        },
        q3: {
          text: "Como o design participa do processo com Produto e Engenharia?",
          options: [
            { value: 1, label: "Design é chamado só para desenhar telas, no final." },
            { value: 2, label: "Design entra tardiamente, pouco antes da implementação." },
            { value: 3, label: "Design participa do discovery em alguns projetos." },
            { value: 4, label: "Design co-lidera o discovery com PM com frequência." },
            { value: 5, label: "Decisões são tomadas com base em evidências de design + engenharia." }
          ]
        },
        q4: {
          text: "Como é a comunicação e o handoff entre Design e Desenvolvimento?",
          options: [
            { value: 1, label: "Entregas confusas, muito retrabalho." },
            { value: 2, label: "Hand-off minimamente organizado, mas com falhas frequentes." },
            { value: 3, label: "Hand-off regular, com poucos problemas." },
            { value: 4, label: "Hand-off estruturado, com uso de Design System e documentação." },
            { value: 5, label: "Hand-off contínuo, integrado às ferramentas (Dev Mode, integrações, etc.)." }
          ]
        },
        q5: {
          text: "O time possui um Design System?",
          options: [
            { value: 1, label: "Não temos Design System." },
            { value: 2, label: "Temos só uma biblioteca solta no Figma." },
            { value: 3, label: "Temos um Design System inicial, usado em parte dos produtos." },
            { value: 4, label: "Temos um Design System maduro e documentado." },
            { value: 5, label: "Design System é governado, versionado e integrado ao código." }
          ]
        },
        q6: {
          text: "Como o time documenta decisões de design (por quê as coisas são como são)?",
          options: [
            { value: 1, label: "Quase nada é documentado." },
            { value: 2, label: "Só documentamos em alguns projetos específicos." },
            { value: 3, label: "Documentamos uma parte das decisões importantes." },
            { value: 4, label: "Temos documentação consistente acessível ao time." },
            { value: 5, label: "Documentação é viva, atualizada e parte do nosso fluxo de trabalho." }
          ]
        },
        q7: {
          text: "Com que frequência o time realiza pesquisa com usuários?",
          options: [
            { value: 1, label: "Nunca ou quase nunca." },
            { value: 2, label: "Muito raramente, sem método definido." },
            { value: 3, label: "Com alguma regularidade, dependendo da prioridade." },
            { value: 4, label: "Pesquisa é parte padrão do discovery." },
            { value: 5, label: "Temos pesquisa contínua, repositório e reaproveitamos aprendizados." }
          ]
        },
        q8: {
          text: "Como a qualidade das entregas de design é garantida?",
          options: [
            { value: 1, label: "Depende do cuidado de cada designer." },
            { value: 2, label: "Usamos alguns checklists informais." },
            { value: 3, label: "Temos revisões regulares de design." },
            { value: 4, label: "Temos revisões estruturadas com critérios de aceitação claros." },
            { value: 5, label: "Temos QA de design com métricas, testes e validação antes de lançar." }
          ]
        },
        q9: {
          text: "Existe clareza de papéis, níveis e caminhos de carreira em design?",
          options: [
            { value: 1, label: "Não existe clareza, tudo é meio confuso." },
            { value: 2, label: "Temos alguma clareza, mas é informal." },
            { value: 3, label: "Temos um career ladder parcial, usado em algumas avaliações." },
            { value: 4, label: "Temos career ladder claro, PDIs ativos e acompanhamento." },
            { value: 5, label: "Temos uma cultura forte de desenvolvimento contínuo, mentoria e evidências." }
          ]
        },
        q10: {
          text: "Como o design é percebido na empresa?",
          options: [
            { value: 1, label: "Como 'quem desenha tela'." },
            { value: 2, label: "Importante, mas ainda muito operacional." },
            { value: 3, label: "Parceiro relevante para decisões de produto." },
            { value: 4, label: "Influência forte em roadmap e decisões estratégicas." },
            { value: 5, label: "Pilar estratégico da empresa, com assento em discussões de negócio." }
          ]
        },
        q11: {
          text: "Qual é a cultura sobre feedback e crítica de design?",
          options: [
            { value: 1, label: "Há pouca ou nenhuma cultura de feedback construtivo." },
            { value: 2, label: "Feedback acontece, mas costuma ser informal e inconsistente." },
            { value: 3, label: "Críticas regulares com o time, mas com pouca participação cross-funcional." },
            { value: 4, label: "Forte cultura de feedback com participação cross-funcional." },
            { value: 5, label: "Críticas de design são momentos estratégicos que influenciam decisões da empresa." }
          ]
        }
      },
      errors: {
        required: "Este campo é obrigatório",
        invalidEmail: "Por favor, insira um email válido"
      },
      confirmBack: {
        title: "Sair sem salvar?",
        message: "Você tem alterações não salvas. Tem certeza que deseja sair?",
        confirm: "Sair",
        cancel: "Ficar"
      }
    },
    maturityResult: {
      title: "Seu Resultado Está Pronto!",
      subtitle: "Aqui está o diagnóstico de maturidade do seu time de design",
      back: "Voltar à Página Inicial",
      maturityScore: "de maturidade",
      nextSteps: "Próximos Passos Recomendados",
      cta: {
        title: "Pronto para evoluir?",
        description: "Entre em contato para saber como a Design Ladder pode ajudar seu time a evoluir.",
        button: "Entrar em Contato"
      },
      levels: {
        1: {
          title: "Nível 1 – Inicial (Caótico)",
          description: "O design na sua organização é básico ou inexistente. Geralmente não há um processo definido de design; quando existe um designer, seu foco está apenas em criar telas atraentes visualmente. Decisões de produto raramente consideram pesquisas ou feedback do usuário.",
          characteristicsTitle: "Estado Atual",
          characteristics: [
            "Falta de comunicação entre design e outras áreas",
            "Não se realiza pesquisa de usuário ou testes",
            "O design é subvalorizado – visto apenas como 'deixar bonito'",
            "Retrabalho constante por falta de processo"
          ],
          nextSteps: [
            "Criar um guia de estilos básico para garantir consistência visual",
            "Incluir pelo menos um feedback de usuário (mesmo informal) antes de lançamentos",
            "Agendar reuniões curtas entre designers e desenvolvedores para alinhar expectativas",
            "Documentar o que funciona e o que não funciona no produto",
            "Estabelecer canais básicos de comunicação entre design e outras equipes"
          ]
        },
        2: {
          title: "Nível 2 – Emergente (Conectado)",
          description: "A empresa já reconhece a importância de UX/design em alguma medida. Surgem práticas pontuais: personas definidas, alguns testes de usabilidade ocasionais, e designers colaborando mais de perto com desenvolvedores e PMs.",
          characteristicsTitle: "Estado Atual",
          characteristics: [
            "As iniciativas de design ainda não são consistentes nem abrangentes",
            "Falta visão de longo prazo para o design",
            "O design é acionado apenas taticamente",
            "Cultura de design frágil – práticas de UX são as primeiras a serem cortadas"
          ],
          nextSteps: [
            "Formalizar rituais: tornar testes com usuários uma etapa fixa antes de cada release importante",
            "Alinhar design com objetivos de negócio, apresentando resultados em métricas de produto",
            "Investir em educação: trazer treinamentos externos ou conteúdo para aprimorar habilidades do time",
            "Considerar a contratação de um Lead de Design para guiar a equipe",
            "Expandir a influência do design além de projetos específicos"
          ]
        },
        3: {
          title: "Nível 3 – Estruturado",
          description: "A organização possui um time de design estabelecido, possivelmente com vários designers e talvez um líder intermediário. Processos de design estão definidos e padronizados: existem guidelines de UX/UI, bibliotecas de componentes (Design System) começando a tomar forma.",
          characteristicsTitle: "Estado Atual",
          characteristics: [
            "Dificuldade em quantificar o impacto do design no negócio",
            "Esforços de UX realizados, mas nem sempre medidos ou comunicados",
            "Certa compartimentalização: time de design é eficiente internamente mas precisa melhorar integração",
            "Desafio em influenciar estratégias de alto nível"
          ],
          nextSteps: [
            "Implementar métricas de UX (NPS, taxa de conversão, engajamento) vinculadas às iniciativas de design",
            "Adotar práticas de DesignOps para escalabilidade: aprimorar o Design System com documentação robusta",
            "Automatizar handoffs para desenvolvimento e incorporar feedbacks rápidos pós-lançamento",
            "Alinhar design a OKRs da empresa para demonstrar valor aos executivos",
            "Mapear como as atividades de design contribuem para metas maiores"
          ]
        },
        4: {
          title: "Nível 4 – Avançado",
          description: "O design está altamente integrado na organização. Decisões são dirigidas por dados de UX e pesquisa contínua. Há uma formalização completa: design participa ativamente do planejamento de produtos, existe um Design System maduro adotado por todas as equipes.",
          characteristicsTitle: "Estado Atual",
          characteristics: [
            "Nível alto de maturidade mas pode usar design mais proativamente para inovação",
            "Decisões baseadas em evidências de UX mas poderiam conduzir mais mudanças estratégicas",
            "Risco de burocratização excessiva com muitos processos",
            "Necessidade de manter criatividade e visão holística"
          ],
          nextSteps: [
            "Elevar o design ao coração da estratégia corporativa",
            "Envolver o time de design na definição de roadmap de produtos e exploração de novas oportunidades de negócio",
            "Realizar design sprints para inovação e pesquisas exploratórias avançadas",
            "Integrar métricas de UX ainda mais profundamente com KPIs de negócio",
            "Promover cultura de experimentação: incentivar pilotos e protótipos ousados com usuários reais"
          ]
        },
        5: {
          title: "Nível 5 – Estratégico (Visionário)",
          description: "O nível mais alto de maturidade representa organizações onde o design é parte da estratégia central e da visão de futuro da empresa. Todos os processos, ferramentas e equipes estão alinhados em torno de uma mentalidade de design centrado no usuário e na inovação contínua.",
          characteristicsTitle: "Estado Atual",
          characteristics: [
            "O design é um diferencial competitivo claramente reconhecido",
            "Pesquisas de usuário preditivas para antecipar necessidades latentes",
            "Experiências unificadas em todos os pontos de contato da marca",
            "Participação ativa de líderes de design no conselho estratégico da empresa"
          ],
          nextSteps: [
            "Manter a excelência: facilitar programas de treinamento constantes e comunidades de prática internas",
            "Comparar com líderes de mercado através de benchmarks externos",
            "Documentar e compartilhar cases de sucesso internos para manter todos alinhados à visão",
            "Explorar fronteiras do design: novas tecnologias, métodos e tendências",
            "Monitorar evolução contínua e sinalizar áreas com regressão ou oportunidade de avanço"
          ]
        }
      }
    }
  }
};

export type TranslationKey = keyof typeof translations;
