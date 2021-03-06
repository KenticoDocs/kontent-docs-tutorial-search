const { ItemRecordsCreator } = require('./itemRecordsCreator');
const {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    ContentChunkMarkStart,
    ContentChunkMarkEnd,
    ContentChunkHeadingMarkStart,
    ContentChunkHeadingMarkEnd,
    IsCodeSampleIdentifierMarkup,
} = require('./richTextLabels');

async function sanitizeContent(content) {
    return content;
}

const shortArticle = {
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'first_tutorial',
    },
    title: {
        name: 'Title',
        value: 'Tutorial',
    },
    shortTitle: {
        name: 'Short title',
        value: 'We will show you the basics',
    },
    author: {
        name: 'Author',
        value: 'smart guy',
    },
    description: {
        name: 'Description',
        value: 'This article explains how to do stuff',
    },
    contentType: {
        name: 'Content type',
        value: 'article',
    },
    content: {
        name: 'Content',
        value: '<p>We will start by running a React sample application on your machine and updating an article in the sample project.</p>\n<p>Afterward, we can continue doing this...</p>',
    },
};

const longArticle = {
    ...shortArticle,
    content: {
        name: 'Content',
        value: shortArticle.content.value + '<h2>More options</h2> <p>To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see <a href="https://kontent.ai/docs/strongly-typed-models">Using strongly typed models</a>.</p>',
    },
};

const articleWithInnerItemAndMultiplePlatforms = {
    ...longArticle,
    content: {
        name: 'Content',
        value: longArticle.content.value
            + `${InnerItemMarkStart}New to headless CMS?\nIf you are new to the world of headless CMSs, you might want to start by building a Hello world application. It will only take you about 5 minutes!\nAfter you grasp the core idea behind a headless CMS, everything in the sample application will make a lot more sense much faster.${InnerItemMarkEnd}`
            + '<h2>Making changes to your project</h2>\n<p>After signing in to your <a href="http://some.website.com">Kentico Cloud</a> account you will see your sample project to play around with.</p>\n',
    },
    platform: {
        type: 'taxonomy',
        name: 'Platform',
        value: [
            {
                name: 'JavaScript',
                codename: 'javascript',
            },
            {
                name: 'Java',
                codename: 'java',
            },
        ],
    },
};

const articleWithMultipleCallouts = {
    ...shortArticle,
    content: {
        name: 'Content',
        value: `${InnerItemMarkStart}Callout number 1${InnerItemMarkEnd}`
            + '<p>Some paragraph between two components</p>'
            + '<h2>Heading</h2>\n<p><strong>Text about Kentico Cloud</strong></p>'
            + `${InnerItemMarkStart}Callout number 2 Very useful advice about KC${InnerItemMarkEnd}`
            + `${InnerItemMarkStart}Callout number 3${InnerItemMarkEnd}`
            + '<p>Some paragraph between a component and a heading</p>'
            + '<h2>Running the .NET MVC sample application</h2>\n<p>Before going any further, make sure you have the following.</p>'
            + '<h2>First run of the sample app</h2>\n<p>When you run the application for the first time, you will see a Configuration page. Use it to connect the app to your sample project in Kentico Cloud.</p>'
            + `${InnerItemMarkStart}${PlatformMarkStart}js${PlatformMarkEnd}alert('Hello, world!');${InnerItemMarkEnd}`,
    },
};

const articleWithContentChunkAndCodeSample = {
    ...shortArticle,
    content: {
        name: 'Content',
        value: 'start of an article'
            + `${ContentChunkMarkStart}${PlatformMarkStart}java,javascript,_net${PlatformMarkEnd}`
            + `${ContentChunkHeadingMarkStart}Content chunk heading${ContentChunkHeadingMarkEnd}content chunk text`
            + `${InnerItemMarkStart}Callout inside a content chunk item${InnerItemMarkEnd}`
            + `${InnerItemMarkStart}${IsCodeSampleIdentifierMarkup}${PlatformMarkStart}typescript${PlatformMarkEnd}Code sample inside of a content chunk item ${InnerItemMarkEnd}`
            + `${ContentChunkHeadingMarkStart}Another content chunk heading${ContentChunkHeadingMarkEnd}Text that ends a content chunk. ${ContentChunkMarkEnd}`
            + `end of an article`,
    },
};

describe('searchableArticleCreator', () => {
    const firstParagraph = {
        content: 'We will start by running a React sample application on your machine and updating an article in the sample project.\nAfterward, we can continue doing this...',
        title: 'Tutorial',
        heading: '',
        codename: 'first_tutorial',
        order: 1,
        objectID: 'first_tutorial_1',
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        isCodeSample: false,
        platforms: [],
        section: 'tutorials',
    };

    const secondParagraph = {
        content: 'To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see Using strongly typed models.',
        title: 'Tutorial',
        heading: 'More options',
        codename: 'first_tutorial',
        order: 2,
        objectID: 'first_tutorial_2',
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        isCodeSample: false,
        platforms: [],
        section: 'tutorials',
    };

    const itemRecordsCreator = new ItemRecordsCreator(sanitizeContent);

    test('creates a correct single article chunk and sanitizes its content', async () => {
        const expectedResult = [firstParagraph];

        const actualResult = await itemRecordsCreator.createItemRecords(
            shortArticle,
            shortArticle.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('splits a longer article into 2 chunks and sanitizes their content', async () => {
        const expectedResult = [firstParagraph, secondParagraph];

        const actualResult = await itemRecordsCreator.createItemRecords(
            longArticle,
            longArticle.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('splits article with an inner item and multiple platforms correctly', async () => {
        const expectedResult = [
            {
                ...firstParagraph,
                platforms: [
                    'javascript',
                    'java',
                ],
            },
            {
                ...secondParagraph,
                platforms: [
                    'javascript',
                    'java',
                ],
            }, {
                content: 'New to headless CMS?\nIf you are new to the world of headless CMSs, you might want to start by building a Hello world application. It will only take you about 5 minutes!\nAfter you grasp the core idea behind a headless CMS, everything in the sample application will make a lot more sense much faster.',
                title: 'Tutorial',
                heading: 'More options',
                codename: 'first_tutorial',
                order: 3,
                objectID: 'first_tutorial_3',
                id: '59c40872-521f-4883-ae6e-4d11b77797e4',
                isCodeSample: false,
                platforms: [
                    'javascript',
                    'java',
                ],
                section: 'tutorials',
            }, {
                content: 'After signing in to your Kentico Cloud account you will see your sample project to play around with.',
                title: 'Tutorial',
                heading: 'Making changes to your project',
                codename: 'first_tutorial',
                order: 4,
                objectID: 'first_tutorial_4',
                id: '59c40872-521f-4883-ae6e-4d11b77797e4',
                isCodeSample: false,
                platforms: [
                    'javascript',
                    'java',
                ],
                section: 'tutorials',
            }];

        const actualResult = await itemRecordsCreator.createItemRecords(
            articleWithInnerItemAndMultiplePlatforms,
            articleWithInnerItemAndMultiplePlatforms.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('handles indexing of multiple components in an article', async () => {
        const expectedResult = [{
            content: 'Callout number 1',
            title: 'Tutorial',
            heading: '',
            codename: 'first_tutorial',
            order: 1,
            objectID: 'first_tutorial_1',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Some paragraph between two components',
            title: 'Tutorial',
            heading: '',
            codename: 'first_tutorial',
            order: 2,
            objectID: 'first_tutorial_2',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Text about Kentico Cloud',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 3,
            objectID: 'first_tutorial_3',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Callout number 2 Very useful advice about KC',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 4,
            objectID: 'first_tutorial_4',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Callout number 3',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 5,
            objectID: 'first_tutorial_5',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Some paragraph between a component and a heading',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 6,
            objectID: 'first_tutorial_6',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'Before going any further, make sure you have the following.',
            title: 'Tutorial',
            heading: 'Running the .NET MVC sample application',
            codename: 'first_tutorial',
            order: 7,
            objectID: 'first_tutorial_7',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'When you run the application for the first time, you will see a Configuration page. Use it to connect the app to your sample project in Kentico Cloud.',
            title: 'Tutorial',
            heading: 'First run of the sample app',
            codename: 'first_tutorial',
            order: 8,
            objectID: 'first_tutorial_8',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: ' alert(\'Hello, world!\');',
            title: 'Tutorial',
            heading: 'First run of the sample app',
            codename: 'first_tutorial',
            order: 9,
            objectID: 'first_tutorial_9',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: ['js'],
            section: 'tutorials',
        }];

        const actualResult = await itemRecordsCreator.createItemRecords(
            articleWithMultipleCallouts,
            articleWithMultipleCallouts.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('handles indexing of content chunk item, assigns platform element and headings within content chunk correctly', async () => {
        const expectedResult = [{
            content: 'start of an article',
            title: 'Tutorial',
            heading: '',
            codename: 'first_tutorial',
            order: 1,
            objectID: 'first_tutorial_1',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }, {
            content: 'content chunk text',
            title: 'Tutorial',
            heading: 'Content chunk heading',
            codename: 'first_tutorial',
            order: 2,
            objectID: 'first_tutorial_2',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: ['java', 'javascript', '_net'],
            section: 'tutorials',
        }, {
            content: 'Callout inside a content chunk item',
            title: 'Tutorial',
            heading: 'Content chunk heading',
            codename: 'first_tutorial',
            order: 3,
            objectID: 'first_tutorial_3',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: ['java', 'javascript', '_net'],
            section: 'tutorials',
        }, {
            content: ' Code sample inside of a content chunk item',
            title: 'Tutorial',
            heading: 'Content chunk heading',
            codename: 'first_tutorial',
            order: 4,
            objectID: 'first_tutorial_4',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: true,
            platforms: ['typescript'],
            section: 'tutorials',
        }, {
            content: 'Text that ends a content chunk.',
            title: 'Tutorial',
            heading: 'Another content chunk heading',
            codename: 'first_tutorial',
            order: 5,
            objectID: 'first_tutorial_5',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: ['java', 'javascript', '_net'],
            section: 'tutorials',
        }, {
            content: 'end of an article',
            title: 'Tutorial',
            heading: 'Another content chunk heading',
            codename: 'first_tutorial',
            order: 6,
            objectID: 'first_tutorial_6',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
            isCodeSample: false,
            platforms: [],
            section: 'tutorials',
        }];

        const actualResult = await itemRecordsCreator.createItemRecords(
            articleWithContentChunkAndCodeSample,
            articleWithContentChunkAndCodeSample.content.value);

        expect(actualResult).toEqual(expectedResult);
    });
});
