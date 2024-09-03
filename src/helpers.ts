const slackHook = process.env.SLACK_HOOK;

type SlackData = {
  version: string;
};

const buildSlackMessage = ({ version }: SlackData) => {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Ny versjon: ${version}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'En ny versjon har nettopp blitt satt i prod! :tada: Nedenfor er en oppsummering av viktigste metrikker fra Lighthouse.',
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'emoji',
                name: 'white_check_mark',
              },
              {
                type: 'text',
                text: ' ',
              },
              {
                type: 'text',
                text: 'First Contentful Paint: 1,7s',
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'emoji',
                name: 'warning',
              },
              {
                type: 'text',
                text: ' ',
              },
              {
                type: 'text',
                text: 'Largest Contentful Paint: 2,6s',
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'emoji',
                name: 'grimacing',
              },
              {
                type: 'text',
                text: ' ',
              },
              {
                type: 'text',
                text: 'Total bundle-størrelse: 554 kb',
              },
            ],
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Åpne hele rapporten her :link:',
              emoji: true,
            },
            value: 'open-report',
            action_id: 'open-report',
          },
        ],
      },
    ],
  };
};

export const sendToSlack = async ({ version }: SlackData) => {
  if (!slackHook) {
    console.error('Missing SLACK_HOOK environment variable');
    return;
  }

  const data = JSON.stringify(buildSlackMessage({ version }));

  fetch(slackHook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length.toString(),
    },
    body: data,
  });
};
