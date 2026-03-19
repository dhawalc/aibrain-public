export const AGENT_ORDER = [
  'trend_scout',
  'keyword_hunter',
  'content_strategist',
  'research_summarizer',
  'article_writer',
  'seo_optimizer',
  'brand_editor',
  'fact_checker',
  'publisher',
  'performance_analyst',
]

const BASE_REQUIRED = ['run_id', 'agent', 'topic_id', 'timestamp', 'input', 'output', 'scores', 'next_action']

export function assertContract(stage) {
  for (const key of BASE_REQUIRED) {
    if (!(key in stage)) {
      throw new Error(`Invalid contract output. Missing key: ${key}`)
    }
  }

  if (typeof stage.agent !== 'string' || !AGENT_ORDER.includes(stage.agent)) {
    throw new Error(`Invalid agent in contract: ${stage.agent}`)
  }

  if (typeof stage.topic_id !== 'string' || stage.topic_id.length < 3) {
    throw new Error('Invalid topic_id in contract output')
  }

  if (!stage.scores || typeof stage.scores !== 'object') {
    throw new Error('scores must be an object in contract output')
  }

  if (!stage.output || typeof stage.output !== 'object') {
    throw new Error('output must be an object in contract output')
  }

  return stage
}

export function stageEnvelope({ runId, agent, topicId, input, output, scores, nextAction }) {
  return assertContract({
    run_id: runId,
    agent,
    topic_id: topicId,
    timestamp: new Date().toISOString(),
    input,
    output,
    scores,
    next_action: nextAction,
  })
}
