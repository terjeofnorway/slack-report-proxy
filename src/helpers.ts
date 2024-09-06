const slackHook = process.env.SLACK_HOOK;

type SlackData = {
    version: string;
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    speedIndex: string;
    timeToInteractive: string;
    totalResourceSize: number;
    totalTransferSize: number;
};

const buildSlackMessage = ({
    version,
    firstContentfulPaint,
    largestContentfulPaint,
    speedIndex,
    timeToInteractive,
    totalResourceSize,
    totalTransferSize,
}: SlackData) => {
    const bundleSize = totalResourceSize / 1024;
    const bundleSizeInKb = bundleSize.toFixed(2);
    const bundleDisplaySize = `${bundleSizeInKb} kb`;

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
                                text: `First Contentful Paint: ${firstContentfulPaint}`,
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
                                name: 'white_check_mark',
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                            {
                                type: 'text',
                                text: `Largest Contentful Paint: ${largestContentfulPaint}`,
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
                                name: 'white_check_mark',
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                            {
                                type: 'text',
                                text: `Speed Index: ${speedIndex}`,
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
                                text: `Time to interactive: ${timeToInteractive}`,
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
                                name: bundleSize > 500 ? 'grimacing' : 'white_check_mark',
                            },
                            {
                                type: 'text',
                                text: ' ',
                            },
                            {
                                type: 'text',
                                text: `Total første nettverkslast: ${bundleDisplaySize}`,
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

type NetworkRequestItem = {
    transferSize: number;
    resourceSize: number;
};

export const calculateTotalRequest = (networkRequests: NetworkRequestItem[]) => {
    const totalResourceSize = networkRequests.reduce((acc, { resourceSize }) => acc + resourceSize, 0);
    const totalTransferSize = networkRequests.reduce((acc, { transferSize }) => acc + transferSize, 0);

    return { totalResourceSize, totalTransferSize };
};

export const sendToSlack = async (slackData: SlackData) => {
    if (!slackHook) {
        console.error('Missing SLACK_HOOK environment variable');
        return;
    }

    const data = JSON.stringify(buildSlackMessage(slackData));

    fetch(slackHook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length.toString(),
        },
        body: data,
    });
};
