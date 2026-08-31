(function initialiseWorkStudiesContent(global) {
  "use strict";

  const OUTCOMES = Object.freeze({
    1: "1. investigates a range of work environments",
    2: "2. examines different types of work and skills for employment",
    3: "3. analyses employment options and strategies for career management",
    4: "4. assesses pathways for further education, training and life planning",
    5: "5. communicates and uses technology effectively",
    6: "6. applies self-management and teamwork skills",
    7: "7. utilises strategies to plan, organise and solve problems",
    8: "8. assesses influences on people’s working lives",
    9: "9. evaluates personal and social influences on individuals and groups"
  });

  const optionIds = ["a", "b", "c", "d"];
  const correctPositions = [1, 3, 0, 2, 1, 0, 3, 2, 0, 2];

  function aq(prompt, answer, rationale, distractors) {
    if (!Array.isArray(distractors) || distractors.length !== 3) {
      throw new Error(`Application question requires three distractors: ${prompt}`);
    }
    return { prompt, answer, rationale, distractors };
  }

  function arrangeQuestion(sectionId, number, prompt, correct, distractors, rationale, theoryAnchor) {
    const correctPosition = correctPositions[number - 1];
    const arranged = [...distractors];
    arranged.splice(correctPosition, 0, correct);
    const options = arranged.map((option, index) => ({
      id: optionIds[index],
      text: option.text,
      feedback: option.feedback
    }));
    return {
      id: `${sectionId}-Q${String(number).padStart(2, "0")}`,
      prompt,
      options,
      correctOptionId: optionIds[correctPosition],
      rationale,
      theoryAnchor
    };
  }

  function buildQuestions(section) {
    const theoryAnchor = `${section.id.toLowerCase()}-theory`;
    const vocabularyQuestions = section.vocabulary.map((entry, index, vocabulary) => {
      const distractors = [1, 2, 3].map((offset) => vocabulary[(index + offset) % vocabulary.length]);
      return arrangeQuestion(
        section.id,
        index + 1,
        `Which description best matches “${entry.term}” in this section?`,
        {
          text: entry.meaning,
          feedback: `Correct. ${entry.term} means ${entry.meaning}`
        },
        distractors.map((other) => ({
          text: other.meaning,
          feedback: `That describes ${other.term}, not ${entry.term}. Revisit the vocabulary and explanation at ${theoryAnchor}.`
        })),
        `${entry.term} is used here to mean ${entry.meaning}`,
        theoryAnchor
      );
    });

    const applicationQuestions = section.applicationQuestions.map((question, index) =>
      arrangeQuestion(
        section.id,
        index + 6,
        question.prompt,
        {
          text: question.answer,
          feedback: `Correct. ${question.rationale}`
        },
        question.distractors.map(([text, feedback]) => ({ text, feedback })),
        question.rationale,
        theoryAnchor
      )
    );

    return [...vocabularyQuestions, ...applicationQuestions];
  }

  function createSection(section) {
    if (section.vocabulary.length !== 5 || section.applicationQuestions.length !== 5) {
      throw new Error(`${section.id} must define five vocabulary terms and five application checks.`);
    }
    return {
      id: section.id,
      title: section.title,
      learningIntention: section.learningIntention,
      successCriteria: section.successCriteria,
      theoryParagraphs: section.theoryParagraphs,
      workedExample: section.workedExample,
      vocabulary: section.vocabulary,
      misconception: section.misconception,
      appliedActivity: section.appliedActivity,
      visual: section.visual,
      mediaAlternative: section.mediaAlternative,
      questions: buildQuestions(section),
      longResponse: section.longResponse
    };
  }

  function outcomes(...numbers) {
    return numbers.map((number) => OUTCOMES[number]);
  }

  global.WORK_STUDIES_CONTENT = {
    schemaVersion: "1.0",
    courseId: "years-11-12-work-studies",
    sourceMapId: "work-studies-source-map-v1.0",
    evidenceLabel: "Formative learning evidence",
    outcomeDefinitions: OUTCOMES,
    modules: {
      C00: {
        moduleId: "C00",
        title: "Core: My Working Life",
        outcomes: outcomes(1, 2, 3, 4, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "C00-S01",
            title: "Work in contemporary Australia",
            learningIntention: "Understand how work environments, employment patterns and wider change shape people’s working lives.",
            successCriteria: [
              "I can distinguish work environments and employment types without treating one pathway as best for everyone.",
              "I can explain how technology, economic conditions and social expectations can change work.",
              "I can use evidence about a person and an opportunity to make a balanced comparison."
            ],
            theoryParagraphs: [
              "Work includes more than a permanent paid job. People contribute through full-time, part-time, casual and contract employment, self-employment, unpaid caring, volunteering, study-linked work and work completed in the home or community. A work environment includes the physical or digital setting, the people and relationships, the purpose of the organisation, its expectations and the conditions under which tasks are completed. Understanding these differences matters because the same skill can be used in very different settings, and the same person may move among several types of work across a lifetime.",
              "Contemporary working life is shaped by interacting influences. Technology can redesign tasks and create new roles while reducing demand for others. Economic expansion or downturn can affect vacancies, hours and security. Laws, community expectations, global connections, demographic change and environmental pressures can also influence how and where people work. A sound judgement separates a broad trend from a guaranteed personal outcome. It asks what is changing, who is affected, what evidence supports the claim and which skills or pathways could help a person respond.",
              "Education, training, experience and standard of living are connected, but not in a simple one-step formula. Qualifications may open access to some occupations; workplace, community and volunteering experiences may build evidence of transferable skills; and income can support choices about housing, transport and further learning. However, pay is only one part of working life. Conditions, purpose, wellbeing, relationships, stability and opportunities to learn also affect whether work is sustainable and satisfying. Career exploration therefore compares a whole pattern of benefits, demands and possible next steps."
            ],
            workedExample: {
              title: "Comparing three early work pathways",
              context: "Mia is comparing a school-based traineeship, casual weekend retail work and regular volunteering at a community kitchen. She wants income now, customer-service experience and a possible pathway into community services.",
              analysis: "The casual role offers immediate income and customer contact, while the traineeship combines structured learning with workplace experience. Volunteering is unpaid but may provide credible evidence of reliability, teamwork and service. A balanced comparison checks hours, training, supervision, travel, conditions and the evidence each pathway could produce. Mia could combine options only if the total commitments remain realistic; no single option automatically meets every goal."
            },
            vocabulary: [
              { term: "work environment", meaning: "the setting, people, purpose, conditions and relationships in which work occurs" },
              { term: "labour market", meaning: "the changing supply of workers and demand for workers across occupations and locations" },
              { term: "employment type", meaning: "the arrangement under which work is performed, such as casual, part-time, full-time, contract or self-employment" },
              { term: "transferable skill", meaning: "a capability that can be applied in more than one role or setting" },
              { term: "standard of living", meaning: "the material conditions and resources available to support a person’s everyday life" }
            ],
            misconception: {
              claim: "Only paid employment counts as meaningful work experience.",
              correction: "Unpaid caring, volunteering, school, community and enterprise experiences can develop and demonstrate workplace skills when the evidence is specific and honest."
            },
            appliedActivity: {
              id: "ALA-C00-S01",
              title: "Work landscape comparison",
              prompt: "Choose three contrasting work environments. Compare their purpose, people, likely employment arrangements, useful skills, benefits and demands. Finish with one evidence-based conclusion about who each environment may suit.",
              evidence: "A one-page comparison matrix plus a 100-word conclusion that names the evidence used."
            },
            visual: {
              id: "VIS-C00-S01",
              file: "assets/visuals/c00-s01.webp",
              alt: "A realistic montage showing a trainee in a workshop, a retail worker serving a customer, a remote worker on a video call and a community volunteer preparing food.",
              purpose: "Show that contemporary work spans different settings, relationships and paid or unpaid arrangements."
            },
            mediaAlternative: {
              title: "Read a changing-work case study",
              before: "Predict two forces that might change a familiar occupation over the next five years.",
              during: "Mark each change as technological, economic, social, legal or environmental and note who is affected.",
              after: "Write one cautious conclusion that distinguishes evidence from prediction."
            },
            applicationQuestions: [
              aq("Which comparison gives the strongest picture of a work environment?", "Its purpose, people, conditions, tasks and relationships", "A work environment is broader than a building or job title; it includes how work is organised and experienced.", [["Only the street address", "Location is relevant, but it does not explain the people, purpose or conditions."], ["Only the employee’s wage", "Pay is one condition, not a complete account of the environment."], ["Only the organisation’s logo", "Branding does not show how work is organised or experienced."]]),
              aq("A headline says automation will remove an occupation completely. What is the best first response?", "Check the evidence, timeframe and which tasks are changing", "Careful analysis tests a broad claim before applying it to a whole occupation or person.", [["Assume every worker will lose their job immediately", "That turns a prediction into a certainty and ignores different tasks and timeframes."], ["Ignore technology because people will always work", "Technology can reshape tasks even when an occupation continues."], ["Choose a career only because it currently uses no technology", "Most work changes; adaptability is stronger than trying to avoid all change."]]),
              aq("Which evidence best demonstrates a transferable skill from volunteering?", "A supervisor’s example of the student organising a roster and resolving a clash", "Specific evidence shows what the student did, the context and the skill that can transfer.", [["The statement ‘I helped sometimes’", "This is too vague to show the action or skill."], ["A list of every volunteer organisation in Australia", "A broad list does not demonstrate the student’s own capability."], ["A claim that unpaid work is always better than paid work", "The value depends on purpose and evidence; one arrangement is not always superior."]]),
              aq("Why should a pathway comparison include conditions and wellbeing as well as income?", "A sustainable working life depends on several interacting benefits and demands", "Income matters, but hours, travel, relationships, purpose, learning and wellbeing also shape sustainability.", [["Because income has no importance at all", "Income is important; the point is to avoid treating it as the only factor."], ["Because the highest-paid role always has the worst conditions", "That is an unsupported generalisation."], ["Because every person values exactly the same conditions", "Priorities differ across people and life stages."]]),
              aq("Which conclusion correctly challenges the claim that only paid jobs build employability?", "A community project can build employability when the person records specific responsibilities, actions and results", "Relevant, verifiable evidence can come from paid or unpaid settings.", [["Any unpaid activity proves every workplace skill", "Evidence still needs to be specific and relevant."], ["Paid work never develops transferable skills", "Paid work can develop strong evidence too; the claim reverses the original error."], ["Employers are required to treat every experience as identical", "Experiences differ in relevance, quality and evidence."]])
            ],
            longResponse: {
              id: "C00-S01-LR01",
              prompt: "Evaluate how two major changes in contemporary Australia could affect the working life of a young person, then recommend a practical response.",
              higherOrderVerb: "evaluate",
              scaffoldPrompts: [
                "Identify the two changes and explain the evidence or reasoning behind each.",
                "Analyse one opportunity and one challenge created by each change.",
                "Compare the likely effects on skills, pathways, conditions and wellbeing.",
                "Recommend a response and justify why it is realistic for the person described."
              ],
              successCriteria: [
                "Uses the concepts of work environment, labour market and transferable skills accurately.",
                "Balances opportunities and challenges before reaching a justified recommendation.",
                "Avoids unsupported certainty and connects the recommendation to evidence."
              ],
              theoryAnchors: ["C00-S01-theory", "C00-S01-example"]
            }
          }),
          createSection({
            id: "C00-S02",
            title: "Self-knowledge, pathways and career decisions",
            learningIntention: "Use self-knowledge and pathway evidence to make realistic, revisable career decisions.",
            successCriteria: [
              "I can distinguish interests, values, attributes, skills and achievements.",
              "I can compare pathways by checking requirements, supports, costs and evidence.",
              "I can turn an aspiration into sequenced, realistic actions."
            ],
            theoryParagraphs: [
              "Career decisions become stronger when self-knowledge is specific. Interests describe what attracts attention; values describe what matters; personal attributes describe patterns of behaviour; skills describe what a person can do; and achievements provide evidence of performance. These categories overlap but are not interchangeable. Saying ‘I am good with people’ is a starting claim. Naming a situation, action, response and result turns it into useful evidence that can be compared with the requirements of education, training or work.",
              "A career pathway is a sequence of possible steps rather than one guaranteed ladder. Pathways may include school subjects, vocational education and training, university, community learning, entry-level work, apprenticeships or traineeships, volunteering and later retraining. Comparison should check entry requirements, time, cost, location, mode of study, support, work conditions and what successful completion makes possible. Reliable decisions use current source information and distinguish a formal requirement from a helpful preference.",
              "Goals connect aspiration to action. A useful goal is clear enough to guide effort, realistic in its context and broken into smaller steps that can be monitored. Career planning also identifies supports: people who can provide advice, networks that can reveal opportunities, resources that reduce barriers and evidence that shows progress. The plan belongs to the learner, but it should be tested against facts and reviewed as circumstances, interests or opportunities change. Changing a plan after learning more is responsible career management, not failure."
            ],
            workedExample: {
              title: "Turning an interest into a tested pathway",
              context: "Jay enjoys digital design and has made posters for a school event. He is considering a university degree, a vocational course and an entry-level print-shop role, but he has not checked their requirements.",
              analysis: "Jay first separates interest from evidence: the posters show some design and communication capability, but not every industry skill. He then checks current entry requirements, course content, costs, travel and portfolio expectations for each pathway. His next steps are to improve a small portfolio, seek feedback, compare two verified course sources and arrange an informational conversation. The plan keeps several routes open while producing evidence that will be useful across them."
            },
            vocabulary: [
              { term: "self-assessment", meaning: "a structured review of one’s interests, values, attributes, skills and evidence" },
              { term: "career pathway", meaning: "a possible sequence of learning, experience and work steps towards a career direction" },
              { term: "personal attribute", meaning: "a pattern of behaviour or character, such as reliability, persistence or courtesy" },
              { term: "employability skill", meaning: "a capability used across workplaces, such as communication, teamwork or problem-solving" },
              { term: "career goal", meaning: "a clear, reviewable result a person intends to work towards in their career planning" }
            ],
            misconception: {
              claim: "A career plan should choose one job for life and never change.",
              correction: "A career plan sets a current direction and useful next steps, then changes when evidence, circumstances or aspirations change."
            },
            appliedActivity: {
              id: "ALA-C00-S02",
              title: "Pathway evidence board",
              prompt: "Select one career direction and compare three possible pathways using current entry requirements, time, cost, location or mode, support and likely next opportunities. Add two pieces of personal evidence and identify one gap to develop.",
              evidence: "A source-linked pathway board and a sequenced four-step action plan."
            },
            visual: {
              id: "VIS-C00-S02",
              file: "assets/visuals/c00-s02.webp",
              alt: "A young person at the centre of three realistic pathways—vocational training, university study and entry-level work—with evidence cards and review arrows connecting the options.",
              purpose: "Make career planning visible as an evidence-based set of revisable pathways rather than one fixed ladder."
            },
            mediaAlternative: {
              title: "Analyse a pathway profile",
              before: "List the difference between an interest, a skill and an achievement.",
              during: "Highlight each pathway requirement and label the learner’s matching evidence or gap.",
              after: "Recommend the next step that would improve the learner’s options most."
            },
            applicationQuestions: [
              aq("Which statement is the strongest evidence for a communication skill?", "I explained the event plan to six volunteers, checked their questions and revised the roster", "The statement names the context, action and result rather than making an unsupported claim.", [["I am an excellent communicator", "This is a claim without an example or result."], ["Communication is important in every job", "This may be true broadly, but it is not evidence about the person."], ["My friend says I talk a lot", "Talking frequently is not the same as communicating effectively."]]),
              aq("When comparing two courses, which information should be treated as a formal requirement?", "The current entry conditions published by the provider", "A formal requirement should be checked against the current authoritative provider source.", [["A classmate’s memory of last year", "This may prompt a question, but it is not current authority."], ["An advertisement saying the course is exciting", "Promotional language is not an entry requirement."], ["A social media comment with no source", "An unsourced comment cannot establish a formal requirement."]]),
              aq("Jay discovers that one pathway requires a stronger portfolio. What is the best career-management response?", "Add a portfolio-building step and keep comparing viable pathways", "A gap should inform a realistic next action rather than end all exploration.", [["Pretend the requirement does not exist", "Ignoring verified requirements weakens the plan."], ["Abandon the whole career direction immediately", "One gap does not prove every pathway is unsuitable."], ["Submit copied work to fill the portfolio", "Copied work is unethical and does not demonstrate Jay’s capability."]]),
              aq("Which goal is most useful for monitoring progress?", "By the end of the month, compare two verified courses and draft three portfolio pieces", "The goal is specific, time-bound, evidence-producing and connected to the pathway.", [["Become successful soon", "This is too vague to guide or monitor action."], ["Choose the perfect career tonight", "The timeframe and demand for certainty are unrealistic."], ["Wait until someone else chooses a pathway", "Career support can help, but the learner still needs to participate in the decision."]]),
              aq("What best corrects the belief that changing a career plan is failure?", "Reviewing a plan in response to new evidence is responsible career management", "A plan is a decision tool, not a promise that must ignore new information.", [["Plans should change every day without evidence", "Revision should respond to evidence or changed circumstances, not random movement."], ["A person should never make an initial plan", "An initial direction helps organise purposeful action."], ["Only adults are allowed to revise goals", "Learners at any stage can review goals responsibly."]])
            ],
            longResponse: {
              id: "C00-S02-LR01",
              prompt: "Justify a career pathway recommendation for a fictional learner using both personal evidence and verified pathway information.",
              higherOrderVerb: "justify",
              scaffoldPrompts: [
                "Profile the learner’s interests, values, attributes, skills and achievements without overstating them.",
                "Compare at least two pathways using requirements, demands, supports and opportunities.",
                "Identify one evidence gap and a realistic way to address it.",
                "Recommend a pathway and a review point, explaining why alternatives remain possible."
              ],
              successCriteria: [
                "Distinguishes personal claims from specific evidence.",
                "Uses current pathway facts and weighs more than one factor.",
                "Provides sequenced actions and a justified, revisable recommendation."
              ],
              theoryAnchors: ["C00-S02-theory", "C00-S02-example"]
            }
          }),
          createSection({
            id: "C00-S03",
            title: "Managing change and building a sustainable working life",
            learningIntention: "Explain how people can manage transitions, wellbeing and continued learning across a changing working life.",
            successCriteria: [
              "I can explain why change can create both pressure and opportunity.",
              "I can propose strategies that combine self-management, support and learning.",
              "I can judge whether a working-life plan is sustainable rather than merely busy."
            ],
            theoryParagraphs: [
              "Working lives contain transitions: beginning work, changing hours or roles, learning new technology, moving between study and employment, responding to caring responsibilities, leaving an employer and eventually retiring. Some transitions are chosen and others are imposed. Change can affect income, identity, routines, relationships and confidence at the same time. Effective self-management begins by naming what has changed, separating controllable from uncontrollable factors, gathering reliable information and deciding which immediate action is both safe and useful.",
              "Resilience is not silent endurance. It is the capacity to adapt while using support, reflection and problem-solving. Helpful strategies can include clarifying expectations, breaking a problem into steps, seeking feedback, using personal and professional networks, updating skills, reviewing finances and accessing an appropriate support service. Different people have different resources and responsibilities, so the same strategy will not suit everyone. A good response recognises personal agency without blaming an individual for structural conditions they cannot control.",
              "A sustainable working life can be maintained over time without repeatedly sacrificing health, relationships, legal responsibilities or essential recovery. Work–life balance is therefore not a perfect daily split. It is an ongoing judgement about commitments, boundaries, income, purpose, rest and support across a life stage. Lifelong learning strengthens adaptability when it is connected to a real need and feasible plan. Regular review points help a person notice emerging strain, recognise progress and revise goals before a temporary pressure becomes an unmanageable pattern."
            ],
            workedExample: {
              title: "Responding to a major roster change",
              context: "Leila’s employer introduces a new roster and digital system. The roster clashes with a weekly caring responsibility, and Leila is worried because she has not used the software before.",
              analysis: "Leila separates the two issues. For the roster, she checks the confirmed arrangements and prepares a clear request to discuss the clash rather than assuming the outcome. For the software, she seeks training, practises one task at a time and records questions. She also reviews travel, rest and family support for the transition period. This response combines communication, learning, boundaries and support; it does not require Leila to hide the problem or solve organisational decisions alone."
            },
            vocabulary: [
              { term: "transition", meaning: "a period of movement from one work, learning or life situation to another" },
              { term: "resilience", meaning: "the capacity to adapt, recover and keep acting purposefully while using appropriate support" },
              { term: "work–life balance", meaning: "the ongoing management of work and other commitments in a way that can be sustained" },
              { term: "lifelong learning", meaning: "continued formal or informal learning across a person’s life" },
              { term: "career management", meaning: "the continuing process of planning, acting, reviewing and adapting a working life" }
            ],
            misconception: {
              claim: "A resilient worker handles every problem alone and never says they are struggling.",
              correction: "Resilience includes recognising limits, seeking information or support and adjusting a plan before harm increases."
            },
            appliedActivity: {
              id: "ALA-C00-S03",
              title: "Transition response plan",
              prompt: "Analyse a fictional work transition. Sort the pressures into controllable, influenceable and outside the person’s control, then design a response using communication, support, learning and a review point.",
              evidence: "A transition map and a justified seven-day/one-month action plan."
            },
            visual: {
              id: "VIS-C00-S03",
              file: "assets/visuals/c00-s03.webp",
              alt: "A realistic working-life pathway curving through study, first work, retraining, caring responsibilities and later career stages, with support and review points along the route.",
              purpose: "Show change as a normal part of working life and connect sustainable responses to review, learning and support."
            },
            mediaAlternative: {
              title: "Follow a worker through change",
              before: "Predict which parts of a work transition a person can control, influence or only respond to.",
              during: "Record each decision, support and new piece of information in the case.",
              after: "Judge which action made the response more sustainable and explain why."
            },
            applicationQuestions: [
              aq("What is the best first step when a work change creates several problems at once?", "Name each change, gather reliable information and separate what can be controlled or influenced", "A clear diagnosis prevents rushed action and directs effort to useful next steps.", [["Assume the worst possible outcome", "Catastrophising adds certainty without evidence."], ["Try to solve every issue secretly", "Secrecy can block information, support and reasonable discussion."], ["Ignore the change until a deadline is missed", "Delay can reduce options and increase pressure."]]),
              aq("Which action demonstrates resilience most clearly?", "Seeking training and support, practising the new task and reviewing progress", "Resilience combines purposeful action, adaptation and appropriate support.", [["Pretending the difficulty does not exist", "Denial prevents learning and early problem-solving."], ["Working without rest until the task is mastered", "Unsustainable overwork can increase errors and harm wellbeing."], ["Blaming oneself for every organisational change", "Individuals are not responsible for every structural decision."]]),
              aq("Which plan is most sustainable during a demanding month?", "Prioritise essential commitments, negotiate where possible, protect recovery time and set a review date", "Sustainability requires priorities, boundaries, communication and monitoring.", [["Accept every new commitment to appear capable", "Overcommitment increases the risk that important obligations will fail."], ["Drop all relationships and rest until work settles", "Removing essential support and recovery is not sustainable."], ["Use the same plan even when evidence shows it is failing", "A sustainable plan must be reviewed and adjusted."]]),
              aq("When is additional learning most purposeful?", "When it addresses an identified skill need and fits a realistic pathway plan", "Learning is strongest when its purpose, requirements and feasibility are clear.", [["Whenever a course has the brightest advertisement", "Promotion is not evidence that learning meets the person’s need."], ["Only after a person has lost a job", "Learning can support preparation, progression or transition before a crisis."], ["When it duplicates skills already demonstrated without a reason", "Unnecessary duplication may use time and money without improving the pathway."]]),
              aq("Which statement best corrects the idea that resilient workers never ask for help?", "Using appropriate support early can be part of capable self-management", "Recognising limits and accessing relevant support can prevent a problem from escalating.", [["Other people must make every decision", "Support assists judgement; it does not remove the person’s participation."], ["Help should replace all personal action", "Resilience combines support with purposeful action."], ["Only serious crises justify asking a question", "Early clarification can prevent small issues becoming serious."]])
            ],
            longResponse: {
              id: "C00-S03-LR01",
              prompt: "Evaluate a response to a major working-life transition and redesign it to be more sustainable.",
              higherOrderVerb: "evaluate",
              scaffoldPrompts: [
                "Explain the transition and its effects on work, finances, relationships and wellbeing.",
                "Separate personal choices from organisational or social influences.",
                "Evaluate the strengths and limitations of the current response.",
                "Redesign the plan using support, learning, boundaries and a review point."
              ],
              successCriteria: [
                "Uses resilience, work–life balance and career management accurately.",
                "Recognises both individual agency and factors outside the person’s control.",
                "Justifies a practical redesign that could be sustained over time."
              ],
              theoryAnchors: ["C00-S03-theory", "C00-S03-example"]
            }
          })
        ]
      },
      M01: {
        moduleId: "M01",
        title: "In the Workplace",
        outcomes: outcomes(1, 2, 3, 4, 5, 6, 8),
        sections: [
          createSection({
            id: "M01-S01",
            title: "Workplace structures, roles and relationships",
            learningIntention: "Understand how structures, roles, employment arrangements and relationships coordinate workplace activity.",
            successCriteria: ["I can read a simple organisational structure.", "I can distinguish a role, responsibility and reporting relationship.", "I can explain why workplace protocols vary across environments."],
            theoryParagraphs: [
              "A workplace structure shows how responsibilities and authority are arranged. In a small organisation one person may perform several functions; a larger organisation may separate operations, finance, customer service, human resources and management. An organisational chart can show formal reporting lines, but it does not capture every working relationship. Employees also cooperate across teams, communicate with internal and external customers and seek specialist help. Knowing who is responsible for a decision reduces duplication, delay and the risk of acting beyond a person’s role.",
              "A role is the broad contribution expected from a position, while responsibilities are the particular duties and standards attached to it. Relationships describe how people coordinate, supervise, support, supply or serve one another. New workers need to clarify priorities, limits and escalation points rather than relying on assumptions. Workplace protocols—such as how to greet customers, record information, request assistance or attend a meeting—translate organisational expectations into consistent behaviour. Protocols should be learned from the actual workplace, not copied from an unrelated setting.",
              "Employment arrangements also shape workplace relationships. Casual, part-time, full-time, apprenticeship or traineeship, contract, labour-hire, voluntary and self-employed work can involve different patterns of hours, supervision, continuity and responsibility. The label alone does not reveal every condition, so workers should use current, authoritative information and their actual documentation. Comparing arrangements fairly means considering both the organisation’s needs and the worker’s income, learning, security, flexibility and future pathway."
            ],
            workedExample: { title: "Finding the right reporting path", context: "Noah, a new café employee, notices that an online order has been charged twice. The shift supervisor is serving customers and the owner is off-site.", analysis: "Noah checks the café’s confirmed process, preserves the customer’s information and tells the person currently authorised to resolve payment issues. He explains the facts without promising an outcome beyond his role. This uses the formal structure and immediate working relationships: Noah takes responsibility for noticing and reporting the problem while leaving the financial decision to the authorised role." },
            vocabulary: [
              { term: "organisational structure", meaning: "the arrangement of functions, authority and reporting relationships in a workplace" },
              { term: "role", meaning: "the broad contribution and purpose expected from a workplace position" },
              { term: "responsibility", meaning: "a duty or standard a person is expected to meet within a role" },
              { term: "protocol", meaning: "an agreed workplace way of handling a recurring interaction or task" },
              { term: "reporting line", meaning: "the formal pathway through which a worker receives direction and raises matters" }
            ],
            misconception: { claim: "An organisational chart tells a worker exactly what to do in every situation.", correction: "A chart shows formal relationships; actual duties, procedures, judgement and cross-team cooperation require further workplace information." },
            appliedActivity: { id: "ALA-M01-S01", title: "Structure-to-action map", prompt: "Analyse a fictional workplace chart and four short incidents. For each incident, identify the relevant role, the worker’s responsibility, who should be informed and what must still be checked locally.", evidence: "An annotated organisational chart and four justified action notes." },
            visual: { id: "VIS-M01-S01", file: "assets/visuals/m01-s01.webp", alt: "A realistic small workplace scene with labelled links among a team member, supervisor, manager, customer and external supplier.", purpose: "Connect formal reporting lines with the wider relationships that make work happen." },
            mediaAlternative: { title: "Trace a workplace decision", before: "Identify who appears responsible for a customer problem.", during: "Track where information moves and where authority changes.", after: "Explain one risk of bypassing the agreed reporting path." },
            applicationQuestions: [
              aq("A new worker is unsure who can approve a refund. What is the best action?", "Check the workplace process and ask the relevant supervisor or authorised role", "Clarifying authority protects the customer, worker and organisation.", [["Promise the refund immediately", "The worker may be acting beyond their authority."], ["Ignore the customer until the owner returns", "The issue still needs timely acknowledgement and escalation."], ["Ask another new worker to guess", "A guess is not a reliable source of workplace authority."]]),
              aq("What does a reporting line mainly clarify?", "Where formal direction and escalation should travel", "Reporting lines help workers locate responsibility and authority.", [["Which colleague a worker must like most", "Personal preference is not the purpose of a reporting line."], ["That cross-team cooperation is forbidden", "Teams may cooperate while retaining clear authority."], ["Every detail of every task", "Task detail normally comes from role descriptions, procedures and instruction."]]),
              aq("Why might the same job title involve different protocols in two workplaces?", "Organisations have different purposes, customers, structures and confirmed procedures", "Protocols respond to the actual work context.", [["Protocols are random and never need a reason", "They should support consistent, lawful and effective work."], ["A job title automatically removes local differences", "A title does not establish every local expectation."], ["Workers should import whichever protocol they prefer", "Workers need to learn the confirmed process for the current workplace."]]),
              aq("Which comparison of employment arrangements is most balanced?", "Compare hours, supervision, continuity, conditions, learning and future pathways", "The employment label needs context before a judgement is made.", [["Assume casual work is always best", "No arrangement is best for every worker or purpose."], ["Compare only the job title", "The title may hide important differences in the arrangement."], ["Treat flexibility and security as identical", "They are different factors and may involve trade-offs."]]),
              aq("What best corrects the belief that an organisational chart answers every workplace question?", "Use the chart to locate formal relationships, then check role information and confirmed procedures", "Structure is one source of guidance, not a complete operating manual.", [["Discard the chart because it has no value", "It still provides useful authority and reporting information."], ["Follow informal gossip instead", "Gossip is not a reliable replacement for confirmed information."], ["Create a new structure without authority", "Workers should not replace organisational arrangements on their own."]])
            ],
            longResponse: { id: "M01-S01-LR01", prompt: "Apply a workplace structure to resolve a coordination problem involving two teams and a customer.", higherOrderVerb: "apply", scaffoldPrompts: ["Describe the roles and reporting relationships.", "Explain where the problem entered the workflow.", "Propose communication and escalation steps within role limits.", "Justify how the response supports both the customer and the organisation."], successCriteria: ["Uses role, responsibility, protocol and reporting line accurately.", "Keeps each action within an identified role or escalation path.", "Explains how the proposed response improves coordination."], theoryAnchors: ["M01-S01-theory", "M01-S01-example"] }
          }),
          createSection({
            id: "M01-S02",
            title: "Rights, responsibilities and safe participation",
            learningIntention: "Explain the reciprocal obligations that support lawful, fair and safe participation at work.",
            successCriteria: ["I can distinguish employer and employee responsibilities.", "I can explain why a contract, award or agreement must be checked rather than assumed.", "I can propose a safe, evidence-based response to a concern without inventing a local procedure."],
            theoryParagraphs: [
              "Employment creates reciprocal obligations. Employers are responsible for lawful pay and conditions, safe and healthy systems of work, fair treatment and other duties that apply to the workplace. Employees are responsible for attendance and punctuality, conscientious and competent work, lawful and reasonable instructions, work health and safety requirements, anti-discrimination expectations and ethical conduct. These responsibilities support one another: a worker’s duty to work safely does not remove the organisation’s responsibility to provide and maintain safe systems.",
              "Conditions may be shaped by legislation, an award, an enterprise agreement or an individual contract. These sources are not interchangeable, and the correct source depends on the worker and situation. A sensible worker reads their own documents, keeps records and checks current official information when unsure. General learning materials can explain concepts but cannot determine a person’s exact pay, leave, trial period, dismissal process or entitlement. Those questions require current authoritative advice and, where appropriate, support from a trusted adult, workplace representative or official service.",
              "Safe participation includes noticing hazards, following confirmed controls, using equipment only as authorised, communicating concerns and seeking clarification before continuing an unsafe or unclear task. It also includes psychological and social safety: bullying, harassment and discrimination can damage people and work. A useful response records facts, avoids retaliation or public accusation, uses the confirmed reporting path and seeks appropriate support. The exact local procedure must come from the current workplace process and authoritative guidance; ask your teacher or another trusted adult for help locating it rather than improvising a legal or emergency process from a course website."
            ],
            workedExample: { title: "An unclear instruction", context: "A supervisor asks Priya to use unfamiliar equipment while the usual trained worker is absent. Priya has not been shown the task and is unsure of the controls.", analysis: "Priya does not guess or simply refuse without explanation. She pauses, states what she has and has not been trained to do, and asks for clarification through the confirmed workplace pathway. She follows any immediate safety direction and records relevant facts. The employer’s safe-system responsibility and Priya’s responsibility to work safely operate together; the website does not decide the workplace’s exact authorisation or procedure." },
            vocabulary: [
              { term: "employment obligation", meaning: "a duty arising from the employment relationship and its applicable rules" },
              { term: "award", meaning: "a legal instrument setting minimum pay and conditions for covered work" },
              { term: "enterprise agreement", meaning: "an approved agreement setting employment conditions for a particular enterprise or group" },
              { term: "safe system of work", meaning: "an organised method of completing work while controlling identified risks" },
              { term: "discrimination", meaning: "unfair treatment connected to a protected personal characteristic under applicable law" }
            ],
            misconception: { claim: "If an employee has a safety responsibility, any workplace injury is automatically their fault.", correction: "Safety duties are shared and contextual; organisations must provide safe systems while workers follow controls, communicate hazards and act within training and authority." },
            appliedActivity: { id: "ALA-M01-S02", title: "Rights and responsibilities case conference", prompt: "Analyse three fictional workplace concerns. Separate verified facts, assumptions, employer responsibilities, employee responsibilities and the next source or support that should be checked.", evidence: "A five-column case table and one cautious response script." },
            visual: { id: "VIS-M01-S02", file: "assets/visuals/m01-s02.webp", alt: "A realistic workplace briefing where a supervisor and employee review a task, safety controls and employment documents together.", purpose: "Show rights and responsibilities as reciprocal rather than as a one-sided list." },
            mediaAlternative: { title: "Read a safe-participation scenario", before: "Separate what the worker knows from what they are assuming.", during: "Label each employer duty, employee duty and point requiring current advice.", after: "Draft one sentence that raises the concern clearly and respectfully." },
            applicationQuestions: [
              aq("Which statement best represents reciprocal safety responsibility?", "The organisation provides safe systems and the worker follows controls, communicates hazards and stays within training", "Work health and safety involves responsibilities at more than one level.", [["Only the newest worker is responsible", "A new worker does not carry the organisation’s entire duty."], ["Only the employer needs to think about safety", "Workers also need to follow controls and communicate concerns."], ["Safety responsibility begins only after an injury", "Risk management is preventative as well as responsive."]]),
              aq("A student wants to know their exact penalty rate. Which source should decide it?", "Current authoritative information matched to the worker’s actual coverage", "Exact entitlements depend on current law and the relevant instrument or contract.", [["A decade-old worksheet", "It may explain a concept but cannot establish a current rate."], ["A friend’s rate in another industry", "Different work may have different coverage."], ["A guess based on the business’s opening hours", "Opening hours do not determine the applicable entitlement."]]),
              aq("What is the strongest response to an unfamiliar task with unclear safety controls?", "Pause, explain the uncertainty and seek clarification through the confirmed pathway", "Clarification prevents unsafe guessing while keeping communication constructive.", [["Attempt it quickly before anyone notices", "Speed does not replace training or controls."], ["Post an accusation online", "Public accusation may escalate the situation without resolving the immediate risk."], ["Ask another untrained worker to demonstrate", "Another untrained person is not a reliable control."]]),
              aq("Which record is most useful when raising a workplace concern?", "Dates, observed actions, exact words where remembered and relevant documents", "Specific factual records are more useful than labels or rumours.", [["A list of insults about the people involved", "Insults weaken accuracy and do not establish events."], ["A rumour from someone outside the workplace", "Unverified hearsay is weak evidence."], ["A rewritten story that removes uncertainty", "A record should distinguish what is known from what is uncertain."]]),
              aq("What best corrects the idea that an injured worker is automatically at fault?", "Examine the system, controls, training, actions and context before reaching a conclusion", "Responsibility cannot be assigned fairly from the injury alone.", [["Assume the employer is automatically at fault instead", "Reversing the assumption still avoids evidence."], ["Ignore the incident because accidents happen", "Incidents should inform response and prevention."], ["Decide fault from the worker’s job title", "A title does not reveal the full system or events."]])
            ],
            longResponse: { id: "M01-S02-LR01", prompt: "Evaluate a fictional workplace concern and justify a safe, fair next response without giving legal advice.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Separate verified facts from assumptions.", "Identify relevant employer and employee responsibilities.", "Explain which current document, procedure or support must be checked.", "Justify an immediate response that protects safety, fairness and evidence."], successCriteria: ["Recognises reciprocal responsibilities.", "Avoids inventing entitlements or local procedures.", "Provides a proportionate, evidence-based next step."], theoryAnchors: ["M01-S02-theory", "M01-S02-example"] }
          }),
          createSection({
            id: "M01-S03",
            title: "Workplace culture, performance and change",
            learningIntention: "Assess how culture, feedback, performance expectations and change influence workplace success.",
            successCriteria: ["I can identify visible evidence of workplace culture.", "I can use more than one indicator to discuss performance.", "I can propose a constructive response to feedback and change."],
            theoryParagraphs: [
              "Workplace culture is the pattern of shared expectations and behaviour that develops through leadership, systems and everyday interactions. It can be seen in how people communicate, respond to mistakes, include colleagues, treat customers, share information and handle pressure. A slogan does not prove a culture. Strong evidence comes from repeated actions, incentives, decisions and whether stated values are applied consistently. Culture affects belonging, ethical behaviour, learning, teamwork and the willingness to raise problems.",
              "Performance is also broader than speed. Indicators can include the quantity and quality of work, customer or supervisor expectations, safe practice, reliability, self-management, teamwork, initiative, appropriate use of technology and progress towards a goal. Indicators can conflict: rushing may increase output while reducing quality or safety. Fair performance discussion uses expectations that were communicated, evidence from relevant work and feedback that explains both strengths and next steps. One observation should not automatically define a person’s whole capability.",
              "Change may involve new technology, work processes, team structures, regulations or customer needs. Workers can respond by clarifying the purpose, identifying what stays the same, learning the new requirement, seeking assistance and monitoring results. Constructive feedback helps when it is specific, focused on behaviour or work and linked to an achievable improvement. Workers also need to give feedback respectfully. Managing change does not mean accepting every decision without question; it means using evidence, communication and appropriate pathways to respond productively."
            ],
            workedExample: { title: "Quality falls after a rushed change", context: "A delivery team adopts new scheduling software. Output rises for one week, but incorrect addresses and customer complaints also increase.", analysis: "A fair review does not call the change a success based only on delivery numbers. The team checks quality, error patterns, training, workload and customer feedback. It identifies that workers understood booking but not address validation. A short practice session, clearer checking step and review after another week address the cause. The response uses multiple performance indicators and treats mistakes as information for improvement." },
            vocabulary: [
              { term: "workplace culture", meaning: "the shared patterns of behaviour and expectations that shape everyday work" },
              { term: "performance indicator", meaning: "a defined sign or measure used to judge progress or work quality" },
              { term: "constructive feedback", meaning: "specific information that recognises performance and supports a practical improvement" },
              { term: "initiative", meaning: "appropriate independent action taken within a person’s role and authority" },
              { term: "continuous improvement", meaning: "ongoing use of evidence and review to make work processes or results better" }
            ],
            misconception: { claim: "The fastest worker is automatically the best performer.", correction: "Performance may involve speed, but also quality, safety, reliability, teamwork, customer needs and role expectations." },
            appliedActivity: { id: "ALA-M01-S03", title: "Culture and performance evidence audit", prompt: "Review a fictional workplace description. Identify evidence of culture, select four balanced performance indicators and design a feedback conversation about one improvement.", evidence: "An evidence audit, indicator set and 150-word feedback script." },
            visual: { id: "VIS-M01-S03", file: "assets/visuals/m01-s03.webp", alt: "A realistic team review with a quality sample, customer feedback, progress board and a worker receiving specific coaching on a new process.", purpose: "Show that culture and performance are evidenced through behaviour, quality and learning—not slogans or speed alone." },
            mediaAlternative: { title: "Audit a change story", before: "Predict which indicators could show whether a change works.", during: "Record evidence for output, quality, safety, teamwork and customer impact.", after: "Recommend one improvement and one review measure." },
            applicationQuestions: [
              aq("Which evidence says most about workplace culture?", "Repeated decisions and behaviours, especially when pressure or mistakes occur", "Culture is demonstrated through patterns of action rather than a slogan alone.", [["A poster using the word respect", "A poster states an intention but does not prove everyday behaviour."], ["The colour of the uniform", "Appearance may be part of identity but says little about shared behaviour by itself."], ["One employee’s unsupported rumour", "A single unverified claim does not establish a repeated pattern."]]),
              aq("Which set of indicators gives the most balanced view of a service team?", "Timeliness, accuracy, safe practice, customer response and teamwork", "Several relevant indicators reduce the risk of rewarding one result at the expense of others.", [["Number of tasks only", "Quantity alone can hide errors, unsafe practice or poor service."], ["The manager’s mood", "Mood is not a defined performance indicator."], ["How long workers remain at their desks", "Presence alone does not establish useful performance."]]),
              aq("What makes feedback constructive?", "It is specific, evidence-based and linked to an achievable next action", "Useful feedback helps the learner understand both the evidence and what to do next.", [["It labels the person as lazy", "A personal label is not a precise account of behaviour or work."], ["It lists every past mistake without priority", "Overloading the recipient can obscure the most useful improvement."], ["It avoids all difficult information", "Constructive feedback can be honest while remaining respectful and actionable."]]),
              aq("When is initiative appropriate?", "When a worker acts within their role, considers risks and communicates as needed", "Initiative is responsible independent action, not unbounded authority.", [["Whenever the worker ignores an agreed safety control", "Bypassing controls is not responsible initiative."], ["Only when no one else is present", "Initiative can occur within normal teamwork and supervision."], ["When the worker makes commitments for another department without authority", "That exceeds role limits and may create new problems."]]),
              aq("What best corrects the claim that the fastest worker is automatically the best?", "Judge speed alongside quality, safety, reliability, teamwork and the actual role", "Performance is multidimensional and linked to communicated expectations.", [["Speed should never be considered", "Timeliness can be relevant; it is simply not the only factor."], ["The slowest worker must be best", "Reversing the claim is equally unsupported."], ["Performance cannot be discussed at all", "Fair performance discussion is possible with relevant evidence and expectations."]])
            ],
            longResponse: { id: "M01-S03-LR01", prompt: "Evaluate whether a workplace change has improved performance and culture, then recommend a next step.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Identify the intended change and the evidence available.", "Assess output, quality, safety, relationships and customer impact.", "Explain what the response to mistakes reveals about culture.", "Recommend one improvement and a fair way to review it."], successCriteria: ["Uses multiple relevant performance indicators.", "Supports claims about culture with behaviour or decision evidence.", "Provides a justified improvement and review method."], theoryAnchors: ["M01-S03-theory", "M01-S03-example"] }
          })
        ]
      },
      M02: {
        moduleId: "M02",
        title: "Preparing Job Applications",
        outcomes: outcomes(1, 2, 3, 4, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "M02-S01",
            title: "Reading opportunities and selection criteria",
            learningIntention: "Interpret job opportunities and decide whether the role and evidence are a credible match.",
            successCriteria: ["I can separate role facts from promotional language.", "I can distinguish duties, requirements and selection criteria.", "I can assess suitability using evidence and realistic constraints."],
            theoryParagraphs: [
              "Job opportunities may be advertised through employer sites, job platforms, agencies, careers services and community networks, while some are discovered through direct contact, work experience or recommendation. A vacancy notice is a starting source, not the whole workplace. Careful readers identify the role purpose, duties, location, hours, employment arrangement, required qualifications or licences, application method and closing information. They also research the employer through reliable sources so that an application responds to the actual organisation rather than a generic idea of the job.",
              "Selection criteria describe capabilities or evidence used to judge applicants. A criterion may be essential, desirable or simply part of the role description, so the wording and application instructions matter. Applicants should unpack each criterion into its action and context: ‘communicates effectively with customers’ requires more than saying ‘good communication’. It calls for an example showing audience, purpose, action and outcome. Honest matching includes gaps. A missing desirable skill may be manageable; a missing mandatory qualification cannot be disguised.",
              "Suitability is two-way. Employers consider whether the applicant can contribute; applicants consider whether the work fits their preferences, values, qualifications, travel, conditions, wellbeing and longer-term goals. Labour-market information can add context, but broad trends do not decide one vacancy. A sound decision uses the best available evidence, identifies questions to clarify and avoids rejecting an opportunity merely because the applicant does not match every non-essential preference."
            ],
            workedExample: { title: "Unpacking a customer-service vacancy", context: "A vacancy asks for reliable attendance, clear customer communication, basic digital confidence and weekend availability. It says retail experience is desirable, not essential.", analysis: "Asha marks reliability, communication, digital confidence and weekend availability as the main matching decisions. She can evidence reliability through a school event role, customer communication through volunteering and digital confidence through a booking task. She has no retail experience, but does not falsely claim it; she explains the transferable evidence and checks whether the travel and weekend pattern are sustainable. This creates a reasoned decision to apply." },
            vocabulary: [
              { term: "selection criterion", meaning: "a capability, qualification or attribute used to assess applicants" },
              { term: "essential requirement", meaning: "a condition an applicant must meet to be eligible or perform the role" },
              { term: "desirable requirement", meaning: "a preferred capability that may strengthen an application but is not stated as mandatory" },
              { term: "job suitability", meaning: "the degree of fit between a role’s demands and an applicant’s evidence, needs and goals" },
              { term: "hidden job market", meaning: "work opportunities found through networks, direct approaches or relationships rather than public advertisements" }
            ],
            misconception: { claim: "A person should apply only when they match every word in an advertisement.", correction: "Applicants must meet genuine essentials, but can make an honest case from transferable evidence when desirable preferences or experience are not exact matches." },
            appliedActivity: { id: "ALA-M02-S01", title: "Vacancy evidence match", prompt: "Annotate a public-safe fictional vacancy. Sort facts into duties, essential requirements, desirable requirements, conditions and questions. Match each criterion to evidence or a gap and decide whether to apply.", evidence: "An annotated vacancy, evidence matrix and 120-word suitability judgement." },
            visual: { id: "VIS-M02-S01", file: "assets/visuals/m02-s01.webp", alt: "A realistic desk scene with a job advertisement annotated into duties, essentials, desirable criteria, conditions and evidence questions.", purpose: "Model the analytical reading needed before an application is written." },
            mediaAlternative: { title: "Pause-and-annotate vacancy", before: "Predict which details decide eligibility and which merely describe the workplace.", during: "Tag requirements, conditions, evidence verbs and unclear points.", after: "Make and justify an apply, clarify or do-not-apply decision." },
            applicationQuestions: [
              aq("A criterion says ‘works effectively in a team’. What is the strongest matching evidence?", "A specific example showing the team goal, the applicant’s action and the result", "Selection evidence should demonstrate the capability in context.", [["The sentence ‘I love teamwork’", "Enthusiasm alone does not demonstrate performance."], ["A definition copied from a website", "A definition does not show the applicant’s action."], ["A list of team members’ names", "Names do not explain the applicant’s contribution or result."]]),
              aq("What should an applicant do with a stated mandatory licence they do not hold?", "Treat it as an eligibility gap and do not imply that they hold it", "A mandatory requirement cannot be replaced by vague confidence or dishonest wording.", [["Rename an unrelated certificate as the licence", "Misrepresenting a qualification is unethical."], ["Ignore the requirement and claim full eligibility", "This wastes time and risks dishonesty."], ["Assume the employer will never check", "Applications should be accurate regardless of checking."]]),
              aq("Which is the best two-way suitability question?", "Can I evidence the role requirements, and do the hours, location and conditions fit my situation?", "Suitability considers both contribution and realistic fit.", [["Does the job title sound impressive?", "A title alone gives too little information."], ["Will my friends like the employer’s logo?", "Peer reaction to branding is not a sound suitability test."], ["Is every duty already easy for me?", "Roles can involve learning; the question is capability, support and fit."]]),
              aq("Why research the employer before applying?", "To tailor evidence and questions to the organisation’s actual purpose and context", "Research improves relevance and helps the applicant test suitability.", [["To copy the employer’s website into the letter", "Copying does not demonstrate the applicant’s evidence."], ["To invent inside knowledge", "Research should remain accurate and appropriately sourced."], ["To avoid reading the vacancy", "Employer research supplements rather than replaces the vacancy."]]),
              aq("What best corrects the belief that every desirable criterion is compulsory?", "Read the wording carefully, meet real essentials and address preferences honestly with relevant evidence", "Desirable criteria can strengthen an application without always deciding eligibility.", [["Ignore all criteria labelled desirable", "They may still affect competitiveness and deserve a response."], ["Pretend every preference is an essential licence", "That can unnecessarily exclude suitable applicants."], ["Claim experience that has not occurred", "Dishonesty is not a valid response to a gap."]])
            ],
            longResponse: { id: "M02-S01-LR01", prompt: "Evaluate whether a fictional applicant should pursue a vacancy and justify the decision using the advertisement and the applicant’s evidence.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Separate duties, essentials, desirables and conditions.", "Match the applicant’s evidence to each major criterion.", "Identify gaps, transferable evidence and questions needing clarification.", "Reach an apply, clarify or do-not-apply judgement and justify it."], successCriteria: ["Interprets the vacancy accurately.", "Uses specific applicant evidence without exaggeration.", "Balances eligibility, competitiveness and personal suitability."], theoryAnchors: ["M02-S01-theory", "M02-S01-example"] }
          }),
          createSection({
            id: "M02-S02",
            title: "Building evidence-based applications",
            learningIntention: "Create accurate, tailored application material that converts experience into relevant evidence.",
            successCriteria: ["I can select relevant evidence rather than list everything I have done.", "I can explain the different jobs of a résumé and covering letter.", "I can protect privacy, proofread and check claims before submission."],
            theoryParagraphs: [
              "An application is an evidence argument. The applicant identifies what the employer needs, selects truthful examples and makes the connection easy to see. Evidence can come from school, paid work, workplace learning, volunteering, sport, community activity, caring and enterprise. Strong examples name the situation, task or goal, action and result. Numbers can help when they are accurate, but detail is more important than decoration. An applicant should never copy another person’s achievement or turn participation into a responsibility they did not hold.",
              "A résumé gives a clear record of relevant skills, education, experience and achievements. A covering letter introduces the application, identifies the role and highlights the strongest match. Both should be tailored, concise and consistent. Referees should be suitable people who can comment on relevant behaviour or performance and who have agreed to be contacted. Public learning activities use fictional details: real addresses, phone numbers, private referee details and other personal information do not belong in a public course site.",
              "Quality control is part of employability. Applicants follow the requested file type and naming instructions, check dates and contact information, proofread spelling and layout, verify that examples address the criteria and confirm that attachments open. Technology can assist drafting, but the applicant remains responsible for accuracy, authorship and tone. A final read from the employer’s perspective asks: Can I locate the evidence quickly? Does it answer this vacancy? Is every claim defensible?"
            ],
            workedExample: { title: "From duty list to achievement evidence", context: "Luca writes ‘Helped at the school fundraiser’ in a résumé for an event-assistant role.", analysis: "Luca checks what he actually did and revises the evidence: ‘Coordinated the sign-in table with two volunteers, answered visitor questions and reconciled attendance numbers at closing.’ The wording identifies communication, teamwork, organisation and accurate recording without inventing leadership or financial responsibility. His covering letter then connects this example directly to the vacancy’s event-support criterion." },
            vocabulary: [
              { term: "résumé", meaning: "a concise record of relevant skills, education, experience and achievements for an application" },
              { term: "covering letter", meaning: "a tailored introduction that connects an applicant’s strongest evidence to a specific opportunity" },
              { term: "referee", meaning: "a person who has agreed to comment on an applicant’s relevant conduct or performance" },
              { term: "evidence statement", meaning: "a specific account linking context, action and result to a required capability" },
              { term: "proofreading", meaning: "the deliberate checking of accuracy, clarity, consistency and presentation before release" }
            ],
            misconception: { claim: "A longer résumé is always more impressive.", correction: "A résumé is effective when relevant evidence is easy to find; unnecessary length can hide the strongest match." },
            appliedActivity: { id: "ALA-M02-S02", title: "Evidence statement workshop", prompt: "Using fictional or privacy-safe experience, turn five vague claims into context–action–result evidence. Select the best three for a fictional vacancy and draft a matching résumé section and covering-letter paragraph.", evidence: "Five revised evidence statements plus one tailored résumé excerpt and letter paragraph." },
            visual: { id: "VIS-M02-S02", file: "assets/visuals/m02-s02.webp", alt: "A realistic application workspace showing a criterion linked by coloured notes to a résumé achievement, covering-letter paragraph and referee confirmation.", purpose: "Show how one verified piece of evidence can be selected and tailored across application documents." },
            mediaAlternative: { title: "Application document walkthrough", before: "Identify the different purpose of a résumé and covering letter.", during: "Track where each criterion is answered and what evidence supports it.", after: "Find one claim that needs clearer context, action or result." },
            applicationQuestions: [
              aq("Which revision turns ‘helped customers’ into stronger evidence?", "Listened to visitor questions, explained two service options and checked that each visitor understood the next step", "The revision shows audience, actions and a check on the result.", [["Customers are important", "This is a general statement, not personal evidence."], ["I am the best at helping", "This is an unsupported superlative."], ["Helped lots and lots", "The wording remains vague and unverifiable."]]),
              aq("What is the main job of a covering letter?", "Introduce the specific application and connect the strongest evidence to the role", "The letter makes a concise, tailored case for fit.", [["Repeat every line of the résumé", "Duplication wastes the opportunity to make connections."], ["Provide private details about referees without consent", "Referee information should be handled appropriately and with agreement."], ["Describe unrelated hobbies at length", "Content should be selected for relevance."]]),
              aq("Which referee choice is strongest?", "A person who observed relevant performance, agrees to be contacted and can speak accurately", "A suitable referee has relevant knowledge and consent.", [["A stranger with an impressive title", "Status without knowledge of the applicant is weak evidence."], ["A friend asked to exaggerate", "Exaggeration is unethical and unreliable."], ["Anyone whose details were found online", "Consent and relevant knowledge are required."]]),
              aq("What should an applicant check immediately before submission?", "Instructions, file access, accuracy, evidence relevance and privacy", "A complete quality check reduces avoidable errors and protects information.", [["Only the font colour", "Presentation matters, but accuracy and compliance are more important."], ["Whether the document is as long as possible", "Length is not the quality standard."], ["Whether a copied template still names another employer", "That is a problem to correct, not a satisfactory check."]]),
              aq("What best corrects the belief that a longer résumé is automatically stronger?", "Keep material that proves relevant capability and remove detail that hides the match", "Selection and clarity make evidence useful.", [["Use a one-line résumé for every role", "Excessive brevity can omit necessary evidence."], ["Make the font tiny to fit more", "Unreadable presentation undermines access."], ["Add achievements that did not occur", "False content is never an acceptable way to increase length."]])
            ],
            longResponse: { id: "M02-S02-LR01", prompt: "Justify how a fictional applicant should select and present evidence for a specific vacancy.", higherOrderVerb: "justify", scaffoldPrompts: ["Identify the vacancy’s three most important criteria.", "Select and explain one evidence example for each.", "Decide what belongs in the résumé and what should be highlighted in the letter.", "Explain the quality, privacy and referee checks required before submission."], successCriteria: ["Uses truthful context–action–result evidence.", "Tailors document choices to the vacancy.", "Includes accuracy, consent and privacy safeguards."], theoryAnchors: ["M02-S02-theory", "M02-S02-example"] }
          }),
          createSection({
            id: "M02-S03",
            title: "Interview preparation, performance and reflection",
            learningIntention: "Prepare, communicate and learn from an interview as a professional two-way conversation.",
            successCriteria: ["I can prepare evidence for likely questions without memorising a script.", "I can explain professional verbal and non-verbal interview behaviours.", "I can use feedback and reflection to improve a later performance."],
            theoryParagraphs: [
              "Interview preparation begins with the vacancy and the application already submitted. Applicants revisit the criteria, research the organisation, prepare truthful examples and plan practical details such as time, access, technology and requested documents. Examples are easier to communicate when organised around context, task or goal, action and result. Preparation should create flexible evidence, not a speech that ignores the interviewer’s actual question.",
              "Interview performance combines listening, thinking and communicating. The applicant greets the interviewer appropriately, listens to the whole question, asks for clarification when needed and answers with relevant detail. Voice, pace, posture, facial expression and eye contact can support meaning, but expectations vary across people, cultures and disability. Professional communication is not one narrow style. The goal is respectful, accessible interaction and evidence of capability, not imitation of a stereotype.",
              "An interview is also a two-way information exchange. Thoughtful questions can clarify duties, support, learning and next steps without demanding information already provided. Afterward, the applicant records what was asked, evaluates which examples worked, identifies gaps and seeks feedback where available. A result is not a complete measure of personal worth. Reflection turns one performance into preparation for the next opportunity while keeping claims about the employer or decision evidence-based."
            ],
            workedExample: { title: "Repairing a vague interview answer", context: "Asked about teamwork, Erin says, ‘I work well with anyone,’ then stops.", analysis: "Erin pauses and adds a concise example: her group had conflicting availability, so she created a shared schedule, checked each person’s constraints and moved one deadline with agreement. The group completed the task on time. The revised answer demonstrates listening, organisation, negotiation and outcome. In reflection, Erin notes that preparing two flexible examples would help her avoid unsupported claims next time." },
            vocabulary: [
              { term: "behavioural question", meaning: "an interview question asking for evidence of how a person acted in a past situation" },
              { term: "clarifying question", meaning: "a respectful question used to check the meaning or scope of what has been asked" },
              { term: "non-verbal communication", meaning: "meaning conveyed through posture, facial expression, gesture, space and other behaviour beyond words" },
              { term: "interview evidence", meaning: "a relevant example that demonstrates a capability through context, action and result" },
              { term: "reflection", meaning: "a deliberate review of experience to identify learning and improve later action" }
            ],
            misconception: { claim: "A strong interview answer must be memorised word for word.", correction: "Strong preparation organises flexible evidence so the applicant can listen and respond to the actual question." },
            appliedActivity: { id: "ALA-M02-S03", title: "Interview evidence rehearsal", prompt: "Prepare three privacy-safe evidence examples for a fictional vacancy, conduct a short paired interview and use an evidence/listening rubric to give feedback and revise one answer.", evidence: "Three planning cards, peer feedback and a revised answer with a reflection note." },
            visual: { id: "VIS-M02-S03", file: "assets/visuals/m02-s03.webp", alt: "A realistic interview scene with a candidate listening, an evidence card showing context-action-result and an interviewer’s notes beside the vacancy criteria.", purpose: "Show interview success as responsive evidence and listening rather than a memorised performance." },
            mediaAlternative: { title: "Read an annotated interview exchange", before: "Predict where the candidate should listen, clarify and provide evidence.", during: "Label the context, action and result in each answer.", after: "Rewrite one vague answer and explain the improvement." },
            applicationQuestions: [
              aq("What is the strongest preparation for a behavioural question?", "Organise several truthful examples that can be adapted to the question", "Flexible evidence supports listening and relevance.", [["Memorise one long answer for every possible question", "A fixed script may fail to answer what was actually asked."], ["Invent an impressive emergency", "Fabricated evidence is unethical."], ["Avoid reviewing the vacancy", "The criteria help identify relevant examples."]]),
              aq("What should an applicant do if a question is unclear?", "Ask a concise clarifying question before answering", "Clarification supports accuracy and shows purposeful communication.", [["Guess silently and talk for several minutes", "A guess can produce an irrelevant answer."], ["Criticise the interviewer", "A respectful clarification is more professional."], ["End the interview immediately", "Most ambiguity can be resolved with a simple question."]]),
              aq("Which view of non-verbal communication is most inclusive?", "Use respectful, accessible behaviour while recognising cultural and individual differences", "Professional communication should not impose one stereotype of eye contact or movement.", [["Everyone must use identical eye contact", "Communication styles and access needs vary."], ["Body language never affects meaning", "Non-verbal cues can influence how messages are received."], ["Disability should be treated as lack of interest", "That is an unfair and unsupported interpretation."]]),
              aq("Which post-interview reflection is most useful?", "Record the questions, evaluate evidence used and plan one specific improvement", "Specific reflection creates actionable learning.", [["Decide the whole interview was terrible without examples", "A global label does not identify what to improve."], ["Blame every outcome on one facial expression", "That claim exceeds the available evidence."], ["Forget the interview immediately", "A short record can improve future preparation."]]),
              aq("What best corrects the belief that every answer should be memorised word for word?", "Prepare the structure and evidence, then listen and adapt the wording", "Responsive communication is more relevant than recitation.", [["Do no preparation at all", "Preparation remains important."], ["Read an unrelated script during the interview", "That prevents responsive engagement."], ["Use the same example even when it does not fit", "Evidence must answer the particular question."]])
            ],
            longResponse: { id: "M02-S03-LR01", prompt: "Evaluate a fictional interview performance and design a stronger preparation and response strategy.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Identify evidence of preparation, listening and professional communication.", "Analyse the relevance and strength of two answers.", "Consider verbal, non-verbal and inclusive communication.", "Recommend specific changes before the next interview."], successCriteria: ["Judges performance using observable evidence.", "Improves answers through relevant context–action–result examples.", "Provides practical, inclusive preparation and reflection strategies."], theoryAnchors: ["M02-S03-theory", "M02-S03-example"] }
          })
        ]
      },
      M03: {
        moduleId: "M03",
        title: "Workplace Communication",
        outcomes: outcomes(1, 2, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "M03-S01",
            title: "Purpose, audience and communication channels",
            learningIntention: "Select and interpret workplace communication according to purpose, audience, context and risk.",
            successCriteria: ["I can identify the purpose and audience of a message.", "I can justify an appropriate spoken, written, numerical or visual channel.", "I can use listening and questions to check shared understanding."],
            theoryParagraphs: [
              "Workplace communication has a purpose: to inform, instruct, request, confirm, persuade, record, warn, solve or build a relationship. It also has an audience whose knowledge, authority, language, culture and access needs affect the message. Effective communicators decide what the receiver needs to know, what action is expected and what evidence or record is required. They do not assume that sending information means it has been understood.",
              "Channels include face-to-face discussion, telephone or video, email, messaging, forms, reports, diagrams, numerical records and presentations. Spoken communication allows quick questions but may leave no record. Written communication can be checked and retained but may be too slow for an immediate hazard. Visual and numerical forms can make patterns or spatial information clearer, provided labels and values are accurate. Channel choice therefore depends on urgency, complexity, confidentiality, accessibility and the need for confirmation.",
              "Meaning is completed by the receiver. Active listening involves attention, relevant questions, paraphrasing and checking instructions rather than waiting to speak. Open questions invite detail; closed questions confirm a fact. Technical information may require definitions, diagrams or a demonstration. Confidential information should be shared only through authorised channels with people who need it for their role. When communication crosses cultures or abilities, clarity and respectful checking are stronger than assumptions about what another person should understand."
            ],
            workedExample: { title: "Choosing a channel for a delivery problem", context: "A driver discovers that a delivery address conflicts with the order record. The customer is waiting, and the correction must also be documented.", analysis: "The driver uses an immediate authorised channel to contact the relevant coordinator, states the conflicting facts and asks a closed question to confirm the correct address. After the decision, the change is recorded in the system. The response combines speed with an accurate record and shares customer information only through the approved process." },
            vocabulary: [
              { term: "audience", meaning: "the person or group for whom a message is designed" },
              { term: "communication channel", meaning: "the medium used to send or receive a message" },
              { term: "active listening", meaning: "listening that uses attention, questions and checking to establish understanding" },
              { term: "open question", meaning: "a question that invites explanation rather than a short fixed answer" },
              { term: "confidentiality", meaning: "the controlled handling of information so it is available only to authorised people" }
            ],
            misconception: { claim: "If a message was sent, communication was successful.", correction: "Communication is successful only when the intended meaning and required action are understood well enough for the context." },
            appliedActivity: { id: "ALA-M03-S01", title: "Channel decision lab", prompt: "For six workplace messages, select a channel, justify it using urgency, complexity, record, confidentiality and access, then add a method for checking understanding.", evidence: "A channel decision table and two model messages." },
            visual: { id: "VIS-M03-S01", file: "assets/visuals/m03-s01.webp", alt: "A realistic workplace communication hub showing a face-to-face briefing, phone call, labelled diagram, email record and confidential system message connected to different purposes.", purpose: "Show that channel choice depends on the communication job rather than personal habit." },
            mediaAlternative: { title: "Communication channel case", before: "Rank five message types from low to high urgency.", during: "Note audience, record and confidentiality needs.", after: "Defend the channel choice for the highest-risk message." },
            applicationQuestions: [
              aq("Which channel is strongest for an immediate hazard that also needs a record?", "Give the immediate warning through the confirmed urgent channel, then record it as required", "Urgency and documentation can require a combined channel strategy.", [["Wait to mention it in next month’s newsletter", "The delay does not match the risk."], ["Post it publicly with names", "Public sharing can breach privacy and procedure."], ["Assume someone else noticed", "The message has not been communicated or confirmed."]]),
              aq("What does an open question do?", "Invites the other person to explain needs, reasons or detail", "Open questions are useful when the communicator needs more than a fixed fact.", [["Guarantees a yes answer", "That describes a leading or closed form, not an open question."], ["Ends discussion immediately", "Open questions usually extend useful explanation."], ["Removes the need to listen", "The answer still requires active listening."]]),
              aq("Why paraphrase an instruction?", "To check that the receiver’s understanding matches the intended meaning", "Paraphrasing reveals misunderstanding before action.", [["To make the speaker feel less important", "The purpose is checking meaning, not status."], ["To replace every written record", "Some instructions still require documentation."], ["To add details that were never stated", "A paraphrase should test, not invent, meaning."]]),
              aq("Which factor most strongly supports using a diagram with text?", "The task contains spatial or visual relationships that words alone may obscure", "A purposeful visual can improve technical understanding when it is accurately labelled.", [["The diagram looks decorative", "Decoration is not a communication need."], ["The labels can be omitted", "Unlabelled visuals may create ambiguity."], ["The audience has no access to the visual", "An inaccessible channel cannot communicate effectively without an alternative."]]),
              aq("What best corrects the belief that sending equals communicating?", "Check the receiver’s understanding and the required action", "Communication includes reception and meaning, not transmission alone.", [["Send the same unclear message repeatedly", "Repetition does not repair unclear meaning."], ["Blame the receiver before checking", "A communication failure should be investigated rather than assumed."], ["Use the most complex channel available", "Complexity should match the purpose and audience."]])
            ],
            longResponse: { id: "M03-S01-LR01", prompt: "Justify a communication plan for a complex workplace situation involving urgency, confidentiality and different audiences.", higherOrderVerb: "justify", scaffoldPrompts: ["Identify each audience and the action they need to take.", "Compare possible channels using urgency, complexity, record and access.", "Explain how confidentiality will be protected.", "Include a method for checking and documenting understanding."], successCriteria: ["Matches channels to purpose and audience.", "Balances urgency with confidentiality and record needs.", "Builds in active checking of understanding."], theoryAnchors: ["M03-S01-theory", "M03-S01-example"] }
          }),
          createSection({
            id: "M03-S02",
            title: "Professional spoken, written and digital communication",
            learningIntention: "Compose clear, courteous and accurate workplace messages across spoken, written and digital settings.",
            successCriteria: ["I can structure a message around purpose and action.", "I can adjust tone and format while preserving accuracy.", "I can use workplace technology responsibly and inclusively."],
            theoryParagraphs: [
              "Professional communication is clear, concise, correct, courteous and suited to the workplace. Spoken messages use an audible pace, relevant detail and listening. Written messages use a subject or heading, logical order, accurate spelling and punctuation, and a clear requested action. Numerical and visual messages need correct units, labels and calculations. These features are not about sounding formal for its own sake; they reduce ambiguity and help people act efficiently.",
              "Tone communicates the relationship as well as the information. A message to a customer, colleague or supervisor may differ in detail and formality, but all should remain respectful and honest. Personal presentation, body language and personal space can affect how a spoken message is received, yet cultural and individual differences require care. Inclusive communication provides accessible formats or alternatives where needed and avoids jokes, slang or assumptions that could exclude or offend.",
              "Digital tools support email, scheduling, documents, spreadsheets, databases, presentations, research and transactions. Responsible use follows workplace policy, protects accounts and confidential information, checks recipients and attachments, and separates personal activity from authorised work. Social media, personal devices and generative tools do not remove the worker’s responsibility for accuracy, privacy and authorship. If a digital message could cause harm when forwarded or misread, it deserves a slower review before sending."
            ],
            workedExample: { title: "Rewriting an unclear shift email", context: "A team email says, ‘Roster changed. You know what to do,’ with no date, affected shifts or contact point.", analysis: "The revised message uses a specific subject, states when the change begins, identifies where the confirmed roster can be checked, explains who should respond and gives the authorised contact for questions. It avoids sharing unnecessary personal details. The change is now actionable and leaves a reliable record, while the actual roster decision remains with the workplace." },
            vocabulary: [
              { term: "professional tone", meaning: "a respectful and purpose-appropriate manner of communication" },
              { term: "plain language", meaning: "clear, direct wording designed to be understood by its intended audience" },
              { term: "digital footprint", meaning: "the lasting record created by a person’s online actions and content" },
              { term: "accessibility", meaning: "designing communication so people with differing needs can perceive and use it" },
              { term: "netiquette", meaning: "respectful and responsible behaviour in digital communication" }
            ],
            misconception: { claim: "Professional writing must use long words and complicated sentences.", correction: "Professional writing prioritises accurate, respectful meaning and a clear action; plain language is often stronger." },
            appliedActivity: { id: "ALA-M03-S02", title: "Message makeover studio", prompt: "Repair five fictional workplace messages with problems in purpose, tone, accuracy, accessibility or privacy. Annotate each change and identify the workplace check still required.", evidence: "Five revised messages and a short editing rationale for each." },
            visual: { id: "VIS-M03-S02", file: "assets/visuals/m03-s02.webp", alt: "A realistic split view of a worker giving a concise verbal briefing and editing an email for subject, action, recipient, attachment and accessibility.", purpose: "Connect professional message quality across spoken and digital modes." },
            mediaAlternative: { title: "Edit along: workplace messages", before: "Identify the purpose and required action in each message.", during: "Mark unclear wording, tone, privacy and access issues.", after: "Produce a plain-language version and explain one improvement." },
            applicationQuestions: [
              aq("Which email opening is most actionable?", "Subject: Confirm availability for 12 September roster; reply by 3 pm Friday", "The subject identifies the task, date and response deadline.", [["Hi!!! Important stuff!!!", "Urgency marks do not explain the required action."], ["Roster", "The subject is too vague to support quick action."], ["A long paragraph containing no request", "Information without a clear action may be overlooked."]]),
              aq("What should happen before sending a message containing personal information?", "Check the authorised channel, recipient, necessity and attachment", "Privacy requires deliberate control of what is shared and with whom.", [["Add every team member just in case", "Unnecessary recipients increase privacy risk."], ["Post it in a public group", "Public channels are inappropriate for confidential information."], ["Assume recall will fix any error", "A sent message may be copied or retained."]]),
              aq("Which sentence uses the strongest plain language?", "Please submit the completed form by 4 pm Thursday so payroll can process it", "The sentence names the action, deadline and reason directly.", [["It is incumbent upon you to effectuate the documentation", "Unnecessary complexity obscures the action."], ["Do the thing soon", "The task and deadline are unclear."], ["Failure will be catastrophic!!!", "The tone is disproportionate and still lacks useful detail."]]),
              aq("How can a presentation improve accessibility?", "Use readable contrast, meaningful headings, alt text or description and an equivalent way to access key information", "Accessibility requires content to be perceivable and usable in more than one way.", [["Put all text into one dense image", "Image-only text can be difficult or impossible to access."], ["Use colour as the only meaning", "People may not perceive the colour distinction."], ["Make captions decorative rather than accurate", "Captions need to carry the actual information."]]),
              aq("What best corrects the claim that complicated writing is more professional?", "Use accurate plain language and the level of detail the audience needs", "Professionalism is shown through clarity, respect and correctness.", [["Remove all technical terms even when essential", "Technical terms can be used when needed and explained appropriately."], ["Use slang in every formal record", "Slang may reduce clarity or suitability."], ["Write without proofreading because the words are simple", "Plain language still requires accuracy and checking."]])
            ],
            longResponse: { id: "M03-S02-LR01", prompt: "Compare two versions of a workplace message and justify a final version for a specific audience and digital channel.", higherOrderVerb: "compare", scaffoldPrompts: ["Identify the purpose, audience and action.", "Compare clarity, tone, accuracy, privacy and accessibility.", "Revise the message in plain language.", "Justify the final structure and channel checks."], successCriteria: ["Produces an accurate and actionable message.", "Explains choices using audience, tone, privacy and access.", "Uses a professional format suited to the channel."], theoryAnchors: ["M03-S02-theory", "M03-S02-example"] }
          }),
          createSection({
            id: "M03-S03",
            title: "Feedback, conflict and communication repair",
            learningIntention: "Use feedback, negotiation and communication repair to address disagreement or misunderstanding constructively.",
            successCriteria: ["I can distinguish position, interest and evidence in a disagreement.", "I can give and receive constructive feedback.", "I can design a proportionate repair or escalation response."],
            theoryParagraphs: [
              "Misunderstanding and disagreement are normal risks in workplaces because people have different roles, information, priorities and communication styles. Conflict becomes more manageable when people separate the issue from personal attack. A position is what someone says they want; an interest is the need or concern underneath it. Clarifying facts, listening actively and finding shared goals can reveal more options than arguing over fixed positions.",
              "Constructive feedback describes observable behaviour or work, explains its effect and identifies a practical next step. The receiver listens, asks questions, checks examples and decides what action is required rather than responding only to tone. Feedback can also be inaccurate or poorly delivered; receiving it professionally does not require automatic agreement. The person can seek evidence, clarify expectations and use the appropriate review pathway.",
              "Communication repair acknowledges the misunderstanding, corrects the record, checks impact and agrees on a next action. Negotiation may involve priorities, common ground, options, concessions and confirmation. Some matters can be resolved informally; repeated, unsafe, discriminatory or serious issues may need formal support or escalation. The exact local process must come from the current workplace process and authoritative guidance; ask your teacher or another trusted adult for help locating it. Students should document facts and seek appropriate help rather than improvising mediation, disciplinary or legal procedures."
            ],
            workedExample: { title: "Repairing a missed handover", context: "Sam believed Kai would finish a customer update; Kai believed Sam had accepted the task. The customer received no response.", analysis: "They avoid arguing about who ‘always’ fails. Each states the message they received, checks the handover record and identifies the missing confirmation. They apologise to the customer through the authorised channel, allocate the immediate task and add a closed-loop handover: sender names the task and deadline, receiver confirms, and both can see the record. Repair addresses the impact and the system." },
            vocabulary: [
              { term: "feedback", meaning: "information about performance or behaviour used to recognise strengths and guide improvement" },
              { term: "position", meaning: "the stated outcome a person says they want in a disagreement" },
              { term: "interest", meaning: "the underlying need, concern or priority behind a stated position" },
              { term: "negotiation", meaning: "a process of discussing differences to seek an acceptable agreement" },
              { term: "communication repair", meaning: "action that corrects misunderstanding, addresses impact and restores a workable shared understanding" }
            ],
            misconception: { claim: "Conflict is solved when one person wins and the other gives up.", correction: "Durable resolution often depends on evidence, interests, shared goals and a clear agreement; serious matters may require appropriate escalation." },
            appliedActivity: { id: "ALA-M03-S03", title: "Repair the handover", prompt: "Analyse a fictional conflict transcript. Mark positions, interests, facts and assumptions, then rewrite the exchange using active listening, constructive feedback and a confirmed next action.", evidence: "An annotated transcript, repaired dialogue and escalation decision." },
            visual: { id: "VIS-M03-S03", file: "assets/visuals/m03-s03.webp", alt: "Two workers reviewing a missed handover record, identifying different assumptions and confirming a corrected task and deadline.", purpose: "Show communication repair as evidence, acknowledgement and a changed process rather than blame." },
            mediaAlternative: { title: "Conflict transcript analysis", before: "Predict the difference between each person’s position and interest.", during: "Highlight facts, assumptions, impact and repair attempts.", after: "Write a closing agreement that is specific and checkable." },
            applicationQuestions: [
              aq("What is the best opening to a communication repair?", "State the specific misunderstanding and its impact without attacking the person", "Specific, neutral language makes evidence and repair possible.", [["You always ruin everything", "A global personal attack escalates conflict and hides the issue."], ["Pretend nothing happened", "The impact and system remain unaddressed."], ["Tell unrelated colleagues first", "Widening the conflict may breach privacy and does not repair the handover."]]),
              aq("Two workers argue over a shift. What may reveal more options?", "Identify the underlying interests, such as caring commitments, coverage and fairness", "Interests explain why positions matter and can support alternatives.", [["Repeat each fixed position more loudly", "Volume does not expand the options."], ["Invent facts about the other person", "Assumptions weaken trust and reasoning."], ["Promise both people the same shift", "A contradictory promise is not a workable agreement."]]),
              aq("Which feedback is most constructive?", "The stock count was missing two items; use the checklist and ask me to review the next count", "It identifies evidence, effect and a practical next step.", [["You are hopeless", "The label is personal and gives no actionable evidence."], ["Everything was fine", "This hides the issue and provides no guidance."], ["Remember every mistake anyone has made", "Overloading the discussion prevents focused improvement."]]),
              aq("When should a matter be considered for formal support or escalation?", "When it is serious, unsafe, discriminatory, repeated or not resolved through an appropriate informal response", "The response should match the risk and use the confirmed workplace pathway.", [["Whenever two people have a minor preference difference", "Many low-risk differences can be clarified directly."], ["Only after evidence has been destroyed", "Relevant facts should be preserved early."], ["Through a public social-media poll", "Public attention is not a safe formal workplace process."]]),
              aq("What best corrects the belief that conflict requires one winner?", "Seek a clear agreement based on evidence, interests, shared goals and role limits", "Resolution aims for a workable outcome, not personal victory.", [["Avoid every disagreement permanently", "Avoidance can leave the issue unresolved."], ["Agree to an impossible promise", "An agreement must be realistic and checkable."], ["Remove all workplace expectations", "Clear expectations help prevent and resolve conflict."]])
            ],
            longResponse: { id: "M03-S03-LR01", prompt: "Evaluate a workplace conflict response and design a communication repair and escalation plan.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Separate positions, interests, facts and assumptions.", "Assess the feedback and listening used by each person.", "Design a repair that acknowledges impact and confirms action.", "Justify whether informal resolution or further support is appropriate."], successCriteria: ["Uses evidence rather than personal labels.", "Builds a specific, checkable repair agreement.", "Matches escalation to seriousness and avoids inventing a local procedure."], theoryAnchors: ["M03-S03-theory", "M03-S03-example"] }
          })
        ]
      },
      M04: {
        moduleId: "M04",
        title: "Teamwork and Enterprise Skills",
        outcomes: outcomes(3, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "M04-S01",
            title: "Team roles, trust and shared goals",
            learningIntention: "Explain how clear roles, trust, communication and shared goals support effective teams.",
            successCriteria: ["I can distinguish a team role from a person’s status.", "I can explain how trust is built through observable behaviour.", "I can propose a fair response to uneven contribution or disagreement."],
            theoryParagraphs: [
              "A team is more than people placed together. Members coordinate different contributions towards a shared goal and are jointly affected by the result. Roles may involve leadership, planning, specialist work, communication, checking or support, and can change across a project. Effective allocation considers the task, capability, development needs, workload and accountability rather than stereotypes about age, gender, culture or personality.",
              "Trust develops when people are reliable, communicate honestly, meet commitments, admit uncertainty, protect agreed information and treat others respectfully. Psychological safety supports appropriate questions and early reporting of mistakes; it does not remove standards or accountability. Shared goals become useful when the team agrees on the intended result, indicators, responsibilities, decision process and deadlines. A goal that exists only in one person’s head cannot coordinate the team.",
              "Team communication uses active listening, clear records, inclusive meetings and constructive feedback. Disagreement can improve a decision when members challenge ideas with evidence and remain focused on the goal. Uneven contribution should be addressed through facts, clarification and task review before personal judgement. Strong teams monitor both the product and the process: what has been achieved, whose work is blocked, what needs to change and what each member is learning."
            ],
            workedExample: { title: "Rebalancing a stalled event team", context: "A four-person team is planning an event. Two members duplicate publicity work while bookings and risk questions are untouched.", analysis: "The team returns to the shared goal, lists the remaining outputs and checks each person’s capacity. It assigns one owner and one check point for each task, records dependencies and schedules a brief review. The change is not a punishment; it makes responsibility visible and reduces duplicated effort. Members can still support one another without making ownership unclear." },
            vocabulary: [
              { term: "shared goal", meaning: "an agreed result that coordinates the effort of all team members" },
              { term: "team role", meaning: "a defined contribution or responsibility within collective work" },
              { term: "trust", meaning: "confidence built through reliable, honest and respectful behaviour over time" },
              { term: "psychological safety", meaning: "a team climate in which people can raise questions, concerns or mistakes without humiliation" },
              { term: "accountability", meaning: "being answerable for an agreed action, decision or result" }
            ],
            misconception: { claim: "Good teamwork means everyone does the same amount of every task.", correction: "Fair teamwork coordinates different contributions, workloads and development while keeping ownership and accountability clear." },
            appliedActivity: { id: "ALA-M04-S01", title: "Team charter under pressure", prompt: "Create a charter for a fictional four-person team, then apply it to a missed-deadline scenario by reallocating tasks without using stereotypes or blame.", evidence: "A one-page charter, revised role map and justified response note." },
            visual: { id: "VIS-M04-S01", file: "assets/visuals/m04-s01.webp", alt: "A realistic mixed team around a project board with one shared goal, distinct task owners, check points and a visible question-and-support space.", purpose: "Show trust and shared goals as concrete team practices rather than vague friendliness." },
            mediaAlternative: { title: "Team meeting observation", before: "Predict which behaviours will build or weaken trust.", during: "Record evidence of listening, ownership, questioning and follow-through.", after: "Recommend one change to the team’s process." },
            applicationQuestions: [
              aq("Which role allocation is fairest?", "Match tasks to requirements and capacity, include development opportunities and make ownership visible", "Fairness considers contribution, workload and learning rather than identical tasks.", [["Give all complex work to the oldest person", "Age is not evidence of capability or fair workload."], ["Let every task have no owner", "Unclear ownership weakens accountability."], ["Give one person all work because they are quick", "This is unsustainable and blocks team development."]]),
              aq("Which behaviour most directly builds trust?", "Meeting an agreed deadline or communicating early when it is at risk", "Reliability includes both follow-through and honest early warning.", [["Hiding a delay until the final day", "Secrecy removes the team’s chance to respond."], ["Agreeing publicly but refusing privately", "Inconsistent behaviour weakens confidence."], ["Making promises beyond capacity", "Unrealistic promises do not create reliable performance."]]),
              aq("What does psychological safety allow?", "People can raise a concern or mistake respectfully while standards remain", "Safety supports learning and early problem-solving, not freedom from accountability.", [["No one can receive feedback", "Constructive feedback remains necessary."], ["Every idea must be accepted", "Ideas can still be tested with evidence."], ["Deadlines no longer matter", "Team expectations continue to apply."]]),
              aq("Two team members disagree about a plan. What is the strongest next step?", "Restate the shared goal, compare evidence and agree on a decision method", "Goal and evidence keep the disagreement focused on the work.", [["Attack each other’s personality", "Personal attack does not test the plan."], ["Ask social media to choose", "An outside popularity vote may ignore the project evidence and authority."], ["Run both incompatible plans without coordination", "Contradictory action wastes resources and increases risk."]]),
              aq("What best corrects the belief that everyone must do identical work?", "Coordinate different, transparent contributions towards the shared result", "Teams use varied strengths while maintaining fair workload and accountability.", [["Allow some members to have no contribution", "Difference does not remove responsibility."], ["Never rotate or develop roles", "Teams can deliberately build new capability."], ["Measure fairness only by task count", "Tasks differ in time, difficulty and responsibility."]])
            ],
            longResponse: { id: "M04-S01-LR01", prompt: "Evaluate the effectiveness and fairness of a fictional team, then redesign its roles and trust practices.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Explain the shared goal and current roles.", "Use behaviour evidence to assess trust and accountability.", "Identify workload, inclusion or communication problems.", "Redesign roles, check points and feedback practices."], successCriteria: ["Supports team judgements with observable evidence.", "Allocates clear and fair responsibilities without stereotypes.", "Connects the redesign to both the goal and team learning."], theoryAnchors: ["M04-S01-theory", "M04-S01-example"] }
          }),
          createSection({
            id: "M04-S02",
            title: "Initiative, problem-solving and decision-making",
            learningIntention: "Apply a disciplined problem-solving process and use initiative within role, evidence and risk limits.",
            successCriteria: ["I can define a problem before selecting a solution.", "I can compare options against explicit criteria and risks.", "I can distinguish responsible initiative from acting beyond authority."],
            theoryParagraphs: [
              "Problem-solving starts by defining the gap between the current and desired situation. A symptom is not always the cause: repeated late orders could reflect unclear information, unrealistic scheduling, a supply problem or several factors. Useful problem definitions identify who is affected, what evidence exists, constraints and the desired result. Teams gather enough information to act without pretending that every uncertainty can be removed.",
              "Options are compared against criteria such as effectiveness, time, cost, safety, fairness, resources, authority and likely side effects. A decision matrix can make reasoning visible, but scores do not replace judgement; the criteria and weightings must be justified. After action, the team monitors indicators and adjusts. A failed idea can produce useful learning when assumptions and results are recorded honestly.",
              "Initiative is appropriate independent action within a person’s role and the situation’s risk. It may involve anticipating a need, suggesting an improvement, gathering information or completing an agreed next step without repeated prompting. Initiative does not authorise bypassing safety controls, privacy, budget limits or another person’s responsibility. When impact or uncertainty is high, escalation and clarification are part of good judgement."
            ],
            workedExample: { title: "Solving repeated late starts", context: "A student enterprise team begins production late at every session and initially blames motivation.", analysis: "The team observes that tools, instructions and materials are collected only after the session begins. It defines the problem as an unprepared start process, not a character flaw. Options include a pre-session checklist, assigned setup role and staged materials. The team selects a checklist and rotating owner, measures start time for three sessions and reviews. Initiative operates within the agreed project and does not bypass equipment or safety authorisation." },
            vocabulary: [
              { term: "problem definition", meaning: "a clear statement of the current gap, evidence, people affected and desired result" },
              { term: "constraint", meaning: "a limit or condition that a solution must respect" },
              { term: "decision criterion", meaning: "a standard used to compare possible actions" },
              { term: "initiative", meaning: "appropriate independent action taken within role, evidence and risk limits" },
              { term: "monitoring", meaning: "systematic checking of progress and results against intended indicators" }
            ],
            misconception: { claim: "Taking initiative means acting first and asking permission later.", correction: "Responsible initiative respects authority, safety, privacy and resources; clarification can be the most capable action." },
            appliedActivity: { id: "ALA-M04-S02", title: "Decision under constraints", prompt: "Solve a fictional workplace delay using a problem statement, cause evidence, four options, weighted criteria and a monitoring plan. Mark any decision that needs authority.", evidence: "A completed decision matrix and 150-word recommendation." },
            visual: { id: "VIS-M04-S02", file: "assets/visuals/m04-s02.webp", alt: "A realistic team moving from observed evidence to a defined problem, compared options, an authorised action and a results review.", purpose: "Teach problem-solving as an evidence cycle rather than a rush to the first idea." },
            mediaAlternative: { title: "Stop the rush to solution", before: "Write the first apparent symptom in a case.", during: "Separate causes, constraints, options and authority limits.", after: "Choose an indicator that could show whether the action worked." },
            applicationQuestions: [
              aq("Why define a problem before choosing a solution?", "The same symptom can have different causes requiring different responses", "A clear definition reduces the risk of solving the wrong problem.", [["Definitions guarantee there is no uncertainty", "Uncertainty can remain even after careful definition."], ["The first solution is always correct", "Early ideas still need comparison."], ["It delays action for no reason", "Proportionate definition can save time and resources."]]),
              aq("Which is a useful decision criterion for a new process?", "How effectively and safely it meets the goal within available time and resources", "Criteria should connect the option to goals and constraints.", [["Whether the option has the funniest name", "Novelty of a label does not show effectiveness."], ["Whether one person chose it before discussion", "Origin does not prove quality."], ["Whether it hides all disadvantages", "Sound decisions make trade-offs visible."]]),
              aq("When is escalation evidence of good initiative?", "When the issue exceeds the worker’s authority or carries significant risk", "Recognising limits protects people and decisions.", [["Only after concealing the problem", "Early escalation may preserve more options."], ["Whenever a routine task requires ordinary effort", "Initiative can handle appropriate routine action."], ["When the worker wants to avoid all responsibility", "Escalation should be purposeful, not avoidance."]]),
              aq("What makes monitoring useful?", "An agreed indicator, timeframe and decision about what results will trigger review", "Monitoring links evidence to adaptation.", [["Collecting unrelated data forever", "Data needs a purpose and review point."], ["Changing the goal after every result", "Goals may be reviewed, but not manipulated to hide performance."], ["Recording only successes", "Selective evidence prevents honest learning."]]),
              aq("What best corrects the idea that initiative means acting without permission?", "Act independently within known limits and seek authority when impact or uncertainty requires it", "Initiative includes judgement about when not to proceed alone.", [["Never act without constant prompting", "That removes appropriate independence."], ["Ignore all role limits", "This can create safety, financial or privacy harm."], ["Assume enthusiasm replaces evidence", "Motivation does not establish that an action is sound."]])
            ],
            longResponse: { id: "M04-S02-LR01", prompt: "Apply a problem-solving process to a workplace scenario and justify the point at which initiative should become escalation.", higherOrderVerb: "apply", scaffoldPrompts: ["Define the problem using evidence and desired result.", "Identify likely causes, constraints and authority limits.", "Compare at least three options using explicit criteria.", "Recommend an action, escalation point and monitoring plan."], successCriteria: ["Distinguishes symptoms from a defensible problem definition.", "Compares options using relevant criteria and risks.", "Explains initiative and escalation within role limits."], theoryAnchors: ["M04-S02-theory", "M04-S02-example"] }
          }),
          createSection({
            id: "M04-S03",
            title: "Enterprise skills in authentic work",
            learningIntention: "Explain how enterprise skills create value through purposeful ideas, organised action and evidence-led adaptation.",
            successCriteria: ["I can identify enterprise skills in business, community, school or sporting contexts.", "I can distinguish an idea from an implemented enterprise response.", "I can evaluate value, risk and learning using evidence."],
            theoryParagraphs: [
              "Enterprise is the capacity to identify an opportunity or need and organise action that creates value. Value may be financial, social, environmental, educational or a combination. Enterprise skills include initiative, creativity, communication, teamwork, planning, resourcefulness, calculated risk, resilience and reflection. They are used by employees and community members as well as business owners. A useful idea becomes enterprising only when people investigate the need, plan responsibly and act.",
              "Authentic enterprise begins with stakeholders and evidence. Teams ask who experiences the need, what is already available, what constraints apply and what success would look like. They set goals, targets and deadlines; allocate resources; obtain required authority; communicate; monitor progress; and respond to issues. Innovation can be a new product, service or process, but can also be a thoughtful improvement to something existing.",
              "Risk and return are connected, but risk should be calculated rather than celebrated. Teams identify possible harms or losses, estimate likelihood and impact, apply controls and decide whether the remaining risk is acceptable within authority. Evaluation considers the quality of the outcome and development of enterprise skills. Honest evidence includes what did not work and why. This makes the learning transferable to future employment, projects and community action."
            ],
            workedExample: { title: "Improving a community collection", context: "A school collection receives many unsuitable items and volunteers spend hours sorting them.", analysis: "A team interviews the receiving organisation, identifies the most-needed items and redesigns the process with a clear list, labelled collection points and a weekly count. It gains school approval before launch, assigns communication and monitoring roles and compares unsuitable-item rates. The enterprise value comes from reducing waste and meeting a real community need, not simply collecting the largest volume." },
            vocabulary: [
              { term: "enterprise", meaning: "organised action that responds to an opportunity or need and creates value" },
              { term: "stakeholder", meaning: "a person or group affected by or able to influence an activity" },
              { term: "innovation", meaning: "a new or improved product, service or process that creates useful value" },
              { term: "calculated risk", meaning: "a risk considered through evidence, consequences and controls before action" },
              { term: "value", meaning: "the financial, social, environmental or educational benefit created for stakeholders" }
            ],
            misconception: { claim: "Enterprise skills matter only to entrepreneurs starting businesses.", correction: "Employees, teams, schools and community groups use enterprise skills whenever they identify needs and organise value-creating action." },
            appliedActivity: { id: "ALA-M04-S03", title: "Enterprise opportunity brief", prompt: "Identify a school or community need, gather privacy-safe stakeholder evidence and propose a small response with value, roles, resources, risks, authority points and success indicators.", evidence: "A two-page enterprise brief; implementation is not required or authorised by this activity." },
            visual: { id: "VIS-M04-S03", file: "assets/visuals/m04-s03.webp", alt: "A realistic school-community team consulting a stakeholder, planning an improvement, testing it and reviewing impact data.", purpose: "Show enterprise as investigated, authorised and evaluated value creation." },
            mediaAlternative: { title: "Enterprise case deconstruction", before: "Predict the stakeholder need and type of value.", during: "Track evidence, planning, calculated risk and adaptation.", after: "Judge whether the activity created value or merely stayed busy." },
            applicationQuestions: [
              aq("Which example best demonstrates enterprise?", "A worker investigates repeated customer confusion and helps test an authorised clearer process", "The worker identifies a need, organises action and creates value within authority.", [["A worker complains but gathers no information or acts", "Noticing alone has not become organised action."], ["A team copies a costly idea without checking need", "Unexamined copying may waste resources."], ["A person takes an unmanaged safety risk for attention", "Recklessness is not calculated enterprise."]]),
              aq("Why consult stakeholders before planning?", "They can reveal needs, constraints and success measures the team may otherwise miss", "Stakeholder evidence improves relevance and feasibility.", [["To guarantee everyone agrees", "Consultation does not remove legitimate differences."], ["To transfer all responsibility to them", "The team remains responsible for its authorised work."], ["To collect private information without a purpose", "Evidence gathering must remain necessary and safe."]]),
              aq("What distinguishes calculated risk from recklessness?", "Evidence, consequence analysis, controls and an authorised decision", "Calculated risk makes uncertainty visible and managed.", [["The person feels confident", "Confidence alone does not assess harm."], ["No one records the decision", "Lack of records weakens accountability and learning."], ["The possible reward is exciting", "Reward does not remove the need to consider consequences."]]),
              aq("Which evaluation best measures enterprise value?", "Compare intended stakeholder benefit and skill development with actual evidence and unintended effects", "Value needs stakeholder-focused outcome evidence and honest reflection.", [["Count only how busy the team felt", "Effort does not prove value."], ["Use only the project’s logo quality", "Branding is not the whole outcome."], ["Ignore negative results", "Unintended effects are essential to evaluation."]]),
              aq("What best corrects the idea that enterprise belongs only to business owners?", "Enterprise skills are used whenever people identify needs and organise improvements across work or community settings", "The underlying skills transfer across contexts.", [["Every activity automatically counts as enterprise", "It still needs purposeful, organised value creation."], ["Employees should never suggest improvements", "Appropriate initiative is part of many roles."], ["Only profit can be valuable", "Value may also be social, environmental or educational."]])
            ],
            longResponse: { id: "M04-S03-LR01", prompt: "Evaluate a proposed enterprise response to a community or workplace need and recommend whether it should proceed to authorised planning.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Define the need and stakeholder evidence.", "Analyse the proposed value, roles and resources.", "Assess risks, controls, authority and possible unintended effects.", "Recommend proceed, revise or stop and justify the decision."], successCriteria: ["Connects the response to a genuine evidenced need.", "Balances value with feasibility, risk and authority.", "Uses clear indicators for outcome and skill learning."], theoryAnchors: ["M04-S03-theory", "M04-S03-example"] }
          })
        ]
      },
      M05: {
        moduleId: "M05",
        title: "Managing Work and Life Commitments",
        outcomes: outcomes(2, 3, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "M05-S01",
            title: "Time, priorities and realistic boundaries",
            learningIntention: "Plan competing work and life commitments using priorities, capacity, communication and boundaries.",
            successCriteria: ["I can distinguish urgent, important and negotiable commitments.", "I can build a realistic plan that includes travel, recovery and uncertainty.", "I can communicate a boundary before a commitment fails."],
            theoryParagraphs: [
              "Work and life commitments draw on limited time, energy, attention and money. A schedule becomes realistic only when it includes the full demand: preparation, travel, transitions, caring, study, sleep and recovery, not just the visible appointment. Prioritising means deciding which commitments are essential, time-sensitive, valuable or negotiable. It does not mean treating every request as equally urgent.",
              "Planning works at several levels. A calendar locates fixed events; a task list defines actions; time estimates and buffers recognise uncertainty; and review points expose overload early. Large tasks become more manageable when divided into a clear next action and milestone. Digital tools can help, but an overcrowded electronic calendar is still overcrowded. The purpose of a system is to support decisions, not display busyness.",
              "Boundaries explain what a person can reasonably do and when. They are strongest when communicated early, respectfully and with a workable alternative where possible. Some workplace obligations or life events cannot simply be moved, so people may need to clarify expectations, seek leave or support through the confirmed process, adjust discretionary commitments or renegotiate a deadline. Exact leave and roster arrangements must be checked through the current workplace process and authoritative guidance; ask your teacher or another trusted adult for help locating that information."
            ],
            workedExample: { title: "The hidden hours in a crowded week", context: "Tariq accepts three evening shifts, a major school task and weekend family responsibilities. His calendar shows each event but not travel, preparation or rest.", analysis: "Tariq adds the hidden hours and discovers that Thursday is impossible. He identifies the fixed assessment preparation and family commitment, checks the actual shift arrangement and communicates early through the confirmed channel rather than missing work. He also removes a discretionary event and sets a Sunday review. The improved plan uses capacity evidence instead of guilt or optimism." },
            vocabulary: [
              { term: "priority", meaning: "a commitment ranked for attention because of its importance, urgency or consequence" },
              { term: "capacity", meaning: "the realistic amount of time, energy and resources available for commitments" },
              { term: "boundary", meaning: "a communicated limit that protects responsibilities, wellbeing or role expectations" },
              { term: "buffer time", meaning: "planned spare time that allows for delay, transition or unexpected demand" },
              { term: "commitment", meaning: "an agreed responsibility or obligation that requires action or time" }
            ],
            misconception: { claim: "Good time management means fitting every request into the week.", correction: "Good management includes declining, renegotiating or sequencing demands when total capacity is insufficient." },
            appliedActivity: { id: "ALA-M05-S01", title: "Capacity-first weekly plan", prompt: "Rebuild a fictional overloaded week by adding hidden time, ranking commitments, protecting recovery, adding buffers and scripting one early boundary conversation.", evidence: "A before-and-after weekly plan plus a 100-word justification." },
            visual: { id: "VIS-M05-S01", file: "assets/visuals/m05-s01.webp", alt: "A realistic weekly planner showing work, study, caring, travel, preparation, sleep, buffers and one respectfully renegotiated commitment.", purpose: "Make invisible time and realistic capacity visible." },
            mediaAlternative: { title: "Rebuild an overloaded week", before: "Estimate the hidden time around each commitment.", during: "Classify fixed, flexible and discretionary demands.", after: "Explain one boundary that prevents likely failure." },
            applicationQuestions: [
              aq("Why include travel and preparation in a schedule?", "They use real capacity and can make an apparently free period unavailable", "A realistic plan accounts for the full demand.", [["They make the calendar look more impressive", "Appearance is not the planning purpose."], ["They guarantee nothing unexpected occurs", "Buffers help with uncertainty but cannot remove it."], ["They are optional even when required", "Necessary travel and preparation cannot be ignored safely."]]),
              aq("Which boundary is communicated most effectively?", "I cannot complete both by Friday; I can deliver the urgent part Friday and the remainder Monday—can we confirm priorities?", "The message is early, specific and offers a realistic path for clarification.", [["Whatever, I might do it", "The capacity and action remain unclear."], ["Say yes and disappear", "Avoidance increases impact and removes options."], ["Blame an unrelated colleague", "Blame does not clarify capacity or responsibility."]]),
              aq("A plan has no buffer. What is the main risk?", "One delay can cascade across several tightly connected commitments", "Buffers protect transitions and uncertainty.", [["Every task will finish early", "No evidence supports that assumption."], ["The calendar will become private", "Buffer time is unrelated to privacy."], ["Priorities will become identical", "Priorities and buffers are different planning tools."]]),
              aq("What is the best response when total demand exceeds capacity?", "Identify essentials, clarify obligations and renegotiate or remove lower-priority demands", "Planning requires a decision about trade-offs.", [["Work continuously without recovery", "This is unlikely to be sustainable and may increase errors."], ["Pretend the clash does not exist", "The commitments are still likely to fail."], ["Add more colour labels", "Formatting cannot create time or energy."]]),
              aq("What best corrects the claim that time management fits in everything?", "A sound plan protects essential commitments by making explicit choices and boundaries", "Capacity is limited, so exclusion and sequencing are legitimate planning actions.", [["Never accept any commitment", "Avoiding all responsibility is not balanced management."], ["Treat every request as urgent", "This removes meaningful priority."], ["Plan only after deadlines pass", "Early planning preserves options."]])
            ],
            longResponse: { id: "M05-S01-LR01", prompt: "Evaluate a fictional worker-student’s weekly commitments and redesign the plan to be realistic and sustainable.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Calculate visible and hidden time demands.", "Rank fixed, important, flexible and discretionary commitments.", "Identify overload, likely consequences and people needing communication.", "Create a revised plan with boundaries, buffers and a review point."], successCriteria: ["Uses capacity evidence rather than assumptions.", "Protects essential commitments and recovery.", "Justifies respectful, timely boundary decisions."], theoryAnchors: ["M05-S01-theory", "M05-S01-example"] }
          }),
          createSection({
            id: "M05-S02",
            title: "Wellbeing, stress and support",
            learningIntention: "Recognise work-related pressures and choose proportionate self-management and support strategies.",
            successCriteria: ["I can distinguish pressure, stress response and a workplace hazard or issue.", "I can identify early warning signs without diagnosing someone.", "I can select support matched to seriousness and context."],
            theoryParagraphs: [
              "Work can provide income, learning, purpose, social connection and satisfaction, while also creating pressure through workload, uncertainty, conflict, changing rosters, travel or competing responsibilities. Stress is a response to demands and resources; it is not proof that a person is weak. Short pressure may be manageable, but repeated or intense strain can affect concentration, sleep, relationships, health and safe performance. Students should describe observed signs and context rather than diagnosing themselves or others from a checklist.",
              "Self-management strategies include clarifying priorities, taking lawful breaks, planning work, using recovery time, reducing avoidable commitments and seeking feedback or training. These strategies can help but should not be used to excuse unsafe systems, bullying, discrimination or unreasonable demands. A useful analysis considers both personal actions and organisational or social influences. Responsibility for wellbeing is not located solely in the individual.",
              "Support can come from trusted people, supervisors, school staff, workplace representatives, health professionals or appropriate services. The right response depends on urgency, safety, privacy and the person’s needs. Immediate danger or serious health concern requires appropriate emergency or professional support, not a classroom activity. Use the relevant current workplace, school or service pathway and authoritative guidance; ask your teacher or another trusted adult for help locating it. Early help-seeking, factual records and a clear explanation of impact can make support more effective."
            ],
            workedExample: { title: "From silent overload to supported action", context: "Amelia is making frequent errors after several roster changes and caring demands. She tells herself that asking for help would prove she is unreliable.", analysis: "Amelia records the pattern without self-diagnosis, checks immediate safety, identifies the roster/caring clash and speaks to an appropriate trusted person through the confirmed process. She asks for priorities to be clarified and seeks support for the broader strain. A short planning strategy may help, but the response also examines the work conditions rather than treating Amelia as the sole cause." },
            vocabulary: [
              { term: "wellbeing", meaning: "a person’s capacity to function and experience physical, mental and social health" },
              { term: "stress response", meaning: "the physical, emotional or cognitive reaction to perceived demands" },
              { term: "protective factor", meaning: "a condition or resource that reduces risk or supports coping and recovery" },
              { term: "support network", meaning: "people and services a person can approach for practical, emotional or professional help" },
              { term: "recovery", meaning: "time and action that allow physical and mental resources to be restored" }
            ],
            misconception: { claim: "Workplace stress is always an individual attitude problem.", correction: "Stress can arise from interacting personal, work and social factors; effective responses may require both personal support and workplace change." },
            appliedActivity: { id: "ALA-M05-S02", title: "Pressure and support map", prompt: "Analyse a fictional case by mapping pressures, observable effects, protective factors, individual strategies, workplace factors and support options. Include an escalation boundary.", evidence: "A cause-and-support map and a 150-word proportionate response." },
            visual: { id: "VIS-M05-S02", file: "assets/visuals/m05-s02.webp", alt: "A realistic worker reviewing workload and warning signs with a trusted support person, with pathways to practical, workplace and professional help.", purpose: "Show wellbeing as an interaction between demands, resources, systems and support." },
            mediaAlternative: { title: "Case study: pressure is not diagnosis", before: "List only observable facts in the case.", during: "Separate individual, workplace and social influences.", after: "Match each proposed support to seriousness and purpose." },
            applicationQuestions: [
              aq("Which statement avoids diagnosing a colleague?", "They have missed two deadlines and said they are sleeping poorly; an appropriate check-in may help", "The statement uses observable evidence and a proportionate response.", [["They definitely have a specific disorder", "A student cannot diagnose from limited signs."], ["They are lazy", "A personal label ignores evidence and context."], ["Nothing matters until a crisis", "Early support can prevent escalation."]]),
              aq("Which response considers both person and system?", "Offer support while also reviewing workload, clarity, resources and workplace behaviour", "Wellbeing is influenced by interacting factors.", [["Tell the worker to become tougher", "This places all responsibility on the individual."], ["Assume planning skills solve bullying", "Personal organisation does not remove harmful behaviour."], ["Ignore personal needs because systems matter", "Individual support may still be necessary."]]),
              aq("What is a protective factor?", "A reliable support person and clear process for raising concerns", "Resources and supportive conditions can reduce risk and improve coping.", [["An unclear role with changing demands", "That may increase pressure rather than protect."], ["Avoiding all communication", "Isolation can reduce access to help."], ["Repeated missed recovery", "Insufficient recovery may increase strain."]]),
              aq("When should a classroom strategy give way to urgent help?", "When there is immediate danger or a serious health concern", "Urgent situations require appropriate emergency or professional response.", [["Only after the person solves it alone", "Waiting can increase harm."], ["Whenever a routine task feels mildly difficult", "Support should be proportionate; not every difficulty is an emergency."], ["After private details are posted publicly", "Public disclosure is not a safe help pathway."]]),
              aq("What best corrects the idea that stress is always an attitude problem?", "Examine demands, resources, workplace systems, social context and personal response together", "A multi-factor analysis supports fairer and more effective action.", [["Assume the workplace is always the only cause", "Personal and social factors may also interact."], ["Conclude stress can never be managed", "Support and change can improve many situations."], ["Use a checklist to diagnose everyone", "Checklists cannot replace professional assessment."]])
            ],
            longResponse: { id: "M05-S02-LR01", prompt: "Evaluate a fictional wellbeing case and justify a layered support response.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Describe observable pressures and effects without diagnosis.", "Separate personal, workplace and social influences.", "Identify protective factors and gaps.", "Recommend immediate, short-term and escalation supports."], successCriteria: ["Uses evidence and avoids labels or diagnosis.", "Balances individual strategies with workplace factors.", "Matches support to seriousness, privacy and purpose."], theoryAnchors: ["M05-S02-theory", "M05-S02-example"] }
          }),
          createSection({
            id: "M05-S03",
            title: "Adapting plans across changing life stages",
            learningIntention: "Adapt work and life plans as responsibilities, resources and opportunities change across life stages.",
            successCriteria: ["I can identify how life stages influence work choices without stereotyping.", "I can compare short-term coping with longer-term adaptation.", "I can design a reviewable plan for a major change."],
            theoryParagraphs: [
              "People’s work choices can change as study, housing, relationships, caring, health, finances and community responsibilities change. Life stage is useful for considering possible transitions, but it does not create one timetable that everyone follows. People of the same age may have very different resources, goals and obligations. Good planning starts with the actual person and context rather than assumptions about what they should be doing.",
              "Change can be anticipated, gradual or sudden. A useful adaptation identifies what has changed, immediate obligations, available resources and decisions that can wait. Short-term strategies may stabilise income, time or care; longer-term strategies may involve training, changing hours, relocating, rebuilding networks or revising financial plans. Each option has trade-offs and should be tested for feasibility and impact on others.",
              "Review prevents a temporary solution from becoming an unsuitable default. A review point checks whether the plan meets work, financial, relationship and wellbeing goals and whether new evidence has emerged. Support networks and community or workplace services may expand options, but their current availability and eligibility must be verified. Adaptive planning means retaining purpose while changing the route when circumstances require it."
            ],
            workedExample: { title: "Adapting after a transport change", context: "Ben’s evening transport option ends, making his current shift difficult while he is completing training.", analysis: "Ben first checks the confirmed roster and transport facts. He maps short-term options—one lift, a shift discussion, temporary travel cost—and longer-term options such as a different timetable or placement of training hours. He compares cost, reliability, impact on others and pathway goals, then sets a two-week review. He does not assume one inconvenience requires abandoning work or training." },
            vocabulary: [
              { term: "life stage", meaning: "a period shaped by a person’s current roles, responsibilities, resources and transitions" },
              { term: "adaptation", meaning: "a change to behaviour or planning in response to new conditions" },
              { term: "trade-off", meaning: "a choice in which gaining one benefit involves giving up or reducing another" },
              { term: "contingency", meaning: "an alternative action prepared in case the preferred plan cannot proceed" },
              { term: "review point", meaning: "a planned time to assess evidence and decide whether a plan should continue or change" }
            ],
            misconception: { claim: "Everyone should reach the same work milestones at the same age.", correction: "Working lives reflect different goals, opportunities, responsibilities and constraints; plans should be judged against the person’s context and evidence." },
            appliedActivity: { id: "ALA-M05-S03", title: "Life-change planning board", prompt: "Choose a fictional change such as caring, relocation, study or altered hours. Create immediate, three-month and one-year options, trade-offs, contingencies and review evidence.", evidence: "A staged adaptation board and 150-word recommendation." },
            visual: { id: "VIS-M05-S03", file: "assets/visuals/m05-s03.webp", alt: "Several realistic people at different life stages adapting work, study, caring and retirement plans along non-linear pathways.", purpose: "Challenge a single age-based career timetable and show reviewable adaptation." },
            mediaAlternative: { title: "Branching life-stage case", before: "Identify the confirmed change and avoid age assumptions.", during: "Track each option’s trade-offs and dependencies.", after: "Choose a review point and the evidence needed then." },
            applicationQuestions: [
              aq("Why is age alone a weak basis for a work plan?", "People of the same age can have different goals, responsibilities, resources and opportunities", "Life-stage planning needs actual context rather than stereotypes.", [["Age has no connection to any transition", "Age can be relevant, but it is not sufficient by itself."], ["Everyone follows one legal career schedule", "There is no single universal career timetable."], ["Personal evidence should be ignored", "Personal context is central to planning."]]),
              aq("What is the purpose of a contingency?", "Provide a prepared alternative if the preferred plan cannot proceed", "Contingencies reduce disruption without pretending uncertainty has vanished.", [["Guarantee the first plan will work", "An alternative does not guarantee the preferred route."], ["Create unnecessary panic", "A proportionate backup supports calm response."], ["Avoid choosing any direction", "A contingency supports rather than replaces a preferred plan."]]),
              aq("Which adaptation is best tested over time?", "A temporary change with clear indicators and a review date", "Testing and review allow evidence-led adjustment.", [["An indefinite arrangement nobody reviews", "A temporary response may become unsuitable without review."], ["A plan based only on hope", "Feasibility requires evidence and action."], ["A decision that ignores everyone affected", "Impacts and dependencies matter."]]),
              aq("How should trade-offs be analysed?", "Compare benefits, costs, risks and impacts against the person’s current priorities", "Trade-offs require explicit judgement rather than pretending every benefit can be maximised.", [["Hide the disadvantages", "Hidden costs weaken the decision."], ["Choose the option with the most features", "More features may not meet the actual priority."], ["Assume one person’s trade-off applies to all", "Values and constraints differ."]]),
              aq("What best corrects the claim that milestones must occur at the same age?", "Assess progress against a person’s goals, context, evidence and next viable step", "Career and life pathways are diverse and non-linear.", [["Milestones should never be used", "Personal milestones can still guide and motivate."], ["Older plans can never change", "Adaptation can occur at any stage."], ["Only income matters", "Work, care, learning, wellbeing and purpose may all matter."]])
            ],
            longResponse: { id: "M05-S03-LR01", prompt: "Evaluate three responses to a major life-stage change and recommend a reviewable work–life plan.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Describe the person’s goals, responsibilities and resources.", "Compare immediate and longer-term options.", "Analyse trade-offs, dependencies and contingencies.", "Recommend a plan, support and review evidence."], successCriteria: ["Avoids age or life-stage stereotypes.", "Balances short-term stability with longer-term purpose.", "Provides a feasible contingency and evidence-based review point."], theoryAnchors: ["M05-S03-theory", "M05-S03-example"] }
          })
        ]
      },
      M06: {
        moduleId: "M06",
        title: "Personal Finance",
        outcomes: outcomes(4, 5, 7, 8, 9),
        sections: [
          createSection({
            id: "M06-S01",
            title: "Pay, tax, superannuation and records",
            learningIntention: "Interpret common income records and explain how pay, tax and superannuation connect to responsible financial management.",
            successCriteria: ["I can distinguish gross pay, deductions, net pay and employer superannuation information.", "I can check a fictional pay record against hours, rates and other confirmed evidence.", "I can explain why current official information and accurate records matter."],
            theoryParagraphs: [
              "A pay slip is a record of a pay period, not simply a notice that money has arrived. It commonly identifies the employer and employee, the payment date and period, gross and net amounts, and relevant rates, hours, deductions and superannuation information. Gross pay is the amount earned before deductions; net pay is the amount remaining after authorised deductions such as tax withholding. These figures answer different questions, so comparing a bank deposit only with gross pay can create a false impression that money is missing.",
              "Careful checking connects several pieces of evidence. A worker can compare the pay period with a roster or personal hours record, check ordinary and additional hours against the listed rates, identify each deduction, and compare the calculated net amount with the deposit. Year-to-date figures help track cumulative earnings and withholding. If something appears inconsistent, the sound response is to preserve the records, check the facts and use the employer's current enquiry process. The exact workplace contact and process must come from current employer information and authoritative guidance; ask your teacher or another trusted adult for help locating it rather than inventing a procedure or assuming that every difference is an error.",
              "Tax and superannuation rules can change, so figures from an old workbook should not be treated as current advice. The Australian Taxation Office is the authority for current tax and superannuation information, while the Fair Work Ombudsman provides current information about pay slips and workplace records. Keeping pay slips, contracts, time records and relevant official correspondence supports later checking and informed decisions. Students can learn the structure and reasoning without disclosing their own financial information: classroom examples should use fictional or fully de-identified records."
            ],
            workedExample: { title: "Checking a fictional pay slip", context: "Noah's fictional pay slip lists 18 ordinary hours at $24 per hour, gross pay of $432, a tax deduction and a lower net deposit. His personal hours record shows 20 hours, including two hours that may belong to the next pay period.", analysis: "Noah does not immediately label the pay slip wrong. He checks the dates covered, matches each recorded shift to that period, separates gross pay from net pay and confirms what each deduction represents. If the two hours fall within the period and remain missing after the check, he keeps copies and follows the employer's confirmed enquiry process. He uses current official information rather than trying to calculate a legal entitlement from an old example." },
            vocabulary: [
              { term: "gross pay", meaning: "income earned before tax and other authorised deductions are taken out" },
              { term: "net pay", meaning: "the amount paid after tax and other authorised deductions are taken out" },
              { term: "deduction", meaning: "an amount subtracted from gross pay for an identified and lawful purpose" },
              { term: "superannuation", meaning: "money contributed to a super fund to support income in retirement under current rules" },
              { term: "pay period", meaning: "the stated span of time for which earnings and deductions are reported" }
            ],
            misconception: { claim: "The net bank deposit should always equal the gross pay shown on a pay slip.", correction: "Net pay is gross pay after authorised deductions; the useful check is whether the hours, rates, deductions and calculation align with confirmed records." },
            appliedActivity: { id: "ALA-M06-S01", title: "Fictional pay-record audit", prompt: "Annotate a teacher-provided fictional pay slip. Match its dates, hours, rates, gross pay, deductions, net pay and super information to a fictional roster, then identify one confirmed fact, one calculation and one question requiring current official or workplace information.", evidence: "An annotated fictional pay slip and a short evidence-based enquiry note; no personal financial data." },
            visual: { id: "VIS-M06-S01", file: "assets/visuals/m06-s01.webp", alt: "A young worker at a kitchen table comparing a fictional pay slip, roster and bank deposit while highlighting pay period, gross pay, deductions, net pay and superannuation information.", purpose: "Make the multi-record checking process visible without displaying real financial information." },
            mediaAlternative: { title: "Pay-slip evidence walkthrough", before: "Predict which three records could be compared.", during: "Pause at each figure and name what it can and cannot prove.", after: "Write the next question if one figure does not align." },
            applicationQuestions: [
              aq("Why should a worker check the pay period before comparing hours?", "Some worked hours may belong to a different reporting period", "Dates establish which shifts should appear in the calculation.", [["The pay period determines a worker's career goal", "Career goals are not set by payroll dates."], ["Hours are never included on pay records", "Hours and rates may be relevant and should be checked where applicable."], ["Every bank deposit covers a full calendar month", "Pay cycles vary and must be read from the record."]]),
              aq("Which evidence best supports a question about missing ordinary hours?", "A dated personal hours record compared with the pay slip's stated period", "Matching dated records isolates whether the hours should appear in that pay period.", [["A friend's pay slip", "Another person's record does not establish these hours."], ["A guess based on the net deposit", "Net pay alone does not show which hours were included."], ["An undated memory of being busy", "A dated record is stronger evidence than a general recollection."]]),
              aq("Why should students use current ATO and Fair Work information?", "Rules and requirements can change, while those bodies provide authoritative current guidance", "Current authoritative sources reduce the risk of applying outdated figures or processes.", [["All workbook examples are legally binding", "Examples teach concepts but are not current legal authority."], ["Search popularity proves accuracy", "Popularity does not establish authority or currency."], ["Official sources remove the need to inspect records", "Authority and accurate personal records are both needed."]]),
              aq("What is the strongest first response to an unexplained pay difference?", "Check dates, hours, rates and deductions, preserve evidence, then use the confirmed enquiry process", "A factual check supports a clear, proportionate enquiry.", [["Publish the pay slip online", "That risks privacy and does not resolve the evidence."], ["Assume deliberate wrongdoing immediately", "The cause should be investigated from records before a conclusion."], ["Delete the records and wait", "Records are needed to understand and raise the issue."]]),
              aq("Which classroom approach best protects financial privacy?", "Use a fictional or fully de-identified record that still contains the fields needed for analysis", "Students can practise the reasoning without exposing account or income details.", [["Ask every student to display a real bank statement", "Real statements contain private information and are unnecessary."], ["Remove all numbers and fields", "The task still needs enough fictional evidence to support calculation and checking."], ["Share one worker's record without consent", "Personal financial records should not be republished."]])
            ],
            longResponse: { id: "M06-S01-LR01", prompt: "Evaluate a fictional pay-record discrepancy and recommend an evidence-based sequence for checking and raising it.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Identify the pay period and separate gross pay, deductions, net pay and super information.", "Compare the pay slip with the fictional roster, hours record and deposit.", "Distinguish confirmed facts, calculations and unresolved questions.", "Recommend a privacy-safe next sequence using current authoritative information and the confirmed workplace process."], successCriteria: ["Uses financial terms accurately.", "Bases the analysis on dated evidence rather than assumptions.", "Avoids inventing a workplace procedure or giving personal tax advice."], theoryAnchors: ["M06-S01-theory", "M06-S01-example"] }
          }),
          createSection({
            id: "M06-S02",
            title: "Budgeting, banking, credit and saving",
            learningIntention: "Construct and review a realistic cash-flow plan that distinguishes needs, wants, saving and the true cost of credit.",
            successCriteria: ["I can classify regular and irregular income and expenses without hiding uncertainty.", "I can compare a budget with actual results and propose a feasible adjustment.", "I can explain how fees, interest, security and repayment conditions affect a financial choice."],
            theoryParagraphs: [
              "A budget is a forward plan for money over a defined period; cash flow is the actual timing of money coming in and going out. A person can appear to have enough income over a month yet still be unable to meet a bill if the bill falls before the income arrives. Useful planning records the amount, timing and reliability of income, then separates fixed or regular commitments from variable and irregular expenses. Needs and wants are context-dependent: transport may be essential for one person and optional for another, so labels should support reasoning rather than moral judgement.",
              "A workable budget gives every important commitment a place, includes a buffer for uncertainty and sets a specific saving purpose. It also records actual spending so that estimates can be tested. A variance is the difference between the planned and actual amount. One variance does not automatically prove failure: it may reveal an unrealistic estimate, an unusual event or a change in priority. Reviewing the cause allows a person to reduce a cost, change timing, adjust a goal or seek reliable information before the next cycle.",
              "Bank and credit products should be compared by their conditions and total effect, not by a headline alone. Relevant features may include fees, interest, repayment timing, access, security protections and consequences of missed payments. Borrowing brings future income into a present decision, so affordability must be tested across the whole repayment period and under a plausible setback. Digital security also matters: strong unique authentication, careful checking of messages and prompt use of the provider's verified contact channel reduce risk. Exact product terms must be read from current provider and official information."
            ],
            workedExample: { title: "Repairing a lumpy monthly budget", context: "Aisha has reliable fortnightly income, weekly transport costs and a large annual registration expense due in three months. Her first budget shows a monthly surplus but sets aside nothing for registration.", analysis: "Aisha converts the annual expense into a regular sinking-fund amount and schedules it after each pay. She checks the dates of other bills, keeps a modest buffer and compares actual spending with the plan each week. When dining costs are higher than estimated, she examines why before adjusting. She does not use a high-cost credit product merely because the monthly total looked positive." },
            vocabulary: [
              { term: "cash flow", meaning: "the timing and amount of money received and paid over a period" },
              { term: "fixed expense", meaning: "a cost that is regular and usually predictable for the planning period" },
              { term: "variable expense", meaning: "a cost whose amount or frequency can change" },
              { term: "variance", meaning: "the difference between a planned amount and the actual amount" },
              { term: "sinking fund", meaning: "money set aside gradually for a known future expense" }
            ],
            misconception: { claim: "A budget has failed whenever actual spending differs from the plan.", correction: "A variance is information. Reviewing its cause helps improve the next plan; failure is more likely when evidence is ignored and the plan is never adjusted." },
            appliedActivity: { id: "ALA-M06-S02", title: "Three-cycle cash-flow lab", prompt: "Use a fictional income and expense pack to build a three-cycle cash-flow plan. Include an irregular expense, a savings goal and a setback, then revise the plan and explain one trade-off.", evidence: "A privacy-safe budget table, variance note and 120-word adjustment rationale." },
            visual: { id: "VIS-M06-S02", file: "assets/visuals/m06-s02.webp", alt: "A realistic monthly desk calendar with fortnightly pay, weekly transport, bills, a registration sinking fund and a small buffer marked on their actual dates.", purpose: "Show why timing matters even when total monthly income appears sufficient." },
            mediaAlternative: { title: "Cash-flow decision simulation", before: "Mark when income and essential bills occur.", during: "Pause when an irregular expense appears and revise the plan.", after: "Explain which adjustment protects the goal with the least harmful trade-off." },
            applicationQuestions: [
              aq("Why can a monthly surplus still coincide with a missed bill?", "The bill may be due before the income needed to cover it arrives", "Cash-flow timing matters as well as total income and expenses.", [["A surplus means every payment is automatic", "Payments still need timing and arrangements."], ["Fixed expenses never have due dates", "Regular expenses normally occur at particular times."], ["Only annual income matters", "Shorter payment cycles affect everyday capacity."]]),
              aq("What is the main value of a sinking fund?", "It spreads a known future expense across smaller regular amounts", "Gradual preparation reduces the shock of a large predictable cost.", [["It guarantees an investment profit", "A sinking fund is for planned saving, not guaranteed returns."], ["It hides the expense from the budget", "The future expense should be made visible in the plan."], ["It removes the need for a due date", "The due date determines how quickly the fund must build."]]),
              aq("How should a budget variance be used?", "Investigate its cause and use the evidence to improve the next plan", "Variance analysis turns an imperfect forecast into better planning.", [["Treat any difference as personal failure", "A difference may reflect estimates or changed circumstances."], ["Change every goal immediately", "The cause and priority should be understood first."], ["Delete the actual spending record", "Actual evidence is essential for review."]]),
              aq("Which comparison best tests the affordability of credit?", "Total repayments, fees, timing and capacity under a plausible setback", "The full obligation and resilience matter more than the advertised minimum alone.", [["The colour of the card", "Appearance does not determine cost or capacity."], ["Only the first repayment", "Later repayments and fees remain obligations."], ["Whether a friend was approved", "Another person's approval does not prove affordability."]]),
              aq("What is the safest response to an unexpected banking message with a link?", "Do not use the link; contact the provider through a separately verified channel", "Independent verification reduces the risk of acting on a fraudulent message.", [["Reply with account details", "Sensitive details should not be sent in response to an unverified message."], ["Forward it publicly for opinions", "Public sharing risks privacy and does not verify the sender."], ["Assume urgency proves authenticity", "Urgency is not evidence that a message is genuine."]])
            ],
            longResponse: { id: "M06-S02-LR01", prompt: "Evaluate a fictional young worker's cash-flow plan after an irregular expense and a reduction in hours, then recommend a sustainable revision.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Map income and expenses by amount, timing and reliability.", "Identify needs, flexible costs, the savings purpose and the emerging shortfall.", "Compare at least three adjustments, including their trade-offs and risks.", "Recommend a revised plan, buffer and review point."], successCriteria: ["Calculates and interprets cash flow and variance accurately.", "Protects essential commitments while making a realistic trade-off.", "Explains how the revised plan will be monitored."], theoryAnchors: ["M06-S02-theory", "M06-S02-example"] }
          }),
          createSection({
            id: "M06-S03",
            title: "Consumer decisions, risk and future planning",
            learningIntention: "Evaluate financial choices by comparing purpose, evidence, risk, time horizon and consumer protections.",
            successCriteria: ["I can distinguish a financial goal from a product promoted as a solution.", "I can compare options using total cost, risk, liquidity and time horizon.", "I can identify when current official information or qualified personal advice is needed."],
            theoryParagraphs: [
              "A sound consumer decision begins with purpose: what needs to be achieved, by when, and with what resources and constraints? Only then should products be compared. Purchase price is one part of total cost; ongoing fees, maintenance, interest, replacement risk, cancellation conditions and opportunity cost may alter the judgement. Advertising is designed to persuade, so a claim should be separated into evidence that can be checked, conditions that limit it and emotional cues that do not establish value.",
              "Saving, investing and insurance manage different kinds of uncertainty. Saving usually prioritises access and lower short-term risk for near goals. Investing accepts uncertainty in pursuit of longer-term growth, with possible loss as well as gain. Time horizon, diversification, fees, liquidity and risk tolerance affect whether an option fits a goal. Insurance transfers specified risks under a contract but does not remove every loss. No classroom example can determine a student's personal choice; current product documents, official information and appropriately qualified advice may be required.",
              "Future planning also considers inflation, changing income, major life events and the value of flexibility. A robust plan tests more than the best-case outcome. It asks what happens if income falls, a cost rises, money is needed earlier or a product performs poorly. Scams and misleading offers often exploit urgency, secrecy or promised certainty. Pausing, checking the provider and claim independently, protecting personal information and using current official consumer guidance are practical forms of financial self-management."
            ],
            workedExample: { title: "Comparing transport choices", context: "Luca needs reliable transport for a six-month training placement. He is comparing a used bicycle, public transport and a financed used car promoted with a low weekly repayment.", analysis: "Luca defines reliability, route, six-month timeframe and available cash before comparing. He includes fares or purchase price, maintenance, insurance where relevant, fees, total repayments, flexibility and the risk of losing income. The low weekly figure does not prove the car is cheapest or affordable. He tests a reduced-hours scenario and checks current terms and consumer information before making any personal commitment." },
            vocabulary: [
              { term: "opportunity cost", meaning: "the value of the next-best option given up when a choice is made" },
              { term: "liquidity", meaning: "how readily an asset can be converted to usable money without major loss" },
              { term: "diversification", meaning: "spreading exposure across different assets or risks rather than relying on one" },
              { term: "risk tolerance", meaning: "a person's informed capacity and willingness to accept uncertain outcomes or loss" },
              { term: "time horizon", meaning: "the period available before money is expected to be needed" }
            ],
            misconception: { claim: "A higher possible return means an option is automatically better.", correction: "Possible return must be considered with risk, fees, liquidity, time horizon and the person's goal; higher return is not guaranteed and may involve greater potential loss." },
            appliedActivity: { id: "ALA-M06-S03", title: "Consumer claim evidence board", prompt: "Compare three fictional options for one stated goal. Record total cost, conditions, time horizon, access, risks and one advertising claim that needs independent verification. Stress-test the preferred option against a setback.", evidence: "A comparison board, source-check note and 180-word conditional recommendation; no personal financial recommendation." },
            visual: { id: "VIS-M06-S03", file: "assets/visuals/m06-s03.webp", alt: "A young adult comparing transport options on a workbench with cards for goal, total cost, time horizon, liquidity, risk, evidence and a setback test.", purpose: "Show that a financial decision is a structured comparison rather than a reaction to one advertised figure." },
            mediaAlternative: { title: "Pause-check-decide consumer scenario", before: "State the goal and the evidence needed.", during: "Flag persuasive claims, hidden conditions and risks.", after: "Stress-test the preferred option and name any advice boundary." },
            applicationQuestions: [
              aq("What should come before comparing financial products?", "Define the goal, timeframe, resources and constraints", "A product can only be judged against the purpose it is meant to serve.", [["Choose the most heavily advertised brand", "Advertising exposure does not establish fit."], ["Assume every goal needs borrowing", "The range of options should be considered first."], ["Predict the highest possible return", "Possible return is only one factor and may be uncertain."]]),
              aq("Why is a low weekly repayment an incomplete comparison?", "It may omit the term, fees, total repayment and risk if income changes", "Affordability and cost require the whole obligation.", [["Weekly figures are always false", "A weekly figure may be accurate but incomplete."], ["Only the purchase price matters", "Financing and ongoing costs affect total impact."], ["Repayment terms never vary", "Terms and conditions must be checked."]]),
              aq("When is liquidity especially important?", "When money may be needed before a long-term plan reaches its intended horizon", "Accessible funds can protect near-term needs without a forced sale at a poor time.", [["When access to money is irrelevant", "Liquidity concerns access, so it matters when access may be needed."], ["Only when an advertisement mentions it", "The goal and circumstances determine its importance."], ["When all outcomes are guaranteed", "Financial outcomes are not generally guaranteed by the concept of liquidity."]]),
              aq("What does diversification aim to do?", "Reduce reliance on one asset, provider or source of risk", "Spreading exposure can reduce concentration risk, though it cannot remove all risk.", [["Guarantee that no money can be lost", "Diversification does not create a guarantee."], ["Concentrate every resource in the best-looking option", "That increases concentration rather than spreading it."], ["Make fees and conditions irrelevant", "Costs and terms still require comparison."]]),
              aq("Which sign most strongly calls for pausing and independent verification?", "A demand for secrecy and immediate payment paired with a guaranteed outcome", "Urgency, secrecy and promised certainty are warning signs that should be checked through trusted channels.", [["A document explains risks and conditions", "Transparent conditions support checking, though they still need reading."], ["A goal has a clear time horizon", "That is part of responsible planning."], ["Several options are compared", "Comparison generally strengthens a decision."]])
            ],
            longResponse: { id: "M06-S03-LR01", prompt: "Evaluate three fictional financial options for a defined life-planning goal and make a conditional, evidence-based recommendation.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Define the goal, timeframe, available resources and constraints.", "Compare total cost, liquidity, risk, fees and conditions for each option.", "Test each option against one realistic setback and identify claims requiring verification.", "Recommend an option conditionally and state where current official information or qualified advice is required."], successCriteria: ["Uses multiple decision criteria rather than one headline figure.", "Explains uncertainty and risk without promising an outcome.", "Keeps the response educational and avoids personal financial advice."], theoryAnchors: ["M06-S03-theory", "M06-S03-example"] }
          })
        ]
      },
      M07: {
        moduleId: "M07",
        title: "Workplace Issues",
        outcomes: outcomes(1, 3, 4, 5, 6, 7, 8, 9),
        sections: [
          createSection({
            id: "M07-S01",
            title: "Recognising contemporary workplace issues",
            learningIntention: "Recognise workplace issues as contested situations shaped by work structures, relationships and wider change.",
            successCriteria: ["I can distinguish an issue from a single untested allegation or inconvenience.", "I can classify an issue by the people, conditions and systems it affects.", "I can identify the current authoritative information needed before drawing a conclusion."],
            theoryParagraphs: [
              "A workplace issue is a matter that affects how work is organised, experienced or regulated and that may require judgement or action. Examples in the official module include workplace relations, equity, performance appraisal, leaving an employer and unemployment. Contemporary issues can also emerge through changing technology, work location, employment patterns and expectations about safety and inclusion. An issue is not established merely because a claim is repeated: the situation, evidence, relevant expectations and people affected must be identified.",
              "Issues operate at several levels. An individual may experience unclear duties, exclusion or a performance concern; a team may face workload, communication or fairness problems; an organisation may confront unsafe systems or rapid restructuring; an industry may experience automation, skills shortages or declining demand. The same event can have different effects at each level. Separating the immediate event from the underlying conditions helps avoid blaming one person for a broader system problem or treating a personal disagreement as proof of an industry-wide trend.",
              "Language and rules change over time, so old examples are prompts for investigation rather than current legal instructions. Current information should come from the appropriate authoritative body and the workplace's confirmed policies. Local reporting contacts, complaint pathways, representation arrangements and emergency procedures must come from those current sources; ask your teacher or another trusted adult for help locating them. In classroom analysis, privacy matters: use fictional or de-identified cases, report only information needed for the task and avoid naming people or workplaces when the facts have not been established."
            ],
            workedExample: { title: "Recognising the issue behind a roster change", context: "A retail team receives a new roster with less notice than usual. Two workers report caring difficulties, while the manager says the change responds to customer demand.", analysis: "The issue is not simply 'bad management' or 'workers resisting change'. Relevant questions include what changed, who is affected, what evidence supports the operational need, which current workplace rules and policies apply, and whether consultation or adjustment options exist. Caring impacts, business needs, fairness and communication all form part of the issue. A conclusion requires current authoritative and workplace-specific information." },
            vocabulary: [
              { term: "workplace issue", meaning: "a matter affecting work organisation, relationships, conditions or participation that may require judgement or action" },
              { term: "stakeholder", meaning: "a person or group affected by or able to influence a workplace decision" },
              { term: "workplace relations", meaning: "the relationships, processes and arrangements connecting workers, employers and their representatives" },
              { term: "equity", meaning: "fair access, treatment and opportunity that takes relevant differences and barriers into account" },
              { term: "structural factor", meaning: "a feature of a system or organisation that shapes outcomes beyond one person's choices" }
            ],
            misconception: { claim: "Every workplace problem is caused by one difficult individual.", correction: "Individual behaviour can matter, but structures, workload, communication, policy, technology and wider conditions may also create or intensify an issue." },
            appliedActivity: { id: "ALA-M07-S01", title: "Issue or incident sorter", prompt: "Sort six fictional workplace situations by event, possible issue, affected stakeholders, evidence available and information still needed. Select one and explain why a conclusion would be premature or justified.", evidence: "A de-identified issue map and 150-word classification rationale." },
            visual: { id: "VIS-M07-S01", file: "assets/visuals/m07-s01.webp", alt: "A realistic workplace scene with transparent layers showing an event, individual impacts, team relationships, organisational systems and wider industry influences.", purpose: "Help students look beyond a single visible incident to the levels that shape a workplace issue." },
            mediaAlternative: { title: "Layered workplace issue case", before: "Record only what is directly observable.", during: "Add stakeholders, systems and wider influences as evidence appears.", after: "State the issue and two questions that remain open." },
            applicationQuestions: [
              aq("What turns a reported event into a workplace issue for analysis?", "Evidence that it affects work relationships, conditions, organisation or participation and requires judgement", "An issue is defined through impact, context and evidence rather than a label alone.", [["One person's strong opinion", "An opinion may prompt inquiry but does not establish the whole issue."], ["The event happened on a weekday", "Timing alone does not show workplace significance."], ["A rumour names a manager", "A rumour is not sufficient verified evidence."]]),
              aq("Why should analysts separate individual and structural factors?", "It prevents a system problem being reduced to one person and clarifies where action may work", "Causes and responses can exist at several levels.", [["Structures make behaviour irrelevant", "Individual behaviour and structures can interact."], ["Only individuals can change workplaces", "Teams, organisations and external bodies can also act."], ["It guarantees agreement among stakeholders", "Good analysis can clarify disagreement without removing it."]]),
              aq("Which question best recognises equity in a roster case?", "Do the arrangements create different barriers for workers, and are fair adjustments possible?", "Equity considers access and impact, including relevant differences.", [["Does every worker have the same favourite shift?", "Preference alone does not capture barriers or fairness."], ["Can one person win the argument?", "Equity is not simply victory for one stakeholder."], ["Should all context be ignored so treatment looks identical?", "Identical treatment can reproduce unequal barriers."]]),
              aq("Why are old workplace examples not enough for a current procedural answer?", "Rules, agencies, policies and workplace arrangements can change", "Currency and local applicability must be verified before action.", [["Historical examples have no learning value", "They can still illuminate concepts and change over time."], ["Only social media is current", "Currency does not guarantee authority."], ["Every workplace follows one unchanging process", "Workplace-specific processes and current rules vary."]]),
              aq("Which case record best protects privacy?", "A fictional or de-identified account containing only evidence needed to analyse the issue", "Data minimisation allows learning without unnecessary exposure.", [["A public post naming everyone involved", "Naming people can cause harm and is unnecessary for analysis."], ["A screenshot containing private messages", "Private communications should not be republished for a classroom task."], ["An account with no context or evidence", "Privacy-safe does not mean removing information required for reasoning."]])
            ],
            longResponse: { id: "M07-S01-LR01", prompt: "Evaluate a fictional contemporary workplace issue by distinguishing the incident, stakeholders, structural influences and information needed for a sound conclusion.", higherOrderVerb: "evaluate", scaffoldPrompts: ["State the observable event without loaded language.", "Identify stakeholders and impacts at individual, team and organisational levels.", "Explain at least two structural or wider influences.", "Identify current authoritative and workplace-specific information still required."], successCriteria: ["Separates evidence from allegation and inference.", "Explains interaction between individual and structural factors.", "Protects privacy and avoids inventing current procedures."], theoryAnchors: ["M07-S01-theory", "M07-S01-example"] }
          }),
          createSection({
            id: "M07-S02",
            title: "Analysing impacts, evidence and perspectives",
            learningIntention: "Analyse a workplace issue using credible evidence, stakeholder perspectives and short- and long-term impacts.",
            successCriteria: ["I can assess source authority, currency, relevance and limitations.", "I can represent competing perspectives without treating all claims as equally supported.", "I can trace intended and unintended impacts across people and time."],
            theoryParagraphs: [
              "Strong issue analysis asks both what is claimed and how the claim is supported. Useful evidence may include a confirmed policy, dated workplace record, aggregated data, direct observation or a statement from an authoritative body. Each source has limits. A policy shows what should occur, not necessarily what occurred; one person's account gives important experience but may not explain the whole pattern; a statistic can show scale but not every cause. Authority, currency, relevance, corroboration and possible bias should be considered together.",
              "Stakeholders may interpret the same change differently because they have different responsibilities, information, risks and values. An employer may focus on continuity and cost, workers on security and workload, customers on access, and a representative body on fair process. Perspective-taking means explaining why each view exists, not assuming every view is equally accurate or ethically acceptable. Claims can still be tested against evidence, current obligations and effects on others.",
              "Impact analysis follows consequences through time and across levels. A new technology might improve speed while creating training needs, surveillance concerns or unequal access. A redundancy may affect income and identity for an individual, workload for a team, capacity for an organisation and employment in a community. Intended outcomes, unintended consequences and who carries each cost should be made explicit. A balanced conclusion weighs the quality of evidence and the distribution of benefits and harms rather than averaging opinions."
            ],
            workedExample: { title: "Analysing a digital monitoring proposal", context: "A service business proposes software that records task completion and location during work time. Management expects better scheduling; workers raise privacy, trust and workload concerns.", analysis: "The analysis checks the proposal, stated purpose, data collected, access arrangements, accuracy limits and current policy or legal guidance. It distinguishes a projected efficiency benefit from measured evidence. Management, workers, customers and technology staff have different responsibilities and risks. A conditional conclusion might support a limited trial only if purpose, consultation, data boundaries, training, review indicators and a response to errors are clear." },
            vocabulary: [
              { term: "corroboration", meaning: "support for a claim from additional independent or consistent evidence" },
              { term: "perspective", meaning: "a viewpoint shaped by a stakeholder's role, information, experience, risks and values" },
              { term: "unintended consequence", meaning: "an effect of a decision that was not part of its stated purpose" },
              { term: "bias", meaning: "a systematic influence that can shape what evidence is selected, interpreted or omitted" },
              { term: "impact", meaning: "a change or consequence experienced by a person, group, organisation or community" }
            ],
            misconception: { claim: "Balanced analysis means giving every claim the same weight.", correction: "Balanced analysis represents relevant perspectives fairly, then gives greater weight to claims supported by stronger, more authoritative and relevant evidence." },
            appliedActivity: { id: "ALA-M07-S02", title: "Stakeholder evidence hearing", prompt: "Analyse a fictional workplace change using five short source cards. Rate each source for authority, currency, relevance and limitation; map stakeholder impacts; then write a conditional finding.", evidence: "An evidence-rating matrix, impact map and 200-word finding." },
            visual: { id: "VIS-M07-S02", file: "assets/visuals/m07-s02.webp", alt: "A workplace meeting table viewed from above with stakeholder folders, evidence cards of different reliability and arrows tracing immediate and longer-term impacts.", purpose: "Show that perspectives, evidence strength and consequences must be analysed together." },
            mediaAlternative: { title: "Evidence-weighting investigation", before: "List what would count as strong evidence for the claim.", during: "Rate each source and trace who experiences each consequence.", after: "Write a finding whose certainty matches the evidence." },
            applicationQuestions: [
              aq("Why can a confirmed policy not prove by itself what happened in one incident?", "It describes an expected process, while incident evidence is needed to establish actual events", "Normative and event evidence answer different questions.", [["Policies are never relevant", "A policy can establish expectations and possible pathways."], ["Incidents never involve procedures", "Procedures may be central, but compliance still needs evidence."], ["The longest document is always true", "Length does not establish relevance or accuracy."]]),
              aq("What does corroboration add to a workplace claim?", "Additional independent or consistent evidence that strengthens or qualifies the claim", "Corroboration tests whether the claim is supported beyond one source.", [["A guarantee that no uncertainty remains", "Even corroborated claims may retain limits."], ["More repetitions from the same rumour", "Repetition without independence may not add evidence."], ["A reason to ignore contrary evidence", "Contrary credible evidence must still be assessed."]]),
              aq("How should competing stakeholder perspectives be handled?", "Explain their roles and interests, then test their claims against evidence and impacts", "Perspective-taking and evidence evaluation work together.", [["Choose the most powerful stakeholder automatically", "Power does not establish accuracy or fairness."], ["Treat every claim as equally proven", "Support and authority vary."], ["Remove all disagreement from the report", "Disagreement can be important evidence about the issue."]]),
              aq("Which is an unintended consequence of a speed-focused digital system?", "Workers rush tasks and error rates rise even though faster completion was the stated goal", "The adverse error effect was not part of the intended efficiency outcome.", [["The system records task time as designed", "That is an intended function."], ["Management states the purpose before use", "Stating a purpose is not a consequence."], ["Workers receive planned training", "Planned training is an intended implementation step."]]),
              aq("What makes a conditional finding stronger than an overconfident conclusion?", "It states what the evidence supports, its limits and the conditions needed for the judgement", "The level of certainty should match the evidence.", [["It avoids making any judgement", "A conditional finding can still reach a justified position."], ["It relies only on emotional language", "Reasoning and evidence are required."], ["It hides missing information", "Limits should be explicit."]])
            ],
            longResponse: { id: "M07-S02-LR01", prompt: "Evaluate a proposed workplace change using source quality, stakeholder perspectives and distributed impacts, then reach a conditional judgement.", higherOrderVerb: "evaluate", scaffoldPrompts: ["State the proposed change, purpose and key claims.", "Evaluate each source for authority, currency, relevance, corroboration and limitation.", "Compare stakeholder perspectives and trace immediate, longer-term, intended and unintended impacts.", "Reach a judgement whose conditions and certainty match the evidence."], successCriteria: ["Weights evidence rather than merely listing opinions.", "Represents perspectives fairly while testing their claims.", "Explains who receives benefits, risks and costs over time."], theoryAnchors: ["M07-S02-theory", "M07-S02-example"] }
          }),
          createSection({
            id: "M07-S03",
            title: "Responding through policy, support and action",
            learningIntention: "Design proportionate responses to workplace issues using confirmed policy, support, communication and review.",
            successCriteria: ["I can match a response to urgency, evidence and level of risk.", "I can distinguish support, representation, workplace policy and external authoritative guidance.", "I can build an action sequence with documentation, boundaries and review."],
            theoryParagraphs: [
              "A response should match the seriousness and urgency of the issue. Immediate danger or emergency requires the workplace's current safety or emergency process; less urgent issues may begin with clarification, factual documentation or a supported conversation. The exact pathway is workplace-specific, so use the current workplace process and authoritative guidance and ask your teacher or another trusted adult for help locating it. A proportionate response protects people without escalating beyond the evidence, while recognising that delay can also cause harm when risk is serious.",
              "Different sources of support have different roles. A supervisor or designated workplace contact may clarify duties or apply policy; a support person or representative may help someone understand and communicate their concern; an employer or professional association may advise its members; and an authoritative external body may provide current information or formal avenues. Knowing the role and limit of each source prevents a student from treating informal advice as a binding decision or using a public channel for a private workplace matter.",
              "A defensible action plan records observable facts, dates and relevant communications; states the desired outcome; selects a confirmed channel; and sets a reasonable review point. It separates evidence from interpretation and shares only necessary information. Policy matters only when it is understood, accessible and applied in practice, so review should examine both whether the process was followed and whether the issue improved. If new evidence or risk emerges, the plan may need to change."
            ],
            workedExample: { title: "Responding to repeated task exclusion", context: "Priya is repeatedly left out of the equipment training offered to other new team members. She has dates and messages but does not know why it occurred.", analysis: "Priya records the pattern without alleging a motive, checks the relevant training and equity expectations, and identifies the confirmed workplace contact. She states the effect on her ability to complete duties and asks for clarification and an equitable training plan. A support person may help if appropriate. She sets a review point and protects colleagues' privacy. If the response or risk requires another avenue, she checks current workplace and authoritative guidance rather than inventing the next step." },
            vocabulary: [
              { term: "proportionate response", meaning: "action matched to the seriousness, urgency, evidence and potential harm of an issue" },
              { term: "representation", meaning: "support or advocacy provided by an authorised person or body for a stakeholder" },
              { term: "documentation", meaning: "a factual record of relevant events, dates, evidence and communication" },
              { term: "confidentiality", meaning: "protecting information by limiting access and disclosure to appropriate purposes and people" },
              { term: "review point", meaning: "a planned time to assess whether the response was followed and the issue improved" }
            ],
            misconception: { claim: "The strongest response is always the most public and forceful response.", correction: "The strongest response is evidence-based, safe and proportionate, uses an appropriate confirmed channel, protects privacy and can escalate when the facts or risk justify it." },
            appliedActivity: { id: "ALA-M07-S03", title: "Response pathway designer", prompt: "For a fictional workplace issue, create three possible responses at different levels. Select the most proportionate starting point, specify evidence and privacy boundaries, and add triggers for urgent action or review. Mark all local contacts and procedures that require confirmation from the current workplace process or authoritative guidance.", evidence: "A response pathway, factual case note and 180-word justification." },
            visual: { id: "VIS-M07-S03", file: "assets/visuals/m07-s03.webp", alt: "A calm decision pathway moving from immediate safety check to factual documentation, clarification, supported workplace response, authoritative guidance and review, with privacy gates throughout.", purpose: "Show response as an evidence-led sequence with safety, support and review rather than automatic escalation." },
            mediaAlternative: { title: "Choose the next proportionate step", before: "Identify urgency, potential harm and confirmed facts.", during: "Compare support and response channels without revealing private information.", after: "Set a review point and conditions for changing the response." },
            applicationQuestions: [
              aq("What should determine the starting response to a workplace issue?", "Urgency, potential harm, available evidence and the confirmed process", "Proportionate action is matched to the situation rather than chosen for appearance.", [["Which response attracts the most attention", "Attention does not establish safety or effectiveness."], ["Whether a rumour is dramatic", "Unverified drama is not a sound basis for action."], ["The oldest procedure found online", "Current local and authoritative information is required."]]),
              aq("Why should a factual case note separate observation from interpretation?", "It allows others to assess what is known without treating an inference as an established fact", "Clear evidence supports fairer analysis and response.", [["Interpretations are illegal to discuss", "Interpretation can be stated, but it should be labelled and supported."], ["Dates and records never matter", "Dates and records often establish patterns and sequence."], ["Only anonymous rumours can be fair", "Credible, necessary evidence is preferable to rumour."]]),
              aq("What is a support person's most appropriate contribution?", "Help the person understand, prepare and communicate within the role permitted by the process", "Support is valuable but does not automatically replace the decision-maker or formal authority.", [["Guarantee the outcome", "No support person can guarantee a decision."], ["Publish every detail", "Confidentiality and relevance still apply."], ["Invent a policy when none is available", "Current confirmed policy must be found or the gap stated."]]),
              aq("How can policy and practice be compared?", "Check both the stated process and evidence of how it was applied and what changed", "A written policy alone does not demonstrate implementation or effectiveness.", [["Assume publication proves compliance", "Practice needs evidence."], ["Ignore the written expectations", "Policy helps define what should occur."], ["Measure only how quickly a document opens", "Access speed does not show substantive practice."]]),
              aq("Why include a review point in an action plan?", "To assess whether the process occurred, the issue improved and new evidence changes the plan", "Review turns a one-off action into accountable problem-solving.", [["To guarantee the first action succeeds", "Review is needed precisely because outcomes are uncertain."], ["To avoid documenting the original issue", "The original evidence remains important."], ["To delay any response regardless of danger", "Urgent risk requires immediate use of the confirmed process."]])
            ],
            longResponse: { id: "M07-S03-LR01", prompt: "Design and justify a proportionate response plan for a complex fictional workplace issue with uncertain evidence and competing stakeholder needs.", higherOrderVerb: "justify", scaffoldPrompts: ["Assess urgency, potential harm, confirmed evidence and uncertainty.", "Identify the roles and limits of workplace policy, support, representation and authoritative guidance.", "Sequence documentation, communication and action while protecting confidentiality.", "Set review evidence and triggers for changing or escalating the response."], successCriteria: ["Matches actions to evidence, risk and urgency.", "Identifies local contacts and procedures that require confirmation from the current workplace process or authoritative guidance rather than inventing them.", "Explains how privacy, fairness and effectiveness will be reviewed."], theoryAnchors: ["M07-S03-theory", "M07-S03-example"] }
          })
        ]
      },
      M08: {
        moduleId: "M08",
        title: "Self-Employment",
        outcomes: outcomes(1, 2, 3, 4, 5, 7, 8),
        sections: [
          createSection({
            id: "M08-S01",
            title: "From strengths and needs to a viable idea",
            learningIntention: "Develop a self-employment idea by connecting personal capabilities with evidence of a customer or community need.",
            successCriteria: ["I can define a specific customer problem rather than begin with a product alone.", "I can test an idea using evidence about demand, competition, capability and resources.", "I can distinguish an attractive idea from a viable opportunity."],
            theoryParagraphs: [
              "Self-employment involves creating and managing work rather than receiving every task, system and customer from an employer. The official module links it to personal attributes, management skills and possible forms of business activity. Useful capabilities can include initiative, communication, persistence, organisation, problem-solving and willingness to learn. These qualities do not guarantee success, and a person does not need to fit an entrepreneurial stereotype. Capabilities can be developed, combined with other people's expertise and matched to a manageable scale.",
              "A viable idea begins with a clearly described need. A customer group may need a task completed, a problem reduced, an experience improved or access made easier. A value proposition explains who the idea serves, what useful outcome it creates and why the proposed approach is different or credible. Evidence can come from ethical observation, de-identified interviews, competitor analysis, a small prototype or a test of willingness to engage. Praise from friends is encouraging but is not the same as evidence of demand.",
              "A feasibility study tests whether the idea can work with available time, skills, resources, cost, location and risk. It estimates demand and costs conservatively, identifies competitors and alternatives, and names assumptions that still require testing. Personal fit matters as well: a financially possible idea may be unsuitable if the hours, physical demands or customer contact conflict with the person's goals and commitments. Classroom work should remain hypothetical or teacher-approved; it does not authorise trading, collecting personal data or approaching businesses."
            ],
            workedExample: { title: "Testing a school-community repair idea", context: "Eli enjoys maintaining bicycles and proposes a low-cost weekend safety-check service for local students. Friends say it is a great idea, but no demand or operating conditions have been confirmed.", analysis: "Eli defines the intended customer and the limited outcome of a basic check, then uses a teacher-approved anonymous survey and competitor scan to test need. He lists skills and resources he already has, gaps requiring supervision or training, time and cost assumptions, and safety and liability questions requiring current authoritative advice. The idea remains a feasibility study until the school approves any next step; positive comments alone do not authorise or prove a viable service." },
            vocabulary: [
              { term: "self-employment", meaning: "work in which a person creates and manages their own business activity and responsibilities" },
              { term: "value proposition", meaning: "a concise explanation of who an idea serves, what useful outcome it offers and why it is credible" },
              { term: "target customer", meaning: "the defined group whose needs and behaviour an enterprise aims to understand and serve" },
              { term: "feasibility", meaning: "the extent to which an idea can realistically work within evidence, resources, constraints and risk" },
              { term: "prototype", meaning: "an early, limited version used to test an idea and gather evidence before full commitment" }
            ],
            misconception: { claim: "A creative idea is viable as soon as people say they like it.", correction: "Viability requires evidence about need, willingness to engage, costs, capability, competition, constraints and risk; positive reactions test only a small part of the idea." },
            appliedActivity: { id: "ALA-M08-S01", title: "Need-to-idea feasibility canvas", prompt: "Choose a fictional or teacher-approved community need. Define the target customer and value proposition, map capabilities and constraints, design one privacy-safe demand test, and state three assumptions that could disprove the idea.", evidence: "A feasibility canvas, prototype sketch and 180-word go, revise or stop recommendation." },
            visual: { id: "VIS-M08-S01", file: "assets/visuals/m08-s01.webp", alt: "A young entrepreneur at a prototype workbench linking a customer problem, personal strengths, competitor evidence, resources, costs and a small test before a launch gate.", purpose: "Show feasibility as evidence gathering and revision rather than a leap from enthusiasm to trading." },
            mediaAlternative: { title: "Would this idea survive a test?", before: "Define the customer problem without naming a product.", during: "Collect evidence about need, alternatives, capability and constraints.", after: "Decide whether to proceed, revise or stop and justify why." },
            applicationQuestions: [
              aq("What makes a value proposition useful?", "It connects a defined customer with a useful outcome and a credible reason to choose the approach", "A value proposition links need, customer and distinctive value.", [["It lists every feature the creator likes", "Features matter only when they help meet a customer need."], ["It guarantees the idea will earn a profit", "A statement of value cannot guarantee demand or profit."], ["It avoids naming who the idea serves", "A defined customer makes testing possible."]]),
              aq("Which evidence most directly tests demand for a proposed service?", "A small ethical test of whether the defined customers will take a meaningful next step", "Behaviour or commitment from the target group is stronger than general praise.", [["The creator's confidence", "Confidence is not market evidence."], ["Compliments from unrelated friends", "They may not represent the target customer or actual behaviour."], ["The number of colours in the logo", "Brand styling does not establish need."]]),
              aq("Why should competitors and alternatives be investigated?", "They show how customers currently meet the need and where the idea may add credible value", "Competition analysis improves understanding of demand and differentiation.", [["To copy another business exactly", "Copying does not create distinct value and may create ethical or legal issues."], ["To prove no planning is required", "Existing alternatives make careful planning more important."], ["To assume competition means the idea must stop", "Competition can indicate demand as well as a need to differentiate."]]),
              aq("Which statement best demonstrates feasibility thinking?", "The idea may work if the demand test succeeds, costs stay within the limit and the capability gap is addressed", "A conditional statement links evidence and constraints to the decision.", [["The idea cannot fail because it is creative", "Creativity does not remove uncertainty."], ["Every resource will somehow appear", "Resources must be identified and tested."], ["Personal fit is irrelevant if money is possible", "Work demands and life goals affect sustainability."]]),
              aq("What is the safest boundary for a classroom enterprise idea?", "Keep it hypothetical or within explicit teacher approval and verify requirements before any real activity", "Planning is not authorisation to trade, collect data or contact external parties.", [["Begin selling immediately to create evidence", "Real trading may introduce approvals and obligations not yet addressed."], ["Collect personal customer data without a purpose", "Data collection requires necessity, privacy and approval."], ["Assume the school name can be used", "Use of identity and external contact requires confirmation."]])
            ],
            longResponse: { id: "M08-S01-LR01", prompt: "Evaluate the viability and personal fit of a proposed micro-enterprise idea, then recommend proceeding, revising or stopping.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Define the target customer, need and value proposition.", "Analyse evidence of demand, competition and alternatives.", "Assess capabilities, resources, costs, constraints and personal fit.", "Identify decisive assumptions and recommend a bounded next test."], successCriteria: ["Uses evidence rather than enthusiasm alone.", "Explains both market feasibility and personal sustainability.", "Keeps any real-world step conditional on teacher approval and current requirements."], theoryAnchors: ["M08-S01-theory", "M08-S01-example"] }
          }),
          createSection({
            id: "M08-S02",
            title: "Business models, obligations and risk",
            learningIntention: "Compare ways of organising self-employment and identify the obligations and risks that must be verified before operating.",
            successCriteria: ["I can compare common business structures by control, responsibility, complexity and risk.", "I can map operational, financial, safety, legal and reputational risks without pretending they are eliminated.", "I can identify authoritative sources and professional advice boundaries."],
            theoryParagraphs: [
              "A business model explains how an activity creates value, reaches customers, uses resources and receives revenue while meeting costs. A business structure is the legal and administrative form through which it operates. Australian Government guidance identifies common structures including sole trader, partnership, company and trust, while the local module also explores contracting and franchising as ways work may be organised. These categories are not interchangeable: they can differ in control, liability, ownership, tax, reporting and setup. No structure is automatically best for every idea.",
              "Operating responsibilities depend on the activity, location, structure and whether other people are engaged. Potential areas include registrations, licences, tax, records, consumer requirements, contracts, intellectual property, privacy, insurance, employment and work health and safety. The exact requirements must be checked through current Australian Government, state or territory, local and industry sources, with qualified advice where needed. A classroom comparison teaches decision criteria; it is not legal, tax or business advice and does not authorise an enterprise.",
              "Risk management starts by identifying what could prevent the objective or cause harm, then considering likelihood, consequence and existing controls. Responses may avoid, reduce, transfer or accept a risk, but controls can introduce cost or new risks. Financial risk includes cash-flow shortfalls and unexpected costs; operational risk includes supply or equipment failure; people risk includes capability and safety; reputational risk includes unmet promises. A residual risk remains after controls and should be monitored against a clear tolerance and review point."
            ],
            workedExample: { title: "Choosing a structure for a fictional design service", context: "Two graduates want to offer small digital-design jobs. They are comparing operating separately, forming a partnership or investigating a company, but have not defined ownership, decision rights or risk.", analysis: "They compare who controls decisions, who owns work and equipment, how income and losses are treated, personal liability, setup and ongoing administration, and how disagreement or exit would be managed. They use current business.gov.au and ATO guidance and flag legal and accounting questions for qualified advice. The analysis may identify a provisional best fit, but it does not establish or register the business." },
            vocabulary: [
              { term: "business model", meaning: "the logic by which an activity creates and delivers value, receives revenue and meets costs" },
              { term: "business structure", meaning: "the legal and administrative form through which a business operates" },
              { term: "liability", meaning: "legal or financial responsibility for an obligation, debt, loss or harm" },
              { term: "control", meaning: "a measure or action intended to reduce the likelihood or consequence of a risk" },
              { term: "residual risk", meaning: "the risk that remains after planned controls are applied" }
            ],
            misconception: { claim: "Choosing a company structure removes every personal and business risk.", correction: "A company is a separate legal entity, but obligations, director responsibilities, guarantees, operational failures and other risks can remain; current professional advice may be needed." },
            appliedActivity: { id: "ALA-M08-S02", title: "Structure-and-risk comparison", prompt: "For a fictional micro-enterprise, compare sole trader, partnership and company structures using control, responsibility, complexity, cost and risk. Build a five-category risk register and label each legal, tax or local requirement for current verification.", evidence: "A comparison matrix, risk register and conditional structure recommendation." },
            visual: { id: "VIS-M08-S02", file: "assets/visuals/m08-s02.webp", alt: "Three pathways labelled sole trader, partnership and company leading through gates for control, responsibility, setup, reporting and risk, beside a colour-coded risk register.", purpose: "Separate business structure selection from the broader task of identifying and controlling risk." },
            mediaAlternative: { title: "Structure is a trade-off", before: "List the owners, decisions and main risks in the fictional idea.", during: "Compare how each structure changes control, responsibility and administration.", after: "Identify what remains unknown and where current advice is required." },
            applicationQuestions: [
              aq("What is the difference between a business model and a business structure?", "The model explains how value and revenue are created; the structure defines the legal and administrative form", "The two decisions interact but answer different questions.", [["The model is a logo and the structure is a slogan", "Brand elements do not define either concept."], ["They are two names for the same document", "They describe distinct aspects of an enterprise."], ["A structure proves customers will buy", "Demand and value still require evidence."]]),
              aq("Why is no business structure automatically best?", "Suitability depends on ownership, control, liability, cost, complexity and obligations in the specific context", "Structure choice involves trade-offs that vary with the enterprise.", [["All structures have identical rules", "Structures differ in important ways."], ["The oldest structure is always safest", "Age does not establish suitability."], ["Only the business name matters", "Name does not resolve responsibility or obligations."]]),
              aq("What does residual risk describe?", "The exposure that remains after planned controls are applied", "Controls reduce but rarely erase every possibility and consequence.", [["A risk that was never identified", "Unidentified risk is not the same as calculated residual exposure."], ["A guaranteed loss", "Risk concerns uncertainty, not certainty of loss."], ["The original risk before any control", "Residual risk is assessed after controls."]]),
              aq("Which source is strongest for checking current Australian business registrations?", "Current Australian Government business and tax information relevant to the chosen structure and activity", "Authority, currency and relevance are essential for regulatory questions.", [["An undated workbook alone", "A workbook can teach concepts but may not reflect current requirements."], ["A promotional influencer post", "Promotion does not establish official requirements."], ["A competitor's logo", "A logo contains no reliable registration guidance."]]),
              aq("Why might qualified advice be needed before acting?", "Structure, tax, contracts and liability can have consequences specific to the people and activity", "General classroom information cannot determine a personal legal or financial choice.", [["Students cannot learn the concepts", "Students can learn comparison and evidence skills without receiving personal advice."], ["Every idea needs the same adviser", "The need and type of advice depend on the issue."], ["Advice guarantees a profitable outcome", "Professional advice cannot guarantee demand or profit."]])
            ],
            longResponse: { id: "M08-S02-LR01", prompt: "Evaluate three possible structures for a fictional micro-enterprise and recommend a provisional fit alongside a risk-management and verification plan.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Explain the business model, ownership and decision needs.", "Compare control, responsibility, liability, complexity and ongoing administration.", "Map operational, financial, people, legal and reputational risks with controls and residual risk.", "Recommend provisionally and name each source or qualified-advice boundary still required."], successCriteria: ["Distinguishes structure, business model and risk controls.", "Uses current authoritative information without inventing obligations.", "Makes a conditional recommendation rather than personal legal or tax advice."], theoryAnchors: ["M08-S02-theory", "M08-S02-example"] }
          }),
          createSection({
            id: "M08-S03",
            title: "Planning, communicating and reviewing a micro-enterprise",
            learningIntention: "Build and review an evidence-based micro-enterprise plan that connects operations, finance, customers and ethical communication.",
            successCriteria: ["I can link goals, tasks, resources, costs, revenue assumptions and measures.", "I can communicate a truthful offer to a defined audience.", "I can use evidence to decide whether to continue, change, pause or stop."],
            theoryParagraphs: [
              "A useful business plan is a decision tool, not a decorative promise. It connects the problem and value proposition with customer evidence, operations, resources, roles, timing, costs, revenue assumptions, risk and measures of progress. Assumptions should be visible so they can be tested. A sales forecast is not income already earned, and revenue is not profit: costs and timing affect whether an activity is financially sustainable. A small test can provide better evidence than a confident large forecast.",
              "Enterprise communication should be accurate, audience-appropriate and consistent with what can actually be delivered. A name, message, image and channel create expectations about the offer. Ethical marketing explains relevant benefits and conditions without fabricated testimonials, hidden costs or pressure that exploits a person's vulnerability. Accessibility, privacy and cultural respect affect who can understand and respond. Any use of a school identity, public platform, personal data or external customer contact requires explicit approval and confirmed conditions.",
              "Review compares planned indicators with actual evidence. Financial indicators might include revenue, direct cost or cash timing; customer indicators might include enquiries, repeat use or feedback; operational indicators might include time, quality and rework; personal indicators might include workload and wellbeing. A decision gate asks whether the evidence supports continuing, revising, pausing or stopping. Stopping a weak idea after a careful test is not failure—it protects resources and demonstrates enterprise judgement."
            ],
            workedExample: { title: "Reviewing a prototype tutoring offer", context: "Sienna designs a fictional small-group study-skills service. Her plan assumes ten customers each week, but a teacher-approved expression-of-interest test produces three responses and strong requests for shorter sessions.", analysis: "Sienna separates projected revenue from actual evidence and recalculates time and cost at three customers. She reviews whether shorter sessions still deliver the promised value, changes the message and runs one bounded second test. She does not invent testimonials or launch publicly. The decision gate will compare demand, delivery quality, cost and workload before recommending revise, pause or stop." },
            vocabulary: [
              { term: "revenue", meaning: "money received from business activity before expenses are subtracted" },
              { term: "profit", meaning: "the amount remaining when relevant business expenses are subtracted from revenue" },
              { term: "sales forecast", meaning: "an evidence-based estimate of future sales rather than guaranteed income" },
              { term: "indicator", meaning: "a defined measure used to judge progress, performance or change" },
              { term: "decision gate", meaning: "a planned point where evidence is used to continue, revise, pause or stop an initiative" }
            ],
            misconception: { claim: "A detailed business plan proves the enterprise will succeed.", correction: "A plan organises assumptions and decisions; only testing, operation and review provide evidence about performance, and uncertainty always remains." },
            appliedActivity: { id: "ALA-M08-S03", title: "Micro-enterprise decision pack", prompt: "Build a hypothetical one-page plan, truthful customer message, simple forecast and decision dashboard for an approved idea. Apply one changed-demand scenario and recommend continue, revise, pause or stop.", evidence: "A privacy-safe plan, communication sample, forecast, indicator dashboard and review decision." },
            visual: { id: "VIS-M08-S03", file: "assets/visuals/m08-s03.webp", alt: "A young planner reviewing a one-page enterprise plan beside a truthful promotional mock-up, simple cost and revenue cards, customer feedback and a four-way decision gate.", purpose: "Connect planning and communication to measurable review rather than treating launch as the endpoint." },
            mediaAlternative: { title: "Plan-test-review enterprise cycle", before: "Mark every assumption in the plan.", during: "Compare the test evidence with the forecast and promise.", after: "Choose continue, revise, pause or stop and defend the gate decision." },
            applicationQuestions: [
              aq("Why must revenue and profit be distinguished?", "Revenue is money received before relevant expenses; profit is what remains after them", "An enterprise can receive revenue while still failing to cover its costs.", [["Revenue is always lower than every cost", "The relationship varies and must be calculated."], ["Profit means the forecast was popular", "Profit is a financial result, not audience reaction."], ["They are identical terms", "Expenses make the distinction important."]]),
              aq("What makes a sales forecast credible?", "Its assumptions are explicit and supported by relevant evidence and scenarios", "A forecast should be testable rather than presented as guaranteed income.", [["It uses the largest number possible", "Optimism alone weakens a forecast."], ["It hides how the estimate was made", "Visible assumptions enable review."], ["It counts expressions of interest as completed sales", "Interest and actual transactions are different evidence."]]),
              aq("Which message is most ethical?", "A clear description of the offer, price or conditions and evidence-based benefits without fabricated urgency", "Truthful communication lets customers make an informed decision.", [["A guaranteed result the service cannot prove", "Unsupported guarantees mislead."], ["A hidden cost revealed after commitment", "Relevant conditions should be visible."], ["A invented testimonial from a fictional customer presented as real", "Fabricated social proof is deceptive."]]),
              aq("What is the purpose of a decision gate?", "Use agreed evidence to decide whether to continue, revise, pause or stop", "A gate prevents momentum from replacing judgement.", [["Guarantee the original plan continues", "Evidence may support a different decision."], ["Remove all performance measures", "Measures are what make the gate useful."], ["Delay review until resources are exhausted", "A gate protects resources through timely review."]]),
              aq("Which review best reflects enterprise judgement?", "Compare financial, customer, operational and personal indicators before deciding", "A sustainable decision considers several connected dimensions.", [["Count only social-media likes", "Likes may not show purchase, delivery quality or sustainability."], ["Ignore workload if revenue rises", "Personal capacity affects whether the activity can continue."], ["Treat stopping as automatically shameful", "Evidence-based stopping can be responsible management."]])
            ],
            longResponse: { id: "M08-S03-LR01", prompt: "Evaluate a hypothetical micro-enterprise after its first bounded test and recommend whether it should continue, revise, pause or stop.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Compare customer, financial, operational and personal evidence with the original assumptions.", "Assess whether the communication remained truthful, accessible and deliverable.", "Explain significant variances, risks and new information.", "Make and justify a gate decision with a next test or closure action."], successCriteria: ["Separates forecast, revenue, cost and profit accurately.", "Uses multiple indicators and acknowledges evidence limits.", "Keeps external activity conditional on explicit approval and current requirements."], theoryAnchors: ["M08-S03-theory", "M08-S03-example"] }
          })
        ]
      },
      M09: {
        moduleId: "M09",
        title: "Team Enterprise Project",
        outcomes: outcomes(2, 5, 6, 7, 8, 9),
        prerequisite: "Module 4 Teamwork and Enterprise Skills or appropriate prior learning",
        sections: [
          createSection({
            id: "M09-S01",
            title: "Defining the problem and project purpose",
            learningIntention: "Define a manageable team enterprise project from a verified need, stakeholder evidence and clear success indicators.",
            successCriteria: ["I can write a problem statement that separates need from a preferred solution.", "I can define scope, stakeholders, constraints and a measurable purpose.", "I can test a proposal before committing team resources."],
            theoryParagraphs: [
              "The official module asks students to apply teamwork and enterprise skills through a project that resembles workplace situations. A project might explore a good, service, event, simulated business, community initiative or school support, but a possibility is not approval. The project, external contact, identity use, money, facilities, data and safety arrangements must follow your teacher’s current instructions. Until approval is explicit, students can complete a planning-only simulation using fictional stakeholders and costs.",
              "A strong project begins with a problem statement: who experiences what need, in which context, and what evidence shows it matters? Beginning with a favourite solution can cause solution fixation, where the team defends an idea before understanding the need. Stakeholder interviews, observations, existing records and small tests can clarify the problem, provided privacy and approval boundaries are followed. A purpose statement then describes the useful change the project intends to create without claiming an outcome that has not occurred.",
              "Scope makes the project manageable. It identifies inclusions, exclusions, time, resources, decision authority and constraints. Goals translate purpose into intended results; indicators describe evidence that would show progress or achievement. Both product or service outcomes and learning outcomes matter. A proposal should therefore connect problem, purpose, deliverable, stakeholders, scope, resources, risks, indicators and approval gates before implementation begins."
            ],
            workedExample: { title: "Scoping a reusable-resource initiative", context: "A team wants to 'fix waste at school' by selling reusable kits. The claim is broad, no waste evidence has been collected and sales are not approved.", analysis: "The team narrows the problem to a hypothetical pattern of disposable items at one event, identifies users and organisers, and proposes an approved audit or simulated dataset. It compares kit, communication and process-change options rather than locking into sales. The proposal defines a small deliverable, exclusions, indicators and approval gates. The project remains planning-only unless the teacher confirms implementation." },
            vocabulary: [
              { term: "problem statement", meaning: "an evidence-based description of who experiences a need, what occurs and in which context" },
              { term: "scope", meaning: "the agreed boundaries of what a project includes, excludes and is authorised to do" },
              { term: "deliverable", meaning: "a defined product, service or documented result the project will produce" },
              { term: "indicator", meaning: "a specific measure or observation used to judge progress or achievement" },
              { term: "solution fixation", meaning: "committing to a preferred answer before the problem and alternatives are understood" }
            ],
            misconception: { claim: "A project proposal is strongest when it promises to solve the biggest possible problem.", correction: "A credible proposal defines a bounded need, achievable deliverable, evidence and authority; exaggerated scope weakens feasibility and accountability." },
            appliedActivity: { id: "ALA-M09-S01", title: "Problem-to-proposal sprint", prompt: "Use a fictional or teacher-approved need to create a problem statement, stakeholder map, three alternative responses, scope boundary, deliverable and five indicators. Mark every approval dependency that requires current teacher instructions.", evidence: "A one-page proposal canvas and 90-second team pitch." },
            visual: { id: "VIS-M09-S01", file: "assets/visuals/m09-s01.webp", alt: "A student enterprise team arranging evidence, a problem statement, stakeholder cards, alternative ideas, scope boundaries and approval gates on a project wall.", purpose: "Show that project purpose emerges from evidence and boundaries rather than the first appealing solution." },
            mediaAlternative: { title: "From broad idea to bounded proposal", before: "Write the need without naming a solution.", during: "Compare alternatives and add scope and approval gates.", after: "Test whether each indicator could provide usable evidence." },
            applicationQuestions: [
              aq("Why should a problem statement avoid naming the preferred solution?", "It keeps the need open to investigation and comparison of alternatives", "Separating problem and solution reduces fixation.", [["Projects should never produce a solution", "Solutions follow once the need is understood."], ["Stakeholders cannot understand products", "Stakeholders may help evaluate both needs and options."], ["A solution is always confidential", "Confidentiality depends on context, not the concept of a solution."]]),
              aq("What does project scope protect against?", "Uncontrolled expansion beyond the agreed purpose, resources and authority", "Clear boundaries support feasibility and accountability.", [["Any change based on evidence", "Managed change can improve a project."], ["Team members communicating", "Communication is required within scope."], ["Using measurable indicators", "Indicators strengthen review."]]),
              aq("Which is the strongest indicator for an information campaign?", "A defined change in audience understanding measured with the same short check before and after", "The indicator links the intended outcome to comparable evidence.", [["The team liked its poster", "Creator satisfaction does not show audience learning."], ["The campaign used many colours", "Design features are not an outcome by themselves."], ["One person walked past the display", "Exposure alone does not demonstrate understanding."]]),
              aq("When can a school enterprise proposal move into real implementation?", "When the teacher confirms the project and every relevant approval, safety, resource and external-contact condition", "Planning does not create authority to operate.", [["As soon as the team agrees", "Team agreement cannot replace required approval."], ["When a draft logo is complete", "Branding does not establish permission."], ["Whenever costs are fictional", "Real activity may still involve safety, identity or external-contact requirements."]]),
              aq("What is the value of comparing alternative responses?", "It tests whether the preferred idea is the best fit for the need, evidence and constraints", "Alternatives expose trade-offs before resources are committed.", [["It guarantees every stakeholder agrees", "Reasoned comparison may still leave disagreement."], ["It removes the need for scope", "Every selected option still needs boundaries."], ["It proves all ideas should be implemented", "Comparison supports selection, revision or rejection."]])
            ],
            longResponse: { id: "M09-S01-LR01", prompt: "Evaluate three possible enterprise responses to a verified need and justify a bounded project proposal.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Define the need, context, stakeholders and evidence.", "Compare three options against purpose, resources, constraints and likely impact.", "Specify scope, deliverable, indicators and approval dependencies.", "Justify the proposal and explain what would cause revision or rejection."], successCriteria: ["Avoids solution fixation.", "Links proposal elements to credible evidence and measurable indicators.", "Does not imply implementation before teacher confirmation."], theoryAnchors: ["M09-S01-theory", "M09-S01-example"] }
          }),
          createSection({
            id: "M09-S02",
            title: "Planning roles, resources, risks and communication",
            learningIntention: "Coordinate a team enterprise project through accountable roles, sequenced work, resource control, risk management and communication.",
            successCriteria: ["I can allocate roles by task needs, capability and workload rather than status.", "I can build a dependency-aware action plan and resource record.", "I can use meetings, risk review and change control to keep the project aligned."],
            theoryParagraphs: [
              "Team planning converts a proposal into coordinated action. Roles should make responsibility visible without isolating information or allowing one person to dominate. A role allocation can consider capability, learning goals, availability and workload, with backup arrangements for critical tasks. Responsibility means owning the next action and reporting evidence; accountability remains shared where team decisions affect the whole project. Meeting records capture decisions, actions, owners and due dates rather than reproducing every spoken word.",
              "An action plan sequences tasks and shows dependencies—work that cannot begin until another task or approval is complete. Milestones mark meaningful progress, while a resource register tracks people, time, materials, equipment, information and any approved funds. Estimates should include contingencies and actual use should be recorded. A project can fail even when each individual is busy if critical dependencies, approvals or shared resources are not managed.",
              "Risk and communication are continuous, not one-off forms. The team reviews safety, financial, operational, privacy, reputational and participation risks as conditions change. A change request states what is proposed, why, impact on scope, time, resources and risk, and who can approve it. Communication is matched to audience and purpose, and disagreement is resolved through evidence, shared goals and agreed decision rules. Local tools, contacts and authorisation levels must follow your teacher’s current instructions."
            ],
            workedExample: { title: "Recovering a slipping event simulation", context: "A team planning a simulated careers event has attractive promotion drafts but no confirmed session plan. The venue task depends on teacher approval and one member holds all stakeholder notes.", analysis: "The team maps dependencies, pauses promotion claims that rely on unconfirmed details and redistributes the notes to an approved shared location. Roles are reallocated by workload and capability, with one owner and backup for each critical task. A change request reduces the simulated event scope and updates milestones, risks and messages. The response targets the bottleneck rather than blaming the busiest-looking member." },
            vocabulary: [
              { term: "dependency", meaning: "a relationship in which one task relies on another task, decision or approval" },
              { term: "milestone", meaning: "a significant checkpoint showing that a defined stage or result has been reached" },
              { term: "resource register", meaning: "a record of the people, time, materials, equipment, information and funds required and used" },
              { term: "change control", meaning: "a process for assessing and authorising changes to project scope, time, resources or risk" },
              { term: "accountability", meaning: "the obligation to explain decisions, actions and results against agreed responsibilities" }
            ],
            misconception: { claim: "Good teamwork means everyone completes exactly the same amount of every task.", correction: "Fair teamwork allocates clear, meaningful contributions according to task need, capability, learning and workload, then makes accountability and support visible." },
            appliedActivity: { id: "ALA-M09-S02", title: "Enterprise control-room simulation", prompt: "Turn the approved or hypothetical proposal into a role matrix, dependency plan, milestone timeline, resource register, risk log and meeting record. Respond to a supplied disruption through a documented change request.", evidence: "A coordinated project-control pack and individual accountability note." },
            visual: { id: "VIS-M09-S02", file: "assets/visuals/m09-s02.webp", alt: "A diverse student team around a project board linking roles, task dependencies, milestones, shared resources, risks and a formal change card.", purpose: "Make the invisible coordination work of a team project visible." },
            mediaAlternative: { title: "Project disruption challenge", before: "Identify critical tasks, owners, dependencies and risks.", during: "Introduce a resource loss and trace its effects.", after: "Approve or reject a change and update all affected records." },
            applicationQuestions: [
              aq("What is the best basis for allocating team roles?", "Task requirements considered with capability, learning goals, availability and balanced workload", "Role allocation should support both delivery and fair participation.", [["Who speaks loudest", "Volume does not establish capability or fair authority."], ["Give all critical work to one person", "Concentration creates risk and weakens learning."], ["Random allocation with no review", "Some experimentation is useful, but needs and workload must be managed."]]),
              aq("Why are dependencies important in an action plan?", "They reveal tasks or approvals that can delay other work", "Managing the critical sequence prevents busy activity from hiding a bottleneck.", [["They prove every task can start together", "Dependencies often show the opposite."], ["They replace task owners", "Each task still needs responsibility."], ["They remove uncertainty from estimates", "Planning reduces but does not eliminate uncertainty."]]),
              aq("What belongs in a useful meeting record?", "Decisions, reasons where needed, actions, owners and due dates", "A record should enable follow-through and accountability.", [["Every pause and repeated sentence", "A transcript is unnecessary for most project meetings."], ["Only unresolved arguments", "Decisions and actions are central."], ["Private speculation about team members", "Records should be respectful, necessary and factual."]]),
              aq("When should change control be used?", "When a proposed change affects agreed scope, time, resources, risk or authority", "The impact should be assessed before the team quietly drifts from the proposal.", [["Only after the project finishes", "Change needs assessment while it can guide action."], ["Whenever one word is corrected", "Minor editorial fixes may not affect controlled baselines."], ["To avoid explaining why a change occurred", "Reason and impact are core to change control."]]),
              aq("How should a team respond to a critical task held by one unavailable member?", "Use the backup plan, access approved shared evidence and reassign responsibility transparently", "Resilience depends on shared records and planned continuity.", [["Pretend the task is complete", "False reporting undermines delivery."], ["Access the person's private accounts", "Continuity must respect access and privacy boundaries."], ["Blame the person and stop all work", "The team should manage the dependency and capacity respectfully."]])
            ],
            longResponse: { id: "M09-S02-LR01", prompt: "Evaluate a slipping team enterprise project and redesign its coordination system to recover the most important outcomes.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Identify the bottleneck, dependencies, workload imbalance and evidence gaps.", "Redesign roles, milestones, resources, communication and backup arrangements.", "Assess new or changed risks and document the required change control.", "Explain how accountability and progress will be monitored fairly."], successCriteria: ["Targets root coordination causes rather than blaming an individual.", "Updates connected project controls consistently.", "Preserves privacy, safety and approval boundaries."], theoryAnchors: ["M09-S02-theory", "M09-S02-example"] }
          }),
          createSection({
            id: "M09-S03",
            title: "Delivering, evaluating and presenting enterprise evidence",
            learningIntention: "Evaluate an enterprise project through outcome evidence, teamwork learning and an honest account of decisions and limitations.",
            successCriteria: ["I can compare results with baseline, goals and indicators.", "I can distinguish team outcomes from my individual contribution and learning.", "I can present a credible story that includes adaptations, limitations and next steps."],
            theoryParagraphs: [
              "Delivery is controlled implementation, not simply finishing a product. Teams monitor quality, schedule, resources, participation and risk while recording decisions and changes. Evidence may include approved observations, counts, feedback, version history, meeting actions and product checks. The collection method should be proportional, privacy-safe and aligned with the indicator. More evidence is not automatically better if it is irrelevant, inconsistent or collected without authority.",
              "Evaluation compares what was intended with what occurred and explains why. Outcome evidence assesses the effect of the deliverable; process evidence assesses planning, communication and problem-solving; learning evidence shows growth in teamwork and enterprise skills. Attribution should be cautious: a positive change after a project does not prove the project caused all of it. Limitations, unexpected effects and stakeholder differences belong in a credible evaluation.",
              "A project presentation should make reasoning visible. It can move from need and purpose to proposal, implementation, adaptations, evidence, evaluation and next steps. Claims should match the strength of evidence, and setbacks should be analysed rather than hidden. Individual reflection identifies a specific contribution, feedback, learning and transfer to future work. Approved public-safe artefacts can illustrate the story; personal data, unapproved images, private messages and fabricated testimonials must be excluded."
            ],
            workedExample: { title: "Evaluating a simulated orientation resource", context: "A team creates a prototype orientation guide. Five test users find information faster, but two pages remain confusing and only one test group was involved.", analysis: "The team compares completion time and feedback with its baseline and reports the small sample as a limitation. It explains the page redesign and shows version evidence. It does not claim the guide will work for every user or that the project is authorised for public release. Each member links an individual contribution and feedback to a transferable work skill." },
            vocabulary: [
              { term: "baseline", meaning: "the starting evidence used to compare later change or performance" },
              { term: "attribution", meaning: "a judgement about how much a project contributed to an observed result" },
              { term: "process evidence", meaning: "records showing how planning, communication, decisions and problem-solving occurred" },
              { term: "outcome evidence", meaning: "information showing the result or effect of a project deliverable" },
              { term: "limitation", meaning: "a factor that restricts the certainty, reach or interpretation of findings" }
            ],
            misconception: { claim: "A successful presentation should hide every setback.", correction: "Credible enterprise evidence explains setbacks, responses and limitations because adaptation and honest evaluation demonstrate workplace learning." },
            appliedActivity: { id: "ALA-M09-S03", title: "Evidence-to-story showcase", prompt: "Use an approved or fictional project evidence pack to build a five-part presentation: need, action, adaptation, result and next step. Include one limitation and an individual transfer statement.", evidence: "A public-safe presentation storyboard, indicator table and individual reflection." },
            visual: { id: "VIS-M09-S03", file: "assets/visuals/m09-s03.webp", alt: "A team presenting a project journey with baseline, implementation photographs represented by placeholders, change decisions, outcome measures, limitations and individual learning cards.", purpose: "Model an honest evidence story that integrates product, process and learning." },
            mediaAlternative: { title: "Claim-evidence-limit presentation", before: "Match each planned indicator to the available evidence.", during: "Challenge claims that extend beyond the evidence.", after: "Add one limitation, adaptation and transferable learning statement." },
            applicationQuestions: [
              aq("Why is a baseline needed for evaluation?", "It provides a starting point against which later results can be compared", "Without a baseline, the scale and direction of change are harder to judge.", [["It guarantees the project caused the change", "Attribution still requires caution."], ["It replaces the project goal", "Baseline and goal serve different functions."], ["It is only a presentation decoration", "It is evidence used in analysis."]]),
              aq("Which evidence best shows project process?", "Dated meeting actions and versions showing how the team responded to a problem", "Process evidence makes decision-making and adaptation visible.", [["A final slogan alone", "A slogan does not show how work occurred."], ["An unrelated industry statistic", "Context evidence is not evidence of this team's process."], ["An unsupported claim that teamwork was good", "The claim needs specific examples or records."]]),
              aq("Why should attribution be cautious?", "Other factors may also contribute to an observed change", "Timing alone does not prove one project caused the whole outcome.", [["Projects can never influence outcomes", "Projects can contribute; the strength of evidence determines the claim."], ["Only negative results have causes", "Positive and negative results both require analysis."], ["Evaluation should ignore context", "Context helps explain competing influences."]]),
              aq("What strengthens an individual reflection?", "A specific contribution linked to feedback, learning and a future work context", "Specific evidence shows how team experience transfers to personal capability.", [["Claiming credit for the whole team", "That distorts shared contribution."], ["Listing tasks with no learning", "Reflection explains significance and change."], ["Repeating the project title", "A title provides no evidence of contribution."]]),
              aq("Which presentation claim is most credible?", "In this small test, users improved on the selected measure, but broader use requires further testing", "The claim reports the result while respecting sample and scope limitations.", [["The prototype will work for every person", "The small test cannot support a universal claim."], ["The project had no limitations", "Every evaluation has boundaries."], ["Positive feedback proves all goals were achieved", "Feedback is one source and must be matched to each indicator."]])
            ],
            longResponse: { id: "M09-S03-LR01", prompt: "Evaluate a team enterprise project using outcome, process and learning evidence, then propose a justified next step.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Compare baseline, goals, indicators and actual results.", "Explain important decisions, adaptations and team processes using evidence.", "Assess attribution, stakeholder differences, limitations and unintended effects.", "Recommend the next step and identify your transferable individual learning."], successCriteria: ["Integrates product, process and learning evidence.", "Keeps claims within the evidence and acknowledges limitations.", "Uses only approved, privacy-safe material in the proposed presentation."], theoryAnchors: ["M09-S03-theory", "M09-S03-example"] }
          })
        ]
      },
      M10: {
        moduleId: "M10",
        title: "Experiencing Work",
        outcomes: outcomes(1, 2, 3, 4, 5, 6, 7, 8, 9),
        teacherToConfirm: [
          "Whether workplace experience is delivered and all required school approvals, host arrangements, documentation, supervision and local procedures.",
          "The approved workplace, dates, contacts, travel, accessibility, emergency, incident, confidentiality and evidence arrangements for each student.",
          "Which tasks a student may observe or perform and the workplace-specific induction, training, controls and supervision required before participation."
        ],
        sections: [
          createSection({
            id: "M10-S01",
            title: "Preparing for workplace experience",
            learningIntention: "Prepare for possible workplace experience by researching the environment, setting learning goals and recognising that approval, induction and workplace-specific safety directions control participation.",
            successCriteria: ["I can distinguish general readiness learning from an authorised placement instruction.", "I can research a workplace and set specific, observable learning goals.", "I can explain hazard, risk and control concepts while deferring to confirmed workplace procedures."],
            theoryParagraphs: [
              "Workplace experience can connect classroom learning with actual work environments, roles, relationships and expectations. It is not an automatic course activity. Whether it is used, and every approval, host, documentation, supervision, travel, accessibility, emergency and communication arrangement, must follow the school's confirmed placement process and the host workplace's authorised arrangements. A student must not contact a host, attend a workplace or perform a task on the basis of this course page. Preparation begins only within those confirmed arrangements.",
              "Useful preparation investigates the organisation's purpose, customers or community, work environment, roles, common communication and the skills students may be able to observe. A learning goal should be specific and observable, such as identifying how a team hands over work or gathering approved examples of how priorities are managed. A personal readiness check can consider punctuality planning, suitable communication, accessibility, transport and questions for induction, while avoiding guesses about dress, equipment or conduct that the host must confirm.",
              "Work health and safety concepts help students ask better questions. A hazard is a source or situation with potential to cause harm; risk concerns the likelihood and consequence of that harm; a control is a measure used to reduce risk. Workplaces differ, so the correct controls, protective equipment, training, emergency actions, reporting path and permitted tasks must come from current workplace induction and authorised supervisors. If a student is uncertain, lacks training or perceives danger, the safe principle is to pause and seek direction through the confirmed process rather than improvise."
            ],
            workedExample: { title: "Preparing for a hypothetical library placement", context: "Tahlia may undertake workplace experience in a public library, subject to school and host confirmation. She assumes the work will only involve shelving and therefore has no safety or communication questions.", analysis: "Tahlia researches the library's purpose and possible teams, then writes goals about customer communication and task prioritisation. She prepares questions about induction, permitted tasks, manual handling, privacy, emergencies, breaks, accessibility and who gives instructions. She does not decide that shelving is safe, choose equipment or contact the library independently. Every placement detail and control must be checked through the school's confirmed placement process and the host workplace's authorised arrangements before participation." },
            vocabulary: [
              { term: "workplace experience", meaning: "an authorised learning experience in a real work setting under confirmed school and host arrangements" },
              { term: "induction", meaning: "workplace-specific introduction to roles, expectations, hazards, controls, procedures and support" },
              { term: "hazard", meaning: "a source or situation with the potential to cause harm" },
              { term: "risk", meaning: "the likelihood and consequence of harm occurring in a particular context" },
              { term: "control", meaning: "a measure used to eliminate a hazard or reduce its associated risk" }
            ],
            misconception: { claim: "A familiar-looking task is safe for a student to begin without instruction.", correction: "Familiarity does not establish authorisation or safety; the host's confirmed induction, task permission, training, controls and supervision determine participation." },
            appliedActivity: { id: "ALA-M10-S01", title: "Placement-readiness simulation", prompt: "For a fictional workplace only, create an environment research brief, three observable learning goals and an induction question bank covering roles, communication, hazards, controls, privacy, accessibility and support. Label every real local detail that must be confirmed through the school's placement process or the host workplace's authorised arrangements.", evidence: "A planning-only readiness brief and question bank; it does not authorise contact, attendance or task participation." },
            visual: { id: "VIS-M10-S01", file: "assets/visuals/m10-s01.webp", alt: "A student preparing outside a workplace with research notes, learning goals and induction questions, while locked gates for school approval, host confirmation, safety induction and supervision remain clearly visible.", purpose: "Show that good preparation supports but never replaces formal approval and workplace-specific induction." },
            mediaAlternative: { title: "Ready is not yet authorised", before: "Research the fictional workplace and write observable goals.", during: "Identify questions that only an induction or supervisor can answer.", after: "Sort preparation evidence from approval and task-authority evidence." },
            applicationQuestions: [
              aq("What does this learning package authorise a student to do?", "Complete classroom preparation and simulations only, unless every real placement requirement is confirmed", "Course content supports readiness but cannot create school or workplace authority.", [["Attend any workplace that seems relevant", "Attendance requires confirmed school and host arrangements."], ["Use equipment after watching someone once", "Task permission, training, controls and supervision are workplace-specific."], ["Contact a host using details found online", "External contact must follow the confirmed school process."]]),
              aq("Which learning goal is most observable?", "Record two approved examples of how the team communicates a change in task priority", "The goal specifies evidence that can be noticed and discussed.", [["Understand absolutely everything about work", "The goal is too broad to observe or evaluate."], ["Be good at the placement", "It does not define what evidence would show progress."], ["Impress every worker", "Approval is not measured by universal approval from others."]]),
              aq("Why must workplace controls come from induction and authorised supervision?", "Hazards, tasks, equipment and procedures differ across workplaces and roles", "General concepts cannot determine a site-specific safe method.", [["Safety concepts have no value", "They help students recognise and ask about risk."], ["Every workplace uses identical equipment", "Work contexts vary significantly."], ["Students are responsible for inventing controls", "Workplace controls require authorised, competent direction."]]),
              aq("What should a student do when uncertain whether a task is permitted?", "Pause and seek direction through the confirmed supervisor or workplace process", "Uncertainty should be resolved before participation.", [["Try the task quickly", "Speed does not remove risk or authority requirements."], ["Copy another worker without asking", "Their role, competence and permission may differ."], ["Hide the uncertainty", "Raising uncertainty supports safe participation."]]),
              aq("Which preparation question is most useful?", "Who is authorised to give me task instructions, and what should I do if I am unsure?", "It clarifies authority and a safe response to uncertainty.", [["Can I skip the induction if I read the website?", "Public information cannot replace site-specific induction."], ["Which confidential records may I photograph?", "Students should not assume any right to capture records."], ["Can I choose my own emergency procedure?", "Emergency procedures come from the workplace's confirmed system."]])
            ],
            longResponse: { id: "M10-S01-LR01", prompt: "Apply the section’s planning criteria to build a preparation plan for a hypothetical workplace experience that maximises learning while preserving every approval, safety and privacy boundary.", higherOrderVerb: "apply", scaffoldPrompts: ["Research the workplace purpose, environment, roles and communication using public-safe information.", "Set specific observable learning goals and preparation actions.", "Map hazards as questions and identify which controls require induction or authorised direction.", "List every school, host and local detail that must be confirmed through the school's placement process or the host workplace's authorised arrangements before any real participation."], successCriteria: ["Clearly separates readiness learning from authorisation.", "Uses hazard, risk and control concepts accurately without inventing procedures.", "Includes accessible, privacy-safe questions and escalation for uncertainty."], theoryAnchors: ["M10-S01-theory", "M10-S01-example"] }
          }),
          createSection({
            id: "M10-S02",
            title: "Observing, participating and recording evidence",
            learningIntention: "Recognise how authorised observation, participation, professional conduct and privacy-safe evidence can demonstrate workplace learning.",
            successCriteria: ["I can distinguish observation, authorised participation and independent action.", "I can record factual, privacy-safe evidence linked to a learning goal.", "I can seek, interpret and apply feedback within confirmed supervision."],
            theoryParagraphs: [
              "In an authorised placement, participation remains bounded by the student's induction, permitted tasks, training and supervision. Observing a task does not automatically authorise performing it, and performing one task under direction does not authorise a different task or independent repetition. Professional conduct includes punctuality, respectful communication, attention to instructions, asking when uncertain and staying within role. Exact expectations, contacts and processes come from the school's confirmed placement process and the host workplace's authorised arrangements; workplace-specific induction and authorised supervision control participation on site.",
              "Evidence should make learning visible without exposing the workplace. A factual learning record can note the date or stage, approved task or observation, role, action, feedback and learning, using no unnecessary personal or commercial detail. Photographs, screenshots, documents, customer information, names and workplace systems must not be captured or copied unless explicitly authorised through the confirmed process. A generalised diagram, de-identified observation or teacher-provided template may communicate the learning more safely.",
              "Feedback is information about performance in relation to an expectation. The student can listen, paraphrase the message, ask a clarifying question, identify the next observable action and later check whether performance improved. Feedback should not be treated as a judgement of personal worth, and one comment may reflect a single context. When feedback conflicts with safety, induction or role boundaries, the student seeks clarification through the confirmed supervisor rather than following it blindly."
            ],
            workedExample: { title: "Recording an authorised customer-service observation", context: "During a hypothetical approved placement, Jay observes a supervisor respond to a customer query, then completes a permitted greeting task. He wants to photograph the screen as evidence.", analysis: "Jay does not capture the screen because it may contain customer and business information. He writes a de-identified note: the communication purpose, two techniques observed, the authorised task he attempted, the supervisor's feedback and the next behaviour to practise. He confirms any evidence requirement through the school and host process. Observation, participation and evidence collection remain separate permissions." },
            vocabulary: [
              { term: "authorised participation", meaning: "taking part in a task that has been specifically permitted with required training, controls and supervision" },
              { term: "professional conduct", meaning: "reliable, respectful and role-appropriate behaviour consistent with confirmed workplace expectations" },
              { term: "objective record", meaning: "a factual account that separates observable events from opinion and unnecessary personal detail" },
              { term: "confidentiality", meaning: "protecting information by limiting access and disclosure to authorised people and purposes" },
              { term: "feedback loop", meaning: "a cycle of receiving information, choosing an action, trying it and checking for improvement" }
            ],
            misconception: { claim: "If a student is allowed to observe a task, they are allowed to perform and photograph it.", correction: "Observation, task participation and evidence capture are separate permissions, each controlled by confirmed workplace, safety, privacy and school requirements." },
            appliedActivity: { id: "ALA-M10-S02", title: "Evidence-without-exposure lab", prompt: "Using a fictional placement vignette, turn five raw notes into objective, de-identified learning records. For each, label observation, authorised participation, feedback and the permission needed for any artefact.", evidence: "A privacy-safe learning log and a permission decision table." },
            visual: { id: "VIS-M10-S02", file: "assets/visuals/m10-s02.webp", alt: "A student writing a de-identified learning log while separate permission signs govern observing, performing a task and capturing an artefact; customer screens and names remain blurred and protected.", purpose: "Make the distinct boundaries between learning activity and evidence capture visible." },
            mediaAlternative: { title: "Observe, participate, record", before: "Predict which permissions apply to each action.", during: "Pause when the student moves from observation to participation or evidence capture.", after: "Rewrite the evidence so it proves learning without exposing people or systems." },
            applicationQuestions: [
              aq("What does observing an employee perform a task prove about the student's authority?", "Only that observation occurred; participation still requires specific permission, training, controls and supervision", "Different actions require different authority.", [["The student may now repeat any related task", "Permission does not automatically transfer across tasks."], ["The student is a qualified employee", "Observation does not create a qualification or employment status."], ["The task has no hazards", "Observation alone cannot establish risk controls."]]),
              aq("Which learning-log sentence is most objective?", "I confirmed the request by paraphrasing it, and the supervisor said the details were accurate", "The sentence identifies an observable action and attributed feedback.", [["Everyone thought I was amazing", "The claim is broad, subjective and unsupported."], ["The customer was difficult", "The label interprets a person rather than recording relevant behaviour."], ["I probably solved every communication problem", "The claim is speculative and exaggerated."]]),
              aq("Why should a workplace screen not be photographed by default?", "It may contain personal, commercial or system information and capture requires explicit permission", "Evidence collection must respect confidentiality and authority.", [["Screens never contain useful learning", "They may, but usefulness does not create permission."], ["Only printed documents are confidential", "Digital information can also be sensitive."], ["A student owns every image they take", "Ownership does not override privacy or workplace requirements."]]),
              aq("What makes feedback part of a feedback loop?", "The student identifies an action, applies it and checks whether performance improves", "Feedback becomes learning through tested change and review.", [["The comment is heard once and forgotten", "No action or review occurs."], ["The student argues with every suggestion", "Clarification is useful, but automatic rejection blocks learning."], ["The comment is treated as a permanent identity", "Feedback concerns performance in context, not personal worth."]]),
              aq("What should happen if an instruction appears inconsistent with induction or safety boundaries?", "Pause and seek clarification through the confirmed supervisor or process", "Conflicting directions should be resolved before action.", [["Follow whichever instruction was most recent", "Recency does not settle authority or safety."], ["Improvise a compromise", "Improvisation may create additional risk."], ["Post the conflict publicly", "Use the confirmed private support and reporting process."]])
            ],
            longResponse: { id: "M10-S02-LR01", prompt: "Evaluate a hypothetical day of workplace experience and create a privacy-safe evidence record that distinguishes observation, authorised participation, feedback and unresolved questions.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Classify each event as observation, authorised participation, communication, feedback or uncertainty.", "Identify the permission, training, control and supervision boundaries.", "Rewrite raw notes as objective, de-identified evidence linked to learning goals.", "Explain the next feedback-loop action and any question requiring confirmed guidance."], successCriteria: ["Does not turn observation into assumed task authority.", "Uses specific evidence while protecting people and workplace information.", "Treats feedback as an action-and-review cycle."], theoryAnchors: ["M10-S02-theory", "M10-S02-example"] }
          }),
          createSection({
            id: "M10-S03",
            title: "Reflecting, transferring learning and planning next steps",
            learningIntention: "Evaluate workplace learning, transfer evidence to future contexts and build a realistic next-step pathway plan.",
            successCriteria: ["I can move from description to evidence-based reflection.", "I can translate a workplace example into a transferable skill claim without exaggeration.", "I can compare next steps using goals, gaps, feasibility and review evidence."],
            theoryParagraphs: [
              "Reflection explains the significance of experience rather than listing events. A useful sequence identifies the situation and goal, the student's authorised action or observation, the result or feedback, the learning and what would change next time. Positive and difficult moments can both produce evidence. The quality of reflection depends on specificity and honesty, not on presenting the experience as perfect. If a placement did not occur, the same reasoning can be applied to an approved simulation without pretending it was workplace participation.",
              "Transfer turns one example into a credible claim about future performance. The student names the skill, provides concise context, explains their own action and result, and identifies where else the capability could apply. Transfer is stronger when similarities and differences between contexts are acknowledged. For example, prioritising tasks in a library may support future hospitality work, but customer needs, hazards, systems and supervision will differ. Evidence can inform a resume, interview or pathway conversation only within privacy and approval boundaries.",
              "Next-step planning combines self-knowledge with pathway research. Students can compare further education, training, employment, volunteering or additional experience against their goals, evidence, gaps, resources and commitments. A gap is not a personal deficit; it is a capability, credential, information or experience requirement that may be addressed through a realistic action. Current entry requirements and local opportunities must be verified. A reviewable plan names the next step, support, evidence of progress, contingency and date for reconsideration."
            ],
            workedExample: { title: "Turning feedback into a pathway step", context: "In a hypothetical approved placement, Amara receives positive feedback about calm customer communication and a suggestion to make task updates more concise. She is considering community-services training.", analysis: "Amara writes one evidence statement about clarifying a customer's need and one growth goal about concise handover. She compares current pathway requirements from authoritative sources, identifies which communication evidence transfers and which role-specific capabilities remain unknown, and plans a short course-information check plus a practice activity. Her recommendation is conditional on verified entry information and personal feasibility, not a claim that one placement proves career certainty." },
            vocabulary: [
              { term: "reflection", meaning: "evidence-based consideration of what occurred, what was learned and how future action may change" },
              { term: "transferable evidence", meaning: "a specific example that can support a capability claim in another relevant context" },
              { term: "capability gap", meaning: "a skill, knowledge, credential, information or experience requirement not yet demonstrated" },
              { term: "pathway", meaning: "a possible sequence of education, training, work and life steps towards a goal" },
              { term: "contingency", meaning: "a prepared alternative action if the preferred next step cannot proceed" }
            ],
            misconception: { claim: "One workplace experience proves which career a student should choose for life.", correction: "One experience provides useful but limited evidence; career decisions should compare self-knowledge, multiple sources, pathway requirements, feasibility and changing goals." },
            appliedActivity: { id: "ALA-M10-S03", title: "Evidence-to-pathway portfolio", prompt: "Use a fictional, simulated or authorised de-identified experience to write two skill evidence statements, one growth goal and a comparison of three next-step pathways. Verify current requirements from the provider or official source, or state that they still require confirmation.", evidence: "A privacy-safe reflection, transfer matrix and reviewable pathway action plan." },
            visual: { id: "VIS-M10-S03", file: "assets/visuals/m10-s03.webp", alt: "A student connects de-identified workplace learning cards to several possible education, training, employment and volunteering pathways, each with evidence, gaps, contingencies and review points.", purpose: "Show workplace experience as one evidence source within a flexible, non-linear pathway decision." },
            mediaAlternative: { title: "From one experience to several futures", before: "Select one specific event and identify the student's own action.", during: "Translate it into evidence and test where the skill transfers or changes.", after: "Compare next steps and add a contingency and review date." },
            applicationQuestions: [
              aq("What distinguishes reflection from an event list?", "Reflection explains evidence, learning, significance and a future adjustment", "It moves from what happened to what it means and changes.", [["Reflection uses more adjectives", "Length or praise does not create analysis."], ["Reflection removes all setbacks", "Difficulties can provide important learning evidence."], ["Reflection predicts a guaranteed career", "One experience cannot guarantee a pathway."]]),
              aq("Which is the strongest transferable skill statement?", "I clarified a customer's request by paraphrasing it, which reduced correction and can support other service contexts", "It links a specific action and result to a plausible broader capability.", [["I am excellent at every type of communication", "The claim is too broad for one example."], ["Communication happened around me", "The student's contribution is unclear."], ["All workplaces communicate identically", "Contexts and systems differ."]]),
              aq("How should a capability gap be interpreted?", "As a defined requirement that can inform learning, evidence gathering or pathway choice", "A gap supports planning rather than a judgement of worth.", [["As proof the pathway is permanently impossible", "Many gaps can be addressed or alternative routes explored."], ["As something to hide from planning", "Visible gaps make actions more realistic."], ["As a reason to invent experience", "Evidence must remain honest."]]),
              aq("Why must current pathway requirements be verified?", "Entry conditions, providers and opportunities can change", "Current authoritative information is needed before relying on a route.", [["Pathway research has no value", "Research is valuable when authoritative and current."], ["A class example is a guaranteed offer", "Examples do not create admission or employment."], ["Only friends can confirm requirements", "Personal experience may help but does not replace the current authority."]]),
              aq("What makes a next-step plan reviewable?", "It names an action, support, progress evidence, contingency and a date to reconsider", "These elements make change and decision points visible.", [["It states a dream with no evidence", "Purpose helps, but action and review are needed."], ["It assumes circumstances never change", "Review and contingency prepare for change."], ["It contains as many pathways as possible", "A focused comparison is more useful than an unprioritised list."]])
            ],
            longResponse: { id: "M10-S03-LR01", prompt: "Evaluate what a hypothetical or authorised workplace experience reveals about a student's capabilities and recommend a reviewable next-step pathway.", higherOrderVerb: "evaluate", scaffoldPrompts: ["Select two significant events and explain the student's authorised action, result and feedback.", "Translate the evidence into transferable capabilities and identify context limits.", "Compare three pathways against goals, requirements, gaps, resources and commitments.", "Recommend a next step with support, progress evidence, contingency and review point."], successCriteria: ["Uses specific evidence without exaggerating the experience.", "Treats one experience as informative but not career-determining.", "Verifies current pathway facts from the provider or official source, or states that they still require confirmation."], theoryAnchors: ["M10-S03-theory", "M10-S03-example"] }
          })
        ]
      }
    }
  };
})(window);

window.WORK_STUDIES_VISUALS = {
  "C00-S01": {
    "caption": "Contemporary work often links people, places and digital tools inside one task.",
    "notice_prompt": "Notice which parts of the task happen locally and remotely. How does the technology change the worker's role?",
    "alt_text": "Warehouse worker using a tablet video call to coordinate with a remote colleague beside a loading area."
  },
  "C00-S02": {
    "caption": "Different interests point towards different possibilities; the decision comes from matching them with evidence about yourself and the pathway.",
    "notice_prompt": "Notice the contrasting objects. Which strengths or preferences might each represent, and what further evidence would a sound choice need?",
    "alt_text": "Young adult comparing a crafted object, headphones, garden tool and laptop beside blank pathway cards."
  },
  "C00-S03": {
    "caption": "A sustainable response to change combines learning, realistic routines and care for life beyond the job.",
    "notice_prompt": "Notice the work, learning and wellbeing cues in the same scene. Which one would be easiest to neglect during change?",
    "alt_text": "Adult worker at home with work clothing, online learning, enclosed shoes, lunch box and a flexible weekly planner."
  },
  "M01-S01": {
    "caption": "Different responsibilities meet around the same outcome, so one role's work affects the others.",
    "notice_prompt": "Notice the role cues around the prototype. What information or action must pass between the workers?",
    "alt_text": "Four adults with different work-role cues coordinating around a prototype and planning board in a clean workshop."
  },
  "M01-S02": {
    "caption": "Safe participation depends on people checking the setup, using suitable protection and raising concerns before the task starts.",
    "notice_prompt": "Notice the guard, boundary and protective equipment. What is being checked before anyone operates the machine?",
    "alt_text": "Two workers in protective equipment discussing a guarded stationary machine inside a marked exclusion area."
  },
  "M01-S03": {
    "caption": "Change is easier to understand and improve when workers can examine the process and contribute ideas.",
    "notice_prompt": "Notice who is speaking, who is listening and what the group is examining. What does that suggest about the workplace culture?",
    "alt_text": "Four adult workers in a standing huddle discussing an unbranded workflow diagram while the group listens."
  },
  "M02-S01": {
    "caption": "A useful application begins by comparing what the opportunity asks for with evidence of what the applicant can do.",
    "notice_prompt": "Notice the opportunity and three evidence sources. Which evidence appears most relevant, and what would still need checking?",
    "alt_text": "Adult comparing a generic job listing on a laptop with an anonymised certificate, work photograph and skills notebook."
  },
  "M02-S02": {
    "caption": "Evidence is strongest when it directly supports the claim and is chosen for the opportunity.",
    "notice_prompt": "Notice which items are being selected and which remain aside. What makes evidence relevant rather than merely impressive?",
    "alt_text": "Adult hands selecting a work-sample photograph and anonymised achievement record from an organised evidence folder."
  },
  "M02-S03": {
    "caption": "Practice becomes useful when the response, body language and feedback can be reviewed and improved.",
    "notice_prompt": "Notice the practice partner, recording device and reflection notebook. What could the applicant review after the rehearsal?",
    "alt_text": "Young adult rehearsing an interview with a supportive adult while an unbranded phone records the practice."
  },
  "M03-S01": {
    "caption": "The same message may need a different channel depending on who needs it, how quickly and whether a record matters.",
    "notice_prompt": "Notice the face-to-face, phone, video and written options. Which would suit an urgent clarification, and which would leave a useful record?",
    "alt_text": "Overhead desk showing a phone, video call, face-to-face meeting photograph, paper notice and clock around one blank message sheet."
  },
  "M03-S02": {
    "caption": "Professional communication stays clear and respectful when the spoken exchange and written follow-up support each other.",
    "notice_prompt": "Notice the worker speaking and writing during the same task. What details should remain consistent across both channels?",
    "alt_text": "Adult customer-service worker speaking through a headset while composing an unreadable follow-up message on a laptop."
  },
  "M03-S03": {
    "caption": "A difficult exchange can be repaired when people slow down, listen and clarify the issue together.",
    "notice_prompt": "Notice the seating, hand positions and neutral support person. Which cues suggest the conversation is moving towards repair?",
    "alt_text": "Two adult colleagues in a calm discussion with a neutral team leader listening at the same table."
  },
  "M04-S01": {
    "caption": "A shared goal becomes achievable when each person knows their role and can rely on the others' contribution.",
    "notice_prompt": "Notice who steadies, aligns and checks the setup. What could happen if one role stopped communicating?",
    "alt_text": "Three adult workers safely assembling an unbranded event shelter, with two aligning the frame and one checking the plan."
  },
  "M04-S02": {
    "caption": "Useful initiative moves beyond noticing: it produces alternatives that can be compared before a decision.",
    "notice_prompt": "Notice the three layouts and the bottleneck being discussed. What evidence could help the team choose between them?",
    "alt_text": "Two warehouse workers comparing three cardboard layout prototypes beside a laptop at a packing bench."
  },
  "M04-S03": {
    "caption": "Creativity becomes enterprise when it responds to a need, uses resources thoughtfully and produces value for someone.",
    "notice_prompt": "Notice the need photograph, material samples and prototypes. How is the maker testing more than appearance?",
    "alt_text": "Adult maker developing a compact stand from reclaimed material beside a user-need photograph and several prototypes."
  },
  "M05-S01": {
    "caption": "A workable plan includes boundaries and recovery, not only tasks and shifts.",
    "notice_prompt": "Notice the unfilled spaces and the cues for home and activity. Why might leaving capacity improve the plan?",
    "alt_text": "Adult hands arranging coloured time blocks on a weekly planner beside walking shoes, a house symbol and closed laptop."
  },
  "M05-S02": {
    "caption": "Support often begins with a private, respectful conversation before pressure becomes harder to manage.",
    "notice_prompt": "Notice the setting and listening posture. What makes this conversation more supportive than a rushed exchange on the job?",
    "alt_text": "Worker in high-visibility clothing having a quiet, attentive conversation with a colleague in a shaded outdoor break area."
  },
  "M05-S03": {
    "caption": "Life stages change the mix of responsibilities, so a useful working-life plan must be revised rather than simply followed.",
    "notice_prompt": "Notice the pathway tiles being rearranged. Which change might require a new sequence rather than abandoning the goal?",
    "alt_text": "Adult hands rearranging wooden symbols for study, work, home, caring and wellbeing beside a blank flexible planner."
  },
  "M06-S01": {
    "caption": "Financial records become useful when related documents can be checked against each other and stored securely.",
    "notice_prompt": "Notice the digital records and organised file. What details would need to match before the record could be trusted?",
    "alt_text": "Adult cross-checking blurred employment records on a tablet and phone beside an organised paper file."
  },
  "M06-S02": {
    "caption": "A budget directs available money towards current needs and future goals before extra spending decisions are made.",
    "notice_prompt": "Notice how the tokens are divided and where the bank card sits. Which allocations protect essentials and which build towards a goal?",
    "alt_text": "Hands allocating plain tokens among containers for housing, essentials, transport and a future goal beside an unbranded bank card."
  },
  "M06-S03": {
    "caption": "A sound consumer decision weighs what may happen after purchase as well as what is offered today.",
    "notice_prompt": "Notice the repair part, protection folder and energy cue. Which factor could matter most over the product's useful life?",
    "alt_text": "Adult comparing two unbranded appliances with a repair part, plain protection folder and generic energy-use card."
  },
  "M07-S01": {
    "caption": "A workplace issue often appears as a recurring pattern, not only as one person's difficult moment.",
    "notice_prompt": "Notice the roster, work stations and workers' attention. What repeated pattern would you investigate before drawing a conclusion?",
    "alt_text": "Three service workers examining an overcrowded blank roster board beside unevenly used work stations."
  },
  "M07-S02": {
    "caption": "A stronger analysis tests several forms of evidence and asks how the issue affects different people and outcomes.",
    "notice_prompt": "Notice the records, photographs, response sheet and perspective cards. What might one source reveal that another misses?",
    "alt_text": "Four adult workplace representatives examining anonymised records, process photographs, a survey sheet and coloured perspective cards."
  },
  "M07-S03": {
    "caption": "A response is stronger when the work system changes and affected people can access support and follow-up.",
    "notice_prompt": "Notice the adjusted workstation, support card and procedure folder. Which part addresses the system, and which supports the people?",
    "alt_text": "Three adults reviewing an adjusted office workstation with a blank support card and revised procedure folder."
  },
  "M08-S01": {
    "caption": "A useful micro-enterprise idea begins with a real problem and a practical response the owner can develop.",
    "notice_prompt": "Notice the bicycle-area problem and the organiser prototype. What would need testing before calling the idea viable?",
    "alt_text": "Adult at a community bicycle area examining a compact organiser prototype for loose riding accessories."
  },
  "M08-S02": {
    "caption": "A useful idea needs a workable system around it; delivery, resources, obligations and risk must connect.",
    "notice_prompt": "Notice the service map, customer item, payment device and risk tokens. Which connection would you test first?",
    "alt_text": "Adult micro-business owner mapping a repair service beside a customer item, payment device, plain folder and risk tokens."
  },
  "M08-S03": {
    "caption": "A plan becomes more credible when others can understand it, question it and influence the next version.",
    "notice_prompt": "Notice the prototype, visual plan and feedback cards. What evidence would justify changing the plan?",
    "alt_text": "Adult owner showing a plain prototype and visual plan to a mentor and potential user beside feedback cards and a laptop."
  },
  "M09-S01": {
    "caption": "A project purpose should answer an observed need, not merely justify a solution the team already prefers.",
    "notice_prompt": "Notice what the team is photographing, sorting and tracing. What evidence would help define the problem more precisely?",
    "alt_text": "Three adult team members documenting and mapping disorganised community-sports equipment in a hall."
  },
  "M09-S02": {
    "caption": "A deliverable plan connects who will act, what they need, when it happens, what may go wrong and how the team will stay informed.",
    "notice_prompt": "Notice the role, timeline, resource, risk and device cues. Which dependency could delay the rest of the plan?",
    "alt_text": "Four adults allocating coloured timeline blocks, role tokens, risk markers, resource samples and communication devices around a project table."
  },
  "M09-S03": {
    "caption": "Evaluation is persuasive when the delivered outcome, evidence of change and feedback can be examined together.",
    "notice_prompt": "Notice the before-and-after photographs, checklist and stakeholder discussion. What evidence supports a claim that the project helped?",
    "alt_text": "Adult project team member presenting before-and-after storage photographs and a feedback checklist to a stakeholder."
  },
  "M10-S01": {
    "caption": "Preparation reduces avoidable uncertainty and makes it easier to focus on learning once the experience begins.",
    "notice_prompt": "Notice the transport, clothing, contact and goal cues. Which item would be hardest to fix after arriving?",
    "alt_text": "Young adult checking a phone beside plain work clothing, enclosed shoes, lunch, water, blank contact card and learning-goal tokens."
  },
  "M10-S02": {
    "caption": "Workplace learning becomes usable evidence when the learner observes carefully, participates appropriately and records what happened.",
    "notice_prompt": "Notice the supervisor, low-risk task and notebook. What could the learner record without including private workplace information?",
    "alt_text": "Young adult potting a plant in gloves under an adult supervisor's guidance while writing observations in a notebook."
  },
  "M10-S03": {
    "caption": "Reflection asks what was learned, where that learning transfers and what action should follow.",
    "notice_prompt": "Notice the experience photographs and transferable-skill tokens. Which skill appears across more than one setting?",
    "alt_text": "Young adult and mentor matching work-experience photographs with tokens for people, process and growth on a blank planning board."
  }
};
