const resolveItemInRichText = require('./richTextResolver');

const calloutItem = {
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'premium_feature',
        type: 'callout'
    },
    content: {
        name: 'Content',
        value: 'Features described on this page require the Professional plan or higher.',
    },
    title: {
        name: 'Title',
        value: 'Premium feature'
    }
};

const differentItem = {
    ...calloutItem,
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'premium_feature',
        type: 'article'
    },
}

describe('resolveItemInRichText', () => {
    it('returns value of a callout content item', () => {
        const expectedResult = 'Features described on this page require the Professional plan or higher.'

        const actualResult = resolveItemInRichText(calloutItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns empty string of a non callout content item', () => {
        const expectedResult = '';

        const actualResult = resolveItemInRichText(differentItem);

        expect(actualResult).toEqual(expectedResult);
    });
});