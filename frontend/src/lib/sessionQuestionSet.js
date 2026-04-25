const roleConfigs = {
  "frontend developer": {
    defaults: ["React", "JavaScript", "accessibility", "performance"],
    themes: [
      ["component architecture", "Build a reusable UI structure around"],
      ["page performance", "How would you debug a slow experience involving"],
      ["accessibility", "How would you make a feature accessible when using"],
      ["API state", "How would you manage server state for"],
      ["bundle optimization", "What would you do to reduce bundle cost around"],
      ["render behavior", "How would you prevent unnecessary re-renders in"],
      ["testing", "How would you test a workflow built with"],
      ["responsive design", "What matters most when making"],
      ["error handling", "How would you surface API failures in"],
      ["project story", "How would you explain a production improvement in"],
    ],
  },
  "backend developer": {
    defaults: ["API design", "databases", "authentication", "scalability"],
    themes: [
      ["resource design", "How would you design an API around"],
      ["query performance", "How would you diagnose a slow endpoint backed by"],
      ["schema design", "What schema choices would you make for"],
      ["auth", "How would you secure an API handling"],
      ["indexing", "How would you decide whether"],
      ["resilience", "How would you handle external dependency failure in"],
      ["caching", "When would you cache responses for"],
      ["observability", "What would you log and measure for"],
      ["transactions", "How would you approach data consistency in"],
      ["maintainability", "How would you structure backend code for"],
    ],
  },
  "full stack developer": {
    defaults: ["React", "Node.js", "APIs", "databases"],
    themes: [
      ["end-to-end design", "How would you build a full feature around"],
      ["validation", "What validation belongs on the client versus server for"],
      ["render strategy", "When would you prefer server rendering for"],
      ["bug tracing", "How would you debug a broken flow involving"],
      ["contract design", "How do you keep frontend and backend aligned for"],
      ["authentication", "How would you describe the auth flow for"],
      ["performance", "How would you improve latency across"],
      ["optimistic UI", "When is optimistic UI a good fit for"],
      ["testing", "What test layers would you add to"],
      ["project explanation", "How would you present a project built around"],
    ],
  },
  "software engineer": {
    defaults: ["system design", "debugging", "testing", "data structures"],
    themes: [
      ["trade-offs", "What trade-offs matter most when building"],
      ["problem solving", "How would you break down a requirement involving"],
      ["debugging", "How would you debug a hard-to-reproduce issue in"],
      ["code quality", "What makes code around"],
      ["shipping pace", "How do you balance speed and quality while building"],
      ["design discussion", "How would you discuss the design of"],
      ["test strategy", "How do you decide what to test in"],
      ["failure handling", "How would you design for failure in"],
      ["code review", "What would you look for in a review touching"],
      ["impact story", "How would you explain the impact of work on"],
    ],
  },
  "devops engineer": {
    defaults: ["CI/CD", "Docker", "Kubernetes", "monitoring"],
    themes: [
      ["pipeline design", "How would you design a deployment pipeline for"],
      ["incident response", "What would you check first in a failed release affecting"],
      ["containerization", "How would you build a production-ready image for"],
      ["infrastructure as code", "How would you use IaC for"],
      ["metrics", "What would you monitor first for"],
      ["secrets", "How would you handle secrets used by"],
      ["release strategy", "When would you use canary or blue-green for"],
      ["cost control", "How would you reduce cloud cost for"],
      ["cluster debugging", "How would you troubleshoot networking issues in"],
      ["on-call", "How would you describe your role during an incident involving"],
    ],
  },
  "data engineer": {
    defaults: ["ETL", "pipelines", "data modeling", "warehousing"],
    themes: [
      ["pipeline design", "How would you design a reliable pipeline for"],
      ["batch vs streaming", "When would you choose streaming over batch for"],
      ["partitioning", "How would you partition data for"],
      ["schema evolution", "How would you handle schema changes in"],
      ["quality", "What data quality checks would you add to"],
      ["query optimization", "How would you optimize warehouse queries for"],
      ["platform choice", "When would you choose a lake versus warehouse for"],
      ["orchestration", "How would you orchestrate dependencies in"],
      ["idempotency", "Why does idempotency matter in"],
      ["project explanation", "How would you explain the impact of a data project on"],
    ],
  },
  "machine learning engineer": {
    defaults: ["model deployment", "feature pipelines", "evaluation", "monitoring"],
    themes: [
      ["offline vs online", "How would you explain offline metrics versus production impact for"],
      ["feature consistency", "How would you keep training and serving aligned for"],
      ["drift", "What would you check if performance dropped on"],
      ["latency", "How would you serve a low-latency model for"],
      ["data leakage", "How would you prevent leakage in"],
      ["experiment tracking", "What should be tracked for experiments on"],
      ["monitoring", "How would you monitor an ML service handling"],
      ["retraining", "When would you retrain a model powering"],
      ["model choice", "How would you justify a simpler model for"],
      ["project story", "How would you present a production ML project involving"],
    ],
  },
  "qa engineer": {
    defaults: ["test automation", "regression", "API testing", "bug triage"],
    themes: [
      ["strategy", "How would you build a test strategy for"],
      ["UI automation", "What keeps UI automation stable for"],
      ["flaky tests", "How would you investigate flaky tests around"],
      ["API coverage", "What non-happy-path cases would you test for"],
      ["bug reports", "What would you include in a bug report for"],
      ["CI balance", "How do you decide which tests for"],
      ["third-party integrations", "How would you test integration-heavy"],
      ["regression planning", "How would you create regression coverage after a defect in"],
      ["ambiguous requirements", "How do you test when the requirements for"],
      ["role value", "How would you explain QA impact on"],
    ],
  },
  "cloud engineer": {
    defaults: ["IAM", "networking", "load balancing", "infrastructure as code"],
    themes: [
      ["high availability", "How would you design a highly available setup for"],
      ["IAM", "How would you explain authentication and authorization for"],
      ["network debugging", "How would you troubleshoot public access to"],
      ["storage choice", "When would you choose object storage for"],
      ["autoscaling", "How would you tune autoscaling for"],
      ["monitoring", "What would you monitor first for"],
      ["cost control", "How would you keep cost under control for"],
      ["IaC", "How would you use infrastructure as code for"],
      ["database bottlenecks", "How would you handle a cloud database bottleneck for"],
      ["backup and DR", "How would you explain disaster recovery planning for"],
    ],
  },
  "cybersecurity engineer": {
    defaults: ["OWASP", "least privilege", "incident response", "threat modeling"],
    themes: [
      ["least privilege", "How would you apply least privilege to"],
      ["authorization flaws", "How would you test for broken authorization in"],
      ["OWASP", "How would you talk about OWASP risks in"],
      ["secret handling", "How would you manage secrets used by"],
      ["security alerts", "How would you respond to a credential compromise affecting"],
      ["threat modeling", "How would you threat-model"],
      ["authentication", "How would you describe secure authentication for"],
      ["cloud posture", "What would you review first in the security posture of"],
      ["vulnerability management", "How would you prioritize vulnerabilities found in"],
      ["security project story", "How would you explain a security improvement for"],
    ],
  },
};

function normalizeRole(role) {
  return role?.trim().toLowerCase() || "software engineer";
}

function experienceNote(experience) {
  const value = (experience || "").toLowerCase();
  if (value.includes("fresher") || value.includes("0-1")) {
    return "I would keep the answer grounded in fundamentals, clear reasoning, and practical entry-level implementation choices.";
  }
  if (value.includes("2-3")) {
    return "I would describe concrete implementation decisions, trade-offs, and how I validated the solution in practice.";
  }
  if (value.includes("4-6")) {
    return "I would include design trade-offs, production behavior, and how the decision affects reliability, scale, and maintainability.";
  }
  if (value.includes("7+")) {
    return "I would frame the answer at a system level, including architecture, team-level trade-offs, and operational impact.";
  }
  return "I would keep the answer practical and tied to the real behavior of the system.";
}

function pickTopics(rawTopics, roleKey) {
  const listed = (rawTopics || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item.toLowerCase() !== "any");

  const defaults = roleConfigs[roleKey]?.defaults || roleConfigs["software engineer"].defaults;
  return [...listed, ...defaults].slice(0, 4);
}

function buildAnswer(role, experience, topic, theme) {
  return `For a ${experience} ${role}, I would start by clarifying the requirement and the constraints around ${topic}. Then I would explain a practical implementation path, the main trade-offs in ${theme}, and how I would validate the result with logs, tests, metrics, or user-facing behavior. ${experienceNote(experience)}`;
}

export function buildSessionQuestionSet(session) {
  const roleKey = normalizeRole(session.role);
  const config = roleConfigs[roleKey] || roleConfigs["software engineer"];
  const topics = pickTopics(session.topics, roleKey);

  return config.themes.slice(0, 10).map(([theme, lead], index) => {
    const topic = topics[index % topics.length];
    return {
      id: `${session.id || session._id}-q${index + 1}`,
      number: index + 1,
      question: `${lead} ${topic} in a ${session.role} interview for someone with ${session.experience} experience?`,
      answer: buildAnswer(session.role, session.experience, topic, theme),
    };
  });
}
